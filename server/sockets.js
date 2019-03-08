const Game = require('./schemas/schemaGame.js');
const User = require('./schemas/schemaUser.js');

/** IMPORTANT

-Tableau dynamique qui gère l'ensemble des parties.
allCurrentGames[ idPartie ] = {
      -gameId : identifiant de la partie, => exple = dh7EgA
      -nbPlayers : {,
        current : nombre de joueurs dans la partie, => exple = 1
        max : nombre de joueur max, => exple = 2
       } ,
      -players : tableau contenant les pseudo des joueurs de la partie => exple : ["Steve", "Guillaume", "Nathan", "Youssef"]
      -games : tableau contenant les jeux selectionnées par le créateur de la partie => exple : ["TicTacToe", "Puissance4", etc.]
      -state : état de la partie. Elle peut prendre plusieurs états => 0 = En attente de joueurs, 1 = Partie complete,2 = Partie en cours,3 = Partie terminée"
    }

-Communications SocketIO en temps réel
Exemple :
// -CLIENT //
   -socket.emit("Ca va ?") => Le client envoie un message "Ca va ?", puis attend une réponse

   -socket.on("Oui", function(socket){       => S'il recoit oui comme réponse, il répond "Moi aussi"
      -socket.emit("Moi aussi")
   })
   -socket.on("Non", function(socket){       => S'il recoit non comme réponse, il répond "Pourquoi?"
      -socket.emit("Pourquoi")
   })

// -SERVEUR //
=> Le serveur écoute les messages de type "Ca va ?"

   -socket.on("Ca va ?", function(socket){
      -socket.emit("Oui") => Le serveur répond "Oui" au message
   })
**/


module.exports = function(io){

  // Variable Globale
  var allCurrentGames = {};

  /** ECOUTE DES CONNECTIONS CLIENTS **/
  io.sockets.on('connection', function(socket){
    console.log("User connected");


      /** JOUEUR INIT UNE PARTIE **/
      socket.on('init-game', function(_dataGame){
        console.log("Init Game");
        // Si la partie n'est pas initialisée
        if(typeof allCurrentGames[_dataGame.gameId] === "undefined"){
            // On cherche la partie dans la base de donnée
            Game.findOne().where("gameId").equals(_dataGame.gameId).exec(function(err,currentGame){
              // Si erreur
              if( currentGame !== null ){
                  // Init tableau temps reel des parties
                  allCurrentGames[_dataGame.gameId] = {
                      gameId : _dataGame.gameId,
                      nbPlayers : {
                        current : 0,
                        max : currentGame.nbPlayers.max,
                      } ,
                      players : [],
                      games : currentGame.games,
                      state : currentGame.state,
                      allStats : {}
                 }
                 socket.emit('ack-init-game', {ack :'ok'});
              }
            });
        }else{
                 socket.emit('ack-init-game', {ack :'ok'});
        }
      });

      /** JOUEUR REJOINS UNE PARTIE **/
      socket.on('join-game', function(_dataGame){
            //On ajoute le joueur à la "room"
           socket.join(_dataGame.gameId);
           console.log("User joins game");
           var samePlayer = false;
            // Ajout du nouveau joueur
           var currentPlayers = allCurrentGames[_dataGame.gameId].players;
           currentPlayers.forEach(function(p) {
               if(_dataGame.player === p){
                 samePlayer=true;
               }
           });
           // Si ce n'est pas un joueur déjà présent dans la partie et que la partie n'est pas pleine
           if(!samePlayer &&  allCurrentGames[_dataGame.gameId].state===0){
                allCurrentGames[_dataGame.gameId].players[currentPlayers.length] = _dataGame.player;
                allCurrentGames[_dataGame.gameId].nbPlayers.current = allCurrentGames[_dataGame.gameId].players.length ;
           }
           // Si la partie est pleine
           if(allCurrentGames[_dataGame.gameId].nbPlayers.current === allCurrentGames[_dataGame.gameId].nbPlayers.max){
               allCurrentGames[_dataGame.gameId].state=1;
           }

          allCurrentGames[_dataGame.gameId].allStats[_dataGame.player] = {
             victory : _dataGame.victory,
             defeat : _dataGame.defeat,
             equality : _dataGame.equality,
           }
           // Envoie de la mise à jour de la partie à tout les joueurs
           io.sockets.to(_dataGame.gameId).emit('ack-join-game', {dataGame :allCurrentGames[_dataGame.gameId]});
      });


      /** JOUEUR QUITTE UNE PARTIE **/
      socket.on('exit-game', function(_dataGame){
          console.log("User exits game room");
          // Suppression du joueur
          allCurrentGames[_dataGame.gameId].players.splice( allCurrentGames[_dataGame.gameId].players.indexOf(_dataGame.player), 1 );
          // Mise à jour du nombre de joueurs
          allCurrentGames[_dataGame.gameId].nbPlayers.current--;
          if( allCurrentGames[_dataGame.gameId].nbPlayers.current === 0 ){
              // Suppression de la partie
              delete allCurrentGames[_dataGame.gameId];
              Game.remove({gameId : _dataGame.gameId},function(err, countRemoved){
                  console.log("Game "+ _dataGame.gameId +" canceled");
                  io.sockets.to(_dataGame.gameId).emit('ack-exit-game');
              })
            }else{
              // Si la partie n'est pas pleine
              if(allCurrentGames[_dataGame.gameId].nbPlayers.current <= allCurrentGames[_dataGame.gameId].nbPlayers.max){
                  allCurrentGames[_dataGame.gameId].state=0;
              }
              io.sockets.to(_dataGame.gameId).emit('ack-join-game', {dataGame :allCurrentGames[_dataGame.gameId]});
            }
            // Mise à jour de la liste des joueuers
            socket.emit('ack-exit-game', {ack :'ok'});
      });


      /** LANCEMENT D'UNE PARTIE **/
      socket.on('launch-game', function(_dataGame){
          console.log("Launch Game");
          console.log(allCurrentGames[_dataGame.gameId]);
          // Si il y a le bon nombre de joueur (etat 1 = partie pleine)
          if( allCurrentGames[_dataGame.gameId].state === 1 ){
            // On lance la partie (etat 2 = partie en cours)
            allCurrentGames[_dataGame.gameId].state = 2;
            //  On met à jour la base de données
            Game.update({ gameId : _dataGame.gameId },
                 {
                   nbPlayers : {
                     current : allCurrentGames[_dataGame.gameId].nbPlayers.current,
                     max : allCurrentGames[_dataGame.gameId].nbPlayers.max,
                   },
                   players : allCurrentGames[_dataGame.gameId].players,
                   games : allCurrentGames[_dataGame.gameId].games,
                   state : allCurrentGames[_dataGame.gameId].state,
             });
        }
        // Lancement de la partie
        io.sockets.to(_dataGame.gameId).emit('ack-launch-game', {dataGame : allCurrentGames[_dataGame.gameId]});
    });


    /** LANCEMENT D'UNE PARTIE **/
    socket.on('init-tictactoe', function(_dataGame){
        console.log("Init new tic tac toe");
        var data = {
             players : allCurrentGames[_dataGame.gameId].players,
             state : {},
       }
     socket.join(_dataGame.gameId);
     io.sockets.to(_dataGame.gameId).emit('ack-init-tictactoe', {  dataTicTacToe : data});
    });

    /** A CHAQUE TOUR **/
    socket.on('turn-tictactoe', function(data){
        console.log("Turn tic tac toe");
      // Partage de l'état de la partie avec les autres joueurs
     io.sockets.to(data.gameId).emit('ack-turn-tictactoe', {data });
    });

    /** Fin du tic tac toe **/
    socket.on('end-tictactoe', function(data){
        console.log("End tic tac toe");
        var playerX = allCurrentGames[data.gameId].players[0];
        var playerO = allCurrentGames[data.gameId].players[1];
        var winner = "";
        /** Enregistrement des résultats **/
        if(data.winner ==="="){
          User.findOneAndUpdate({login: playerX}, {$inc : {equality : 0.5}},function(err, response){});
          User.findOneAndUpdate({login: playerO}, {$inc : {equality : 0.5}},function(err, response){});
          winner = "Egalité !";
        }
        if(data.winner ==="x"){
          User.findOneAndUpdate({login: playerX}, {$inc : {victory : 0.5}},function(err, response){});
          User.findOneAndUpdate({login: playerO}, {$inc : {defeat : 0.5}},function(err, response){});
          winner = playerX + "  à gagné !";
        }
        if(data.winner ==="o"){
          User.findOneAndUpdate({login: playerX}, {$inc : {defeat : 0.5}},function(err, response){});
          User.findOneAndUpdate({login: playerO}, {$inc : {victory : 0.5}},function(err, response){});
          winner = playerO + " à gagné !";
        }
        /** Mise a jour de la partie **/
        Game.update({ gameId : data.gameId },{state : 3});
        // Partage de l'état de la partie avec les autres joueurs
        io.sockets.to(data.gameId).emit('ack-end-tictactoe', {winner});
    });

    /** Quitte la partie **/
    socket.on('exit-tictactoe', function(data){
      // Suppression de la partie
  //    delete allCurrentGames[data];
      Game.remove({gameId : data},function(err, countRemoved){
          console.log("Game "+ data +" canceled");
          io.sockets.to(data).emit('ack-exit-game');
      })
      io.sockets.to(data).emit('ack-exit-tictactoe', {data});
    });

    /** Rejouer la partie **/
    socket.on('replay-tictactoe', function(data){
      io.sockets.to(data).emit('ack-replay-tictactoe', {data});
    });

    /** Envoie du chat aux clients**/
    socket.on('message', function(data_msg){
    io.sockets.to(data_msg.gameId).emit('ack-message', 
    { message : data_msg.message, 
      user : data_msg.user,
      heure :  data_msg.heure,
      minute: data_msg.minute,
      seconde: data_msg.seconde});
    });
  });

  


}

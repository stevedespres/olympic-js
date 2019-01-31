const Game = require('./schemas/schemaGame.js');
const GameCtrl = require('./controllers/game/game.js');

// SOCKET IO
module.exports = function(io){

  //Variables Globales
  var allCurrentGames = {};

  /** ECOUTE DES CONNECTIONS CLIENTS **/
  io.sockets.on('connection', function(socket){
    console.log("User connected");


      /** JOUEUR INIT UNE PARTIE **/
      socket.on('init-game', function(_dataGame){

        // Si la partie n'est pas initialisée
        if(typeof allCurrentGames[_dataGame.gameId] === "undefined"){

            console.log(_dataGame);
            // On cherche la partie dans la base de donnée
            Game.findOne().where("gameId").equals(_dataGame.gameId).exec(function(err,currentGame){
              // Si erreur
              if( currentGame === null ){
                  error = true;
                  error_message = "La partie n'existe pas ou n'est pas joignable";
              // Sinon
              }else{
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
                 }
                 console.log("Init Games tab ");
                 console.log(allCurrentGames[_dataGame.gameId]);
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
           console.log(allCurrentGames[_dataGame.gameId]);
           var samePlayer = false;
            // Ajout du nouveau joueur
           var currentPlayers = allCurrentGames[_dataGame.gameId].players;
           currentPlayers.forEach(function(p) {
               if(_dataGame.player === p){
                 samePlayer=true;
               }
           });

           if(!samePlayer){
                allCurrentGames[_dataGame.gameId].players[currentPlayers.length] = _dataGame.player;
                allCurrentGames[_dataGame.gameId].nbPlayers.current++;
           }

           console.log("MaJ Games tab ");
           console.log(allCurrentGames[_dataGame.gameId]);
           // Envoie de la mise à jour de la partie à tout les joueurs
           io.sockets.to(_dataGame.gameId).emit('ack-join-game', {dataGame :allCurrentGames[_dataGame.gameId]});
      });


      /** JOUEUR QUITTE UNE PARTIE **/
      socket.on('exit-game', function(_dataGame){
          console.log(_dataGame);
          console.log("exit game");
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
              // Mise à jour de la liste des joueuers
              io.sockets.to(_dataGame.gameId).emit('ack-join-game', {dataGame :allCurrentGames[_dataGame.gameId]});
            }
      });
  });
}

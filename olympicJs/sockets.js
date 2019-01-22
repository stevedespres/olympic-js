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
                        current : currentGame.players.length,
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
           socket.emit('ack-join-game', {dataGame :allCurrentGames[_dataGame.gameId]});
      });






  });
}

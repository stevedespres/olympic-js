const User = require('../../schemas/schemaUser.js');

/**
Fonction JoinGame : rejoindre une partie
**/
exports.joingame = function(req, res) {


      var success = true;
      var result = "";

      //REGEX
      var gameIdRegex = /[a-zA-Z0-9._-]{6}/;

      //Test du format de l'id de la partie
      if (!gameIdRegex.test(req.body.gameId)) {
          result += "L'identifiant de la partie n'est pas au bon format\n";
          success = false;
      }
/*
      // Verification que la partie à rejoindre existe, qu'elle n'est pas complète ni terminée
      var findGame = new Promise(function (resolve, reject) {
            Game.findOne({
                gameId: req.body.gameId
            }, function (err, res) {
                // Si erreur lors de la recherche
                if (err) {
                    // La partie n'existe pas
                    reject(500);
                } else {
                    // Si le login est déjà dans la BDD
                    if (res) {
                        // Erreur 204
                        reject(204)
                    } else {
                        // Sinon ok
                        resolve(true)
                    }
                }
            })
        })

      // Verification que le joueur qui souhaite rejoindre la partie existe bien
      var findUser = new Promise(function (resolve, reject) {
            User.findOne({
                login: req.body.login
            }, function (err, res) {
                // Si erreur lors de la recherche
                if (err) {
                    // Erreur 500
                    reject(500);
                } else {
                    // Si le login est déjà dans la BDD
                    if (res) {
                        // Erreur 204
                        reject(204)
                    } else {
                        // Sinon ok
                        resolve(true)
                    }
                }
            })
        })

      if(!success){
        //On envoie le message d'erreurs
        res.json({"status":"ERROR", "result" : result});
      // Sinon
      }



*/


}

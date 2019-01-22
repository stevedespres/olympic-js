const Game = require('../../schemas/schemaGame.js');
const randomstring = require("randomstring");

/**
Fonction create : creation une partie
**/
exports.create = function(req, res) {

    // Recupèration des données du formulaire
		var dataGame = req.body;
    // Generation d'un identidiant aléatoire de la partie
    var idgame = randomstring.generate(6);
    // Creation de la partie dans la BDD
    // Creation d'une nouvelle partie dans la base de données
    Game.create({ gameId : idgame,
                    nbPlayers : {
											current : 0,
											max :  dataGame.nbplayers,
										},
                    players : {},
                    games : dataGame.gamesSelected,
                    state : 0,
    },
    function(err, user) {
        if(err){
            res.send(err);
        }
        console.log("Nouvelle partie  (id: " + idgame + ") créée par " + dataGame.creator);
        //On envoie l'id en cas de succès
        res.json(idgame);
    });
}

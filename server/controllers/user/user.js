const User = require('../../schemas/schemaUser.js');

/**
Fonction getStats : récupération des statistiques d'un joueur
**/
exports.stats = function(req, res) {
console.log(req.body)
  // On cherche le joueur dans la base de donnée
  User.findOne().where("login").equals(req.body.login).exec(function(err,currentUser){
    var stats = {
      victory : currentUser.getVictory(),
      defeat : currentUser.getDefeat(),
      equality : currentUser.getEquality(),
    }
    res.json(stats);
  });
}

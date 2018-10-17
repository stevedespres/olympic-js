var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var Schema = mongoose.Schema;


module.exports = function(app) {

/*
    //Connection à la base de données
    mongoose.connect('mongodb://localhost/bfdb');
    mongoose.connection.on("error", function() {
        console.log("Erreur de connexion à la base de données");
    });
    mongoose.connection.on("open", function() {
        console.log("Connexion réussie à la base de données");
    });
*/
    /** Collection joueurs **/

    //Schéma associé aux joueurs

    // ------- JOUEUR -------
/*    var joueurSchema = mongoose.Schema({
        //        id : { type : mongoose.Schema.Types.ObjectId, ref : 'Id'},
        login: String,
        password: String,
        salt: String,
        typeCompte : String,
    }, { collection: 'joueurs' });
*/
    // ------- Partie -------
 /*   var PartieSchema = mongoose.Schema({
        //  id : { type : mongoose.Schema.Types.ObjectId, ref : 'Id'},
      //  ID_game: Number,
        id: String,
        etat: String, //etat ( attente, en cours , terminé)
        nomBabyfoot : String,
        joueurs : {},
        nbjoueurs : { 
            min : Number,
            max : Number,
            b : Number, 
            r : Number,
        },
        config : {
            limiteScore : Number,
        },
        id_stat: String,
    }, { collection: 'Partie' });

 

    //Modele associé au schéma joueurs
    var Joueur = mongoose.model('JoueurModel', joueurSchema);
    var Partie = mongoose.model('PartieModel', PartieSchema);
    
    //-------- Export des collections -----------
    module.exports.Joueur = Joueur;
    module.exports.Partie = Partie;
*/
}
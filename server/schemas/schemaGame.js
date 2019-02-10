const mongoose = require('mongoose');

/**
Schéma d'une Game dans la BDD
**/
var schemaGame = mongoose.Schema({
	/** L'id de la partie'**/
	gameId: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	/** Nombre de joueurs de la partie **/
	nbPlayers: {
    current : Number,
    max : Number,
  },
  /** Joueurs **/
  players : [],
  /** Jeux qui composent la parties **/
  games : [],
  /**  État de la partie :
	0 = En attente de joueurs
	1 = Partie complete
	2 = Partie en cours
	3 = Partie terminée
	**/
  state: {
        type: Number,
        required: true
  },
},
/** Timestamps de la création de la partie dans la BDD **/
{ timestamps: {
				createdAt: 'created_at'
		}
})
/** Méthodes associées à l'user **/
schemaGame.methods = {
	/** Recupération de l'id **/
	getGameId: function () {
		return gameId;
	}
}

module.exports = mongoose.model('Game', schemaGame);

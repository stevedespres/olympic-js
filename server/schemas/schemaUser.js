const mongoose = require('mongoose');
const passwordHash = require('password-hash');
const jwt = require('jwt-simple');

/**
Schéma d'un User dans la BDD
**/
var userSchema = mongoose.Schema({
	/** Login de l'user **/
	login: {
		type: String,
		trim: true,
		unique: true,
		required: true
	},
	/** Mot de passe de l'user **/
	password: {
        type: String,
        required: true
    },
	 victory: Number,
	 defeat: Number,
	 equality: Number,

},
/** Timestamps de la création de l'user dans la BDD **/
{ timestamps: {
				createdAt: 'created_at'
		}
})
/** Méthodes associées à l'user **/
userSchema.methods = {
	/** Authentification **/
	authenticate: function (password) {
		return passwordHash.verify(password, this.password);
	},
	/** Recupération du token de connexion **/
	getToken: function () {
		return jwt.encode(this, "mediumMernAppCreation");
	},
	getVictory: function () {
		return this.victory;
	},
	getDefeat: function () {
		return this.defeat;
	},
	getEquality: function () {
		return this.equality;
	}
}

module.exports = mongoose.model('User', userSchema);

var account = require('./controllers/account/authentification.js');
var game = require('./controllers/game/join.js');

// Routes des pages
module.exports = function(app) {

    // Requête pour la connexion
    app.post('/user/login',account.login);
    // Requête pour l'inscription
    app.post('/user/signup',account.signup);
    // Requête pour joindre une partie
    app.post('/game/join',account.signup);
}

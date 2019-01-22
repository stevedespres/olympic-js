var account = require('./controllers/account/authentification.js');
var game = require('./controllers/game/game.js');

// Routes des pages
module.exports = function(app) {

    // Requête pour la connexion
    app.post('/user/login',account.login);
    // Requête pour l'inscription
    app.post('/user/signup',account.signup);
    // Requête pour creer une partie
    app.post('/game/create',game.create);
}

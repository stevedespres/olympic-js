var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var mongoose = require('mongoose');

// Config
require("./config")(app);

// Connexion à la base de données
mongoose.connect('mongodb://localhost/db').then(() => {
    console.log('Connected to mongoDB')
}).catch(e => {
    console.log('Error while DB connecting');
    console.log(e);
});

// Routes
require("./routes")(app);

// Communications Socket.io
require("./sockets")(io);

// Lancement du serveur NodeJS
server.listen(8080);
//server.listen(8080);
console.log("App listening on port 8080");

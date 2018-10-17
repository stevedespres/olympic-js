var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// Config
require("./config")(app);

// Models de la BDD
require("./models")(app);

// Routes
require("./routes")(app);

// Communication Socket.io
require("./sockets")(io);

// listen (start app with node server.js) ======================================
//Localhost
server.listen(8080);
//server.listen(8080);
console.log("App listening on port 8080");
var express  = require('express');
var app      = express();
var logger = require('morgan');
var bodyParser = require('body-parser');
var cors = require('cors');

module.exports = function(app){

    // Configuration
    app.use(bodyParser.urlencoded({ extended: true })); // Parses urlencoded bodies
    app.use(bodyParser.json()); // Send JSON responses
    app.use(logger('dev')); // Log requests to API using morgan
    app.use(cors());

    //Définition des CORS
    app.use(function (req, res, next) {
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
        res.setHeader('Access-Control-Allow-Credentials', true);
        next();
    });
}

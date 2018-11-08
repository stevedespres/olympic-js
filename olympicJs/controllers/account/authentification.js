const User = require('../../schemas/schemaUser.js');
const passwordHash = require("password-hash");

/**
Fonction Singnup : inscription un nouvel User
**/
exports.signup = function(req, res) {
    // Si le login ou le mot de passe n'est pas renseigné
    if (!req.body.login || !req.body.password) {
        // Erreur 400
        res.status(400).json({
            "text": "Login ou mot de passe manquant"
        })
    // Sinon
    } else {
       // Création d'une variable User avec le login et password
        var user = {
            login: req.body.login,
            password: passwordHash.generate(req.body.password)
        }
        // Recherche dans la base de données si le login est déjà utilisé
        var findUser = new Promise(function (resolve, reject) {
            User.findOne({
                login: user.login
            }, function (err, result) {
                // Si erreur lors de la recherche
                if (err) {
                    // Erreur 500
                    reject(500);
                } else {
                    // Si le login est déjà dans la BDD
                    if (result) {
                        // Erreur 204
                        reject(204)
                    } else {
                        // Sinon ok
                        resolve(true)
                    }
                }
            })
        })
        // Si le login n'existe pas déjà, on créer l'user dans la BDD
        findUser.then(function () {
            var _u = new User(user);
            _u.save(function (err, user) {
                if (err) {
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                } else {
                    res.status(200).json({
                        "text": "Succès",
                        "token": user.getToken()
                    })
                }
            })
        }, function (error) {
          // Gestions des erreurs
            switch (error) {
                case 500:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
                    break;
                case 204:
                    res.status(204).json({
                        "text": "Le login existe déjà"
                    })
                    break;
                default:
                    res.status(500).json({
                        "text": "Erreur interne"
                    })
            }
        })
    }
}

/**
Fonction Login : Connexion d'un userSchema
**/
exports.login = function(req, res) {
    // Si le login ou password est manquant
    if (!req.body.login || !req.body.password) {
        // Erreur 400
        res.status(400).json({
            "text": "Requête invalide"
        })
    } else {
        // Chercher si le login existe bien dans la BDD
        User.findOne({
            login: req.body.login
        }, function (err, user) {
            if (err) {
                res.status(500).json({
                    "text": "Erreur interne"
                })
            }
            else if(!user){
                res.status(401).json({
                    "text": "L'utilisateur n'existe pas"
                })
            }
            else {
                // Verifier si le mot de passe entré correspond au mot de passe dans la BDD
                if (user.authenticate(req.body.password)) {
                    res.status(200).json({
                        "token": user.getToken(),
                        "text": "Authentification réussi"
                    })
                }
                else{
                    res.status(401).json({
                        "text": "Mot de passe incorrect"
                    })
                }
            }
        })
    }
}

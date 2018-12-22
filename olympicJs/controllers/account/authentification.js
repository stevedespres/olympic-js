const User = require('../../schemas/schemaUser.js');

const passwordHash = require("password-hash");

/**
Fonction Singnup : inscription d'un nouvel utilisateur (User)
**/
exports.signup = function(req, res) {


      var success = true;
      var result = "";

      //REGEX
      var pseudoRegex = /[a-zA-Z0-9._-]{3,16}/;
      var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{6,})/;

      //Test des entrées utilisateurs
      if (!pseudoRegex.test(req.body.login)) {
          result += "Le login n'est pas au bon format\n";
          success = false;
      }
      if (!passwordRegex.test(req.body.password)) {
          result += "Le mot de passe n'est pas au bon format\n";
          success = false;
      }

      if(!success){
        //On envoie le message d'erreurs
        res.json({"status":"ERROR", "result" : result});
        // Si le login ou le mot de passe n'est pas renseigné
      }else if (!req.body.login || !req.body.password) {
          // Erreur 400
          result = "Le login ou le mot de passe est manquant";
          res.json({"status":"ERROR","result" :  result});
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
              }, function (err, res) {
                  // Si erreur lors de la recherche
                  if (err) {
                      // Erreur 500
                      reject(500);
                  } else {
                      // Si le login est déjà dans la BDD
                      if (res) {
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
                      result = "Erreur interne";
                      res.json({"status":"ERROR", "result" : result});
                  } else {
                    console.log(user.login);
                      res.json({
                          "status" : "OK",
                          "login" : user.login,
                          "token": user.getToken()
                      })
                  }
              })
          }, function (error) {
              switch (error) {
                  case 500:
                      result = "Erreur interne";
                      res.json({"status":"ERROR", "result" : result});
                      break;
                  case 204:
                      result = "Le login existe déjà";
                      res.json({"status":"ERROR", "result" : result});
                      break;
                  default:
                      result = "Erreur interne";
                      res.json({"status":"ERROR", "result" : result});
              }
          })
      }
}

/**
Fonction Login : Connexion d'un userSchema
**/
exports.login = function(req, res) {
  console.log(req);
    // Si le login ou password est manquant
    if (!req.body.login || !req.body.password) {
        // Erreur 400
        result = "Le login ou le mot de passe est manquant";
        res.json({"status":"ERROR","result" :  result});
    } else {
        // Chercher si le login existe bien dans la BDD
        User.findOne({
            login: req.body.login
        }, function (err, user) {
            if (err) {
              result = "Erreur interne";
              res.json({"status":"ERROR","result" :  result});
            }
            else if(!user){
              result = "L'utilisateur n'existe pas";
              res.json({"status":"ERROR","result" :  result});
            }
            else {
                // Verifier si le mot de passe entré correspond au mot de passe dans la BDD
                if (user.authenticate(req.body.password)) {
                  console.log(user.login);
                    res.status(200).json({
                        "token": user.getToken(),
                        "text": "Authentification réussi",
                        "login" : user.login,
                        "status": "OK"
                    })
                }
                else{
                  result = "Mot de passe incorrect";
                  res.json({"status":"ERROR","result" :  result});
                }
            }
        })
    }
}

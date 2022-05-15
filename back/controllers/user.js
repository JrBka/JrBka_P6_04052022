//importation des packages bcrypt
const bcrypt = require("bcrypt");
//importation du model user.js
const User = require("../models/user")
//importatino des packages jsonwebtoken
const jsonwebtoken = require("jsonwebtoken")
//importation de dotenv
const dotenv = require("dotenv").config()
//importation du middleware password.js
let schema = require("../middleware/password")

exports.signup = (req, res, next) => {
  console.log(schema.validate(req.body.password));
  if (schema.validate(req.body.password)) {
    //cryptage avec bcrypt. hash = mdp crypté. 10 = nombre de boucle de l'algorythme
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: req.body.email,
        password: hash
      });
      console.log(user);
      user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      .catch(error => res.status(400).json({ error }));
    })
    .catch(error => { 
      res.status(500).json({ error })});
    }else{
      return res.status(401).json({ error: 'Mot de passe invalide !' });
    }
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
        //compare le mdp entré au hash
        bcrypt.compare(req.body.password, user.password)
        //on recoi ici un boolean
          .then(valid => {
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            res.status(200).json({
              userId: user._id,
              token: jsonwebtoken.sign(
                  {userId: user._id},
                  // clé secrete
                  process.env.SECRET_KEY,
                  {expiresIn: "24h"}
              )
            }); 
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};
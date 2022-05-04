const bcrypt = require("bcrypt");
const User = require("../models/user")
const jsonwebtoken = require("jsonwebtoken")


exports.signup = (req, res, next) => {
    //cryptage avec bcrypt. hash = mdp crypté. 10 = nombre de tour de l'algorythme
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
        console.log(error);  
        res.status(500).json({ error })});
};

exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email })
      .then(user => {
        if (!user) {
          return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }
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
                  "RANDOM_TOKEN_SECRET",
                  {expiresIn: "24h"}
              )
            });
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
};
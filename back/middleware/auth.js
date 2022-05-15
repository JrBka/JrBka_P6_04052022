//importation des packages jsonwebtoken decrypter le token envoyer par l'utilisateur
const jsonwebtoken = require('jsonwebtoken');
//importation de dotenv
const dotenv = require("dotenv").config()

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jsonwebtoken.verify(token, /* clé secrete*/ process.env.SECRET_KEY);
    const userId = decodedToken.userId;
    req.auth = {userId: userId };  
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(403).json({
      error: new Error('Unauthorized request')
    });
  }
};
const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jsonwebtoken.verify(token, /* clé secrete*/ 'RANDOM_TOKEN_SECRET');
    const userId = decodedToken.userId;
    req.auth = {userId: userId };  
    console.log(decodedToken);
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
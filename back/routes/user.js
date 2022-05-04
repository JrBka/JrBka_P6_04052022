//importation des packages express
const express = require('express');
const router = express.Router();
//importation de user.js
const userCtrl = require('../controllers/user');

//route inscription
router.post('/signup', userCtrl.signup);
//route connexion
router.post('/login', userCtrl.login);

module.exports = router;
//importation des packages express
const express = require('express');
const router = express.Router();

//importation du middleware d'autentification
const auth = require("../middleware/auth");
//importation du middleware de gestion des images "multer"
const multer = require('../middleware/multer-config');
//importation du controller sauce.js
const sauceCtrl = require('../controllers/sauce');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like',auth, sauceCtrl.likeSauce);
router.get('/', auth, sauceCtrl.getAllSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

module.exports = router;
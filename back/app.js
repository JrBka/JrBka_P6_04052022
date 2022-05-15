//importation des package express
const express = require("express");
//importation des packages mongoose
const mongoose = require("mongoose");
//importation des packages path
const path = require('path');
//importation du package helmet
const helmet = require("helmet")
//importation du module dotenv
const dotenv = require("dotenv").config()
//importation de express-rate-limit
const rateLimit = require('express-rate-limit')

const sauceRoutes = require("./routes/sauce");
const userRoutes = require('./routes/user');

// declaration de la fonction express
const app = express();
//connection a la base de donnée, héberger sur mongoDB
//l'url se trouve dans process.env.URL_DATABASE
mongoose.connect(process.env.URL_DATABASE,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//nous donne acces a req.body quand une requete contient du json
//use = tous les type de requete
app.use(express.json());

//Limiteur de requete
const limiter  =  rateLimit ( { 
	windowMs : 15  *  60  *  1000 ,  // Par 15 minutes 
	max : 100 ,  // Limiter chaque IP à 100 requêtes par `window`
	standardHeaders : true ,  // Renvoie les informations de limite de débit dans les en-têtes `RateLimit-*` 
	legacyHeaders : false ,  // Désactive les en-têtes `X-RateLimit-*` 
});
app.use(limiter)


//Sécurisation des en-tête HTTP
app.use(helmet({ crossOriginResourcePolicy: { policy: "same-site" } }));



//Defini le CORS
app.use((req, res, next) => {
    //tout le monde peut effectuer une requete ("*")
    res.setHeader('Access-Control-Allow-Origin', '*');
    //on peut ajouter ces headers à la requete
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    //on peut utiliser ces methodes de requetes
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

//route telechargement d'image (l'image est enregistrer dans le dossier image)
app.use('/images', express.static(path.join(__dirname, 'images')));
//routes sauces (details dans sauce.js)
app.use("/api/sauces", sauceRoutes);
//routes user (details dans user.js)
app.use('/api/auth', userRoutes);

//exporte app
module.exports = app;

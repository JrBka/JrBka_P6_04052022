//importation des package express
const express = require("express");
//importation des packages mongoose
const mongoose = require("mongoose");
//importation des packages path
const path = require('path');

const sauceRoutes = require("./routes/sauce");
const userRoutes = require('./routes/user');

// declaration de la fonction express
const app = express();
//connection a la base de donnée, héberger sur mongoDB
mongoose.connect('mongodb+srv://JRBKA:MongoDB-P6@cluster0.nbztc.mongodb.net/sauces?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//nous donne acces a req.body quand une requete contient du json
//use = tous les type de requete
app.use(express.json());

//Defini le contenu autorisé dans header
app.use((req, res, next) => {
    //tout le monde peut y acceder ("*")
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

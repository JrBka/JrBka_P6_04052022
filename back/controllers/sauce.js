//importation du model de requete
const Sauce = require('../models/sauce');
//importation du package fs (file system)
const fs = require('fs');

//creation d'une sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  sauceObject.likes = 0
  sauceObject.dislikes = 0
  sauceObject.usersLiked = []
  sauceObject.usersDisliked = []
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Post saved successfully!'
      });
    }
    ).catch(
      (error) => {
        res.status(400).json({
          error: error
        });
      }
      );
    };

    //afficher toutes les sauces
    exports.getAllSauce = (req, res, next) => {
      Sauce.find().then(
        (sauces) => {
          res.status(200).json(sauces);
        }
      ).catch(
        (error) => {
          res.status(400).json({
            error: error
          });
        }
      );
    };
    
    //affichage de la sauce selectionné
    exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
  .then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//modification d'une sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  //s'il y a une nouvelle image supprimer l'ancienne dans le dossier images et la remplacer par la nouvelle. 
  //mettre a jour la nouvelle sauce dans la base de données
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => { 
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
    
  }else{
    //si pas de nouvelle image mettre a jour la nouvelle sauce
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
      .then(() => res.status(200).json({ message: 'Objet modifié !'}))
      .catch(error => res.status(400).json({ error }));
  }
    
    
};

//supprimer une sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};


//like et dislike sauce, ajout ou suppression de l'userId dans le tableau usersLiked ou usersDisliked
exports.likeSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
  .then(sauce => {
    
      if (req.body.like === 1) {
        sauce.likes ++;
        sauce.usersLiked.push(req.body.userId);
        sauce.save();
        res.status(200).json(sauce.likes);
      }
      
      if (req.body.like === -1) {
        sauce.dislikes ++;
        sauce.usersDisliked.push(req.body.userId);
        sauce.save();
        res.status(200).json(sauce.likes);
      }
    
      if (req.body.like === 0) {
        const userLikedBoolean = sauce.usersLiked.includes(req.body.userId);
        const userDislikedBoolean = sauce.usersDisliked.includes(req.body.userId);
        if (userLikedBoolean) {
          const userIndex = sauce.usersLiked.indexOf(req.body.userId);
          sauce.usersLiked.splice(userIndex, 1);
          sauce.likes --;
          sauce.save();
          res.status(200).json(sauce.likes);
        }
        if (userDislikedBoolean) {
          const userIndex = sauce.usersDisliked.indexOf(req.body.userId);
          sauce.usersDisliked.splice(userIndex, 1);
          sauce.dislikes --;
          sauce.save();
          res.status(200).json(sauce.likes);
        }
      }
  })
  .catch(error => res.status(400).json( {error} ));
}

const Sauce = require('../models/Sauce');

// Le package fs expose des méthodes pour interagir avec le système de fichiers du serveur.
const fs = require('fs');


exports.getAllSauce = (req, res, next) => {
  Sauce.find()
  .then((sauces) => {
      res.status(200).json(sauces);
  })
  .catch((error) => {
      res.status(400).json({
        error: error
      });
  });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id
  })
  .then((sauce) => {
      res.status(200).json(sauce);
  })
  .catch((error) => {
      res.status(404).json({
        error: error
      });
  });
};

exports.createSauce = (req, res, next) => {
    console.log(req.body.sauce)
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;

    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });

    sauce.save()
    
    .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
    .catch(error => { res.status(400).json( { message: error })})
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };

    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({ message : 'Not authorized'});
            } else {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } 
          else {
              const filename = sauce.imageUrl.split('/images/')[1];
              // La méthode unlink() du package  fs  vous permet de supprimer un fichier du système de fichiers.
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.usersDisliked.includes(req.body.userId)){
            Sauce.updateOne(
                {_id: req.params.id}, {
                    $inc : { dislikes : -1 },
                    $pull : { usersDisliked: req.body.userId }
                }
            )
            .then(() => {
                Sauce.findOne({_id: req.params.id})
                    .then(sauce => {
                        res.status(201).json({message : sauce})
                    })
                    .catch(error => res.status(401).json({ message: error }));  
            })
            .catch(error => res.status(401).json({ message: error }));  
        }

        else if (sauce.usersLiked.includes(req.body.userId)){
            Sauce.updateOne(
                {_id: req.params.id}, {
                    $inc : { likes : -1 },
                    $pull : { usersLiked: req.body.userId }
                }
            )
            .then(() => {
                Sauce.findOne({_id: req.params.id})
                    .then(sauce => {
                        res.status(201).json({message : sauce})
                    })
                    .catch(error => res.status(401).json({ message: error }));  
            })
            .catch(error => res.status(401).json({ message: error }));  
        }     

        else if (req.body.like == 1) {
            Sauce.updateOne(
                {_id: req.params.id}, { 
                    $inc : { likes : 1 },
                    $push : { usersLiked: req.body.userId }
                }
            )
            .then(() => res.status(201).json({message : sauce}))
            .catch(error => res.status(401).json({ message: error }));  
        }

        else if (req.body.like == -1) {
            Sauce.updateOne(
                {_id: req.params.id}, { 
                    $inc : { dislikes : 1 },
                    $push : { usersDisliked: req.body.userId }
                }
            )
            .then(() => res.status(201).json({message : sauce}))
            .catch(error => res.status(401).json({ message: error }));  
        }
    })
    .catch((error) => {
        res.status(400).json({message: error });
    });
}
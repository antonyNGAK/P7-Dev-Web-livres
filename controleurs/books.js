const Book = require('../models/Book');
const fs = require('fs');

// Ajout d'un nouveau Livre
module.exports.createBook = (req, res) => {
    
    const bookObject = JSON.parse(req.body.book);
    
    //creation d'un nouveau livre

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        ratings: [],
        averageRating: 0, 
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.filename}`
    });

    //sauvegarde d'un nouveaux livre

    book.save()
        .then(() => res.status(201).json({ message: 'Nouveau livre créer avec succès !' }))
        .catch(error => res.status(400).json({ error }));
};

//Vérification des données introduite à propos des livres

module.exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch(error => res.status(404).json({ error }));
};

//Avis sur les livres

module.exports.ratingBook = (req, res, next) => {
    const updatedRating = {
        userId: req.auth.userId,
        grade: req.body.rating
    };
    
    if (updatedRating.grade < 0 || updatedRating.grade > 5) {
        return res.status(400).json({ message: 'Veuillez attribué une note entre 0 et 5 étoiles' });
    }
    
    Book.findOne({ _id: req.params.id })
        .then((book) => {

            //check des condition de notation des livres

            if (book.ratings.find(r => r.userId === req.auth.userId)) {
                return res.status(400).json({ message: 'Vous ne pouvez plus noté ce livre' });
            } else {
                book.ratings.push(updatedRating); 
                //La somme des notes étant la moyenne on multiplié par la note la plus haute, puis on soustrait la nouvelle valeur
                book.averageRating = (book.averageRating * (book.ratings.length - 1) + updatedRating.grade) / book.ratings.length;
                return book.save();
            }
        })
        .then((updatedBook) => res.status(201).json(updatedBook))
        .catch(error => res.status(400).json({ error }));
};


//Logique de modification des livres
module.exports.modifyBook = (req, res, next) => {
  
    const bookObject = req.file ? {
        
        ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/${req.file.filename}`
    } : { ...req.body };
    Book.findOne({ _id: req.params.id })
        .then((book) => {
 
            //Vérification de la requête utilisateur

            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: Requête incorrect !' });
            } else {

                //Mise à jour des livre correspondants aux paramètre et données collectées

                Book.updateOne({ _id: req.params.id }, { ...bookObject, _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: 'Livre mis à jour !' });

                        const oldFile = book.imageUrl.split('/images')[1];
                        req.file && fs.unlink(`images/${oldFile}`, (err => {
                            if (err) console.log(err);
                        }))
                    })
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(400).json({ error }));

};

//Suppression de livre

module.exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
           
            if (book.userId != req.auth.userId) {
                res.status(403).json({ message: '403: Requête incorrect !' });
            } else {
                Book.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: 'Deleted!' });
                        
                        const filename = book.imageUrl.split('/images/')[1];
                        
                        fs.unlink(`images/${filename}`, (err => {
                            if (err) console.log(err);
                        }))
                    })
                    .catch(error => res.status(401).json({ error }));
            }
        })
        .catch(error => res.status(500).json({ error }));
};

//Ajourt de tout les Livres
module.exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch(error => res.status(400).json({ error }));
};

//Ajout des trois livre les mieux notés

exports.getBestRatings = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })//ordre de la descendance
        .limit(3) 
        .then((bestBooks) => res.status(200).json(bestBooks))//Retourne les trois meilleurs livres les mieux notés"
        .catch(error => res.status(400).json({ error }));
};
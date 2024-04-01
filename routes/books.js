const express = require ('express');
const router = express.Router();
const multer = require('../middleware/config-multer');


const auth = require('../middleware/auth');
const booksControle = require('../controleurs/books');

//Méthode CRUD

router.get('/', booksControle.getAllBooks);
router.get('/bestrating', booksControle.getBestRatings);
router.post('/', auth, multer.upload, multer.optimize, booksControle.createBook);
router.get('/:id', booksControle.getOneBook);
router.put('/:id',auth, multer.upload, multer.optimize, booksControle.modifyBook);
router.delete('/:id',auth, booksControle.deleteBook);
router.post('/:id/rating',auth, booksControle.ratingBook);

module.exports = router;





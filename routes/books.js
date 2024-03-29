const express = require ('express');
const router = express.Router();


const booksControle = require('../controleurs/books');

router.get('/', booksControle.getAllBooks);
router.get('/bestrating', booksControle.getBestRatings);
router.post('/',  booksControle.createBook);
router.get('/:id', booksControle.getOneBook);
router.put('/:id', booksControle.modifyBook);
router.delete('/:id', booksControle.deleteBook);
router.post('/:id/rating', booksControle.ratingBook);

module.exports = router;





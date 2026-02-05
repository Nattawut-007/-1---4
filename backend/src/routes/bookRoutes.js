const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { auth, admin } = require('../middleware/auth');

router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBookById);
router.post('/', auth, admin, bookController.createBook);
router.put('/:id', auth, admin, bookController.updateBook);
router.delete('/:id', auth, admin, bookController.deleteBook);

module.exports = router;

const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const { auth, admin } = require('../middleware/auth');

router.post('/borrow', auth, transactionController.borrowBook);
router.post('/return', auth, transactionController.returnBook);
router.get('/history', auth, transactionController.getMyHistory);
router.get('/', auth, admin, transactionController.getAllTransactions);

module.exports = router;

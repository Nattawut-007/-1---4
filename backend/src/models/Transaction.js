const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    book_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    type: { type: String, enum: ['borrow', 'return'], required: true },
    transactionDate: { type: Date, default: Date.now },
    returnDate: { type: Date }
});

module.exports = mongoose.model('Transaction', transactionSchema);

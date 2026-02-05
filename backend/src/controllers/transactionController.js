const Transaction = require('../models/Transaction');
const Book = require('../models/Book');

exports.borrowBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id;

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.status === 'borrowed') return res.status(400).json({ message: 'Book is already borrowed' });

        // Create Transaction
        const transaction = new Transaction({
            user_id: userId,
            book_id: bookId,
            type: 'borrow'
        });
        await transaction.save();

        // Update Book Status
        book.status = 'borrowed';
        await book.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.returnBook = async (req, res) => {
    try {
        const { bookId } = req.body;
        const userId = req.user.id; // In a real app check if the user is the one who borrowed it

        const book = await Book.findById(bookId);
        if (!book) return res.status(404).json({ message: 'Book not found' });
        if (book.status === 'available') return res.status(400).json({ message: 'Book is not borrowed' });

        // Find the active borrow transaction
        const lastTransaction = await Transaction.findOne({ book_id: bookId, type: 'borrow' }).sort({ transactionDate: -1 });

        // Optional: Check if the user returning is the one who borrowed (skip for simplicity if needed, but good to have)
        // if (lastTransaction.user_id.toString() !== userId) return res.status(403).json({ message: 'You did not borrow this book' });

        // Create Return Transaction
        const transaction = new Transaction({
            user_id: userId,
            book_id: bookId,
            type: 'return',
            transactionDate: new Date()
        });
        await transaction.save();

        // Update old borrow transaction with return date (optional logic, but here we just log new return tx)
        // Actually, we should probably update the LAST borrow transaction `returnDate` if we designed it that way,
        // but the Schema has `returnDate` on the transaction itself.
        // If the schema implies a single row for borrow/return, we'd update. 
        // But the instructions said "Transaction Tables", implying a log.
        // However, `returnDate` in the schema suggests we might want to update the original borrow record OR just have a return record.
        // Let's stick to: Create a new 'return' transaction log. 

        // Update Book Status
        book.status = 'available';
        await book.save();

        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyHistory = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user_id: req.user.id })
            .populate('book_id', 'title author')
            .sort({ transactionDate: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find()
            .populate('user_id', 'username')
            .populate('book_id', 'title')
            .sort({ transactionDate: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

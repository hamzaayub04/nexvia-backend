const express = require('express');
const router = express.Router();
const { createQuote, getQuotes, getQuoteById, updateQuote, deleteQuote, getMyQuotes } = require('../controllers/quoteController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { validateQuote } = require('../validators');

router.post('/', upload.array('attachment', 10), validateQuote, createQuote);
router.get('/', protect, adminOnly, getQuotes);
router.get('/my', protect, getMyQuotes);
router.get('/:id', protect, getQuoteById);
router.put('/:id', protect, adminOnly, updateQuote);
router.delete('/:id', protect, adminOnly, deleteQuote);

module.exports = router;

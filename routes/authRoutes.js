const express = require('express');
const router = express.Router();
const { register, login, firebaseSync, getMe, getAllUsers } = require('../controllers/authController');
const { protect, adminOnly } = require('../middleware/auth');
const { validateRegister, validateLogin } = require('../validators');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/firebase-sync', (req, res) => {
  res.status(410).json({ message: 'This endpoint is disabled.' });
});
router.get('/me', protect, getMe);
router.get('/users', protect, adminOnly, getAllUsers);

module.exports = router;
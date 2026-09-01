const express = require('express');
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.put('/change-password', authenticateToken, authController.changePassword);
router.get('/me', authenticateToken, authController.me);

module.exports = router;

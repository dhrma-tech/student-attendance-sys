const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/security');

// Public routes
router.post('/login', loginLimiter, authController.login);

// Protected routes
router.post('/refresh', authController.refreshToken);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
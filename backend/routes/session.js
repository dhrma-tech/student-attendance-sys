const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');
const { authenticate, authorize } = require('../middleware/auth');

// All session routes require authentication
router.use(authenticate);

// Teacher routes
router.post('/', authorize('teacher', 'admin'), sessionController.createSession);
router.put('/:sessionId/end', authorize('teacher', 'admin'), sessionController.endSession);
router.get('/active', authorize('teacher', 'admin'), sessionController.getActiveSessions);

// Shared routes (teachers, admins, and students can view session stats)
router.get('/:sessionId/stats', authorize('teacher', 'admin', 'student'), sessionController.getSessionStats);

module.exports = router;

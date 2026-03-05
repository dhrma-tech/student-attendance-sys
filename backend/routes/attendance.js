const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authenticate, authorize } = require('../middleware/auth');
const { attendanceLimiter } = require('../middleware/security');

// Protected routes
router.post('/scan', attendanceLimiter, authenticate, authorize('student', 'teacher', 'admin'), attendanceController.scanAttendance);
router.get('/session/:sessionId', authenticate, authorize('teacher', 'admin'), attendanceController.getSessionAttendance);
router.get('/student/:studentId', authenticate, authorize('student', 'teacher', 'admin'), attendanceController.getStudentAttendance);

module.exports = router;
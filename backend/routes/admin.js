const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

// Teacher management
router.post('/teachers', adminController.createTeacher);

// Student management
router.get('/students', adminController.getStudents);
router.put('/students/:studentId/reset-device', adminController.resetStudentDevice);

// Attendance reports
router.get('/reports/attendance', adminController.getAttendanceReports);
router.get('/reports/low-attendance', adminController.getLowAttendanceStudents);
router.get('/export/attendance', adminController.exportAttendanceCSV);

module.exports = router;

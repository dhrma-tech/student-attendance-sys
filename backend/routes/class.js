const express = require('express');
const router = express.Router();
const classController = require('../controllers/classController');
const { authenticate, authorize } = require('../middleware/auth');

// All class routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin'));

router.post('/', classController.createClass);
router.get('/', classController.getClasses);
router.get('/stats', classController.getClassStats);
router.put('/:classId', classController.updateClass);
router.delete('/:classId', classController.deleteClass);

module.exports = router;

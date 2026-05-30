const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTaskStatus } = require('../Controllers/DoctorTaskController');
const { protect, authorizeRoles } = require('../Middlewares/RegistrationMiddleware');

router.post('/', protect, authorizeRoles('doctor'), createTask);
router.get('/', protect, authorizeRoles('doctor'), getTasks);
router.patch('/:id/status', protect, authorizeRoles('doctor'), updateTaskStatus);

module.exports = router;

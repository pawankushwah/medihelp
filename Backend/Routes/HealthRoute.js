const express = require('express');
const router = express.Router();
const { createHealthLog, getPatientHistory } = require('../Controllers/HealthController');
const { protect, authorizeRoles } = require('../Middlewares/RegistrationMiddleware');

router.post('/log', protect, authorizeRoles('patient'), createHealthLog);
router.get('/history', protect, authorizeRoles('patient'), getPatientHistory);

module.exports = router;
const express = require('express');
const router = express.Router();
const { searchPatientRecords, createDoctorReview } = require('../Controllers/DoctorController');
const { protect, authorizeRoles } = require('../Middlewares/RegistrationMiddleware');

router.get('/search-patient', protect, authorizeRoles('doctor'), searchPatientRecords);
router.post('/review', protect, authorizeRoles('doctor'), createDoctorReview);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createRequest, getNearbyRequests, getNearbyDonors } = require('../Controllers/BloodRequestController');
const { protect } = require('../Middlewares/RegistrationMiddleware');

router.post('/', protect, createRequest);
router.get('/nearby', protect, getNearbyRequests);
router.get('/donors', protect, getNearbyDonors);

module.exports = router;

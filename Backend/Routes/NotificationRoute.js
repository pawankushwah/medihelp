const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, getVapidPublicKey, subscribeToPush } = require('../Controllers/NotificationController');
const { protect } = require('../Middlewares/RegistrationMiddleware');

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markAsRead);
router.get('/vapidPublicKey', getVapidPublicKey);
router.post('/subscribe', protect, subscribeToPush);

module.exports = router;

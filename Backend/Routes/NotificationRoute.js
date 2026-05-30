const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, getVapidPublicKey, subscribeToPush, testPush } = require('../Controllers/NotificationController');
const { protect } = require('../Middlewares/RegistrationMiddleware');

router.get('/', protect, getNotifications);
router.patch('/:id/read', protect, markAsRead);
router.get('/vapidPublicKey', getVapidPublicKey);
router.post('/subscribe', protect, subscribeToPush);
router.get('/testPush', protect, testPush);

module.exports = router;

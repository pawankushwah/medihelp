const Notification = require('../Models/Notification');
const User = require('../Models/RegistrationSchema');
const webpush = require('../Config/webpush');

const getVapidPublicKey = (req, res) => {
    res.status(200).json({
        status: 'success',
        publicKey: process.env.VAPID_PUBLIC_KEY
    });
};

const subscribeToPush = async (req, res) => {
    try {
        const subscription = req.body;

        if (!subscription || !subscription.endpoint) {
            return res.status(400).json({ message: 'Invalid subscription object' });
        }

        // Add subscription to user's pushSubscriptions array if it doesn't already exist
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { pushSubscriptions: subscription }
        });

        res.status(201).json({ status: 'success', message: 'Successfully subscribed to push notifications.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save subscription.', error: error.message });
    }
};

const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id })
            .sort({ createdAt: -1 })
            .limit(50);
        res.status(200).json({ status: 'success', data: notifications });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notifications', error: error.message });
    }
};

const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user._id },
            { readStatus: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.status(200).json({ status: 'success', data: notification });
    } catch (error) {
        res.status(500).json({ message: 'Error updating notification', error: error.message });
    }
};

const testPush = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
            return res.status(400).json({ message: 'User has no push subscriptions.' });
        }

        const pushPayload = JSON.stringify({
            title: 'Test Notification',
            body: 'Web Push is working perfectly! 🚀',
            icon: '/vite.svg',
            data: { url: '/' }
        });

        // Send to all of their devices
        for (let sub of user.pushSubscriptions) {
            await webpush.sendNotification(sub, pushPayload);
        }

        res.status(200).json({ status: 'success', message: 'Test push sent!' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending test push', error: error.message });
    }
};

module.exports = { getNotifications, markAsRead, getVapidPublicKey, subscribeToPush, testPush };
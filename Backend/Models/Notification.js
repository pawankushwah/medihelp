const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['blood_request', 'system', 'review', 'task'],
        required: true
    },
    relatedEntityId: {
        type: mongoose.Schema.Types.ObjectId, // Could be BloodRequestId, DoctorTaskId, etc.
        default: null
    },
    readStatus: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);

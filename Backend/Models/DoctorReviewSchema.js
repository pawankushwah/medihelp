const mongoose = require('mongoose');

const DoctorReviewSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorName: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        required: true
    },
    prescription: {
        type: String
    },
    followUpDate: {
        type: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('DoctorReview', DoctorReviewSchema);
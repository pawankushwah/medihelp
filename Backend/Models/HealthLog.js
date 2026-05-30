const mongoose = require('mongoose');

const HealthLogSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    logType: {
        type: String,
        required: true,
        enum: ['vitals', 'medical_summary']
    },
    vitalsData: {
        heartRate: { type: Number },
        bloodPressure: { type: String },
        steps: { type: Number },
        sugarLevel: { type: Number }
    },
    summaryData: {
        title: { type: String },
        doctorName: { type: String },
        diagnosis: { type: String },
        recommendations: { type: String }
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HealthLog', HealthLogSchema);
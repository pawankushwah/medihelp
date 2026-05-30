const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true
    },
    role: {
        type: String,
        enum: ['patient', 'doctor', 'institution'],
        required: true
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            default: [0, 0]
        }
    },

    // ==========================================
    // 2. PATIENT PROFILE (Only used if role = 'patient')
    // ==========================================
    patientProfile: {
        bloodType: { 
            type: String, 
            enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Unknown'],
            default: 'Unknown'
        },
        isAvailableToDonate: { type: Boolean, default: false },
        lastDonationDate: { type: Date, default: null },
        medicalHistory: { type: String, default: '' } // Any constraints for blood donation
    },

    // ==========================================
    // 3. DOCTOR PROFILE (Only used if role = 'doctor')
    // ==========================================
    doctorProfile: {
        specialization: { type: String, default: '' },
        availabilitySlots: { type: String, default: '' } // e.g. "Mon-Fri 4PM-8PM"
    },

    // ==========================================
    // 4. INSTITUTION PROFILE (Only used if role = 'institution')
    // ==========================================
    institutionProfile: {
        institutionType: { 
            type: String, 
            enum: ['Hospital', 'Blood Bank', 'Clinic'],
            default: 'Hospital'
        },
        registrationNumber: { type: String, default: '' }
    },

    // ==========================================
    // 5. PUSH NOTIFICATION SUBSCRIPTIONS
    // ==========================================
    pushSubscriptions: [{
        endpoint: String,
        keys: {
            p256dh: String,
            auth: String
        }
    }]
}, {
    timestamps: true
});

UserSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('User', UserSchema);
const User = require('../Models/RegistrationSchema');
const HealthLog = require('../Models/HealthLog');
const DoctorReview = require('../Models/DoctorReviewSchema');

const searchPatientRecords = async (req, res) => {
    try {
        const { searchKey } = req.query;

        if (!searchKey) {
            return res.status(400).json({ message: 'Search key query parameter is required.' });
        }

        const patient = await User.findOne({
            role: 'patient',
            $or: [
                { username: searchKey },
                { email: searchKey },
                { phone: searchKey }
            ]
        }).select('-password');

        if (!patient) {
            return res.status(404).json({ message: 'Patient not found with the provided details.' });
        }

        const logs = await HealthLog.find({ patientId: patient._id }).sort({ createdAt: -1 });

        res.status(200).json({
            status: 'success',
            patient: {
                id: patient._id,
                username: patient.username,
                email: patient.email,
                phone: patient.phone
            },
            logs
        });
    } catch (error) {
        res.status(500).json({ message: 'Error searching patient records.', error: error.message });
    }
};

const createDoctorReview = async (req, res) => {
    try {
        const { patientId, comments, prescription, followUpDate } = req.body;

        if (!patientId || !comments) {
            return res.status(400).json({ message: 'Patient ID and comments are required.' });
        }

        const newReview = new DoctorReview({
            patientId,
            doctorId: req.user._id,
            // Uses req.user.name to align cleanly with your specific User Schema fields
            doctorName: req.user.name || 'Duty Doctor', 
            comments,
            prescription,
            followUpDate
        });

        await newReview.save();

        res.status(201).json({
            status: 'success',
            message: 'Doctor review submitted successfully!',
            data: newReview
        });
    } catch (error) {
        res.status(500).json({ message: 'Error saving doctor review.', error: error.message });
    }
};

module.exports = { searchPatientRecords, createDoctorReview };
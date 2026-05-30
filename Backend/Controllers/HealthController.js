const HealthLog = require('../Models/HealthLog');

const createHealthLog = async (req, res) => {
    try {
        const { logType, vitalsData, summaryData } = req.body;

        if (!logType) {
            return res.status(400).json({ message: 'Log type specification is required.' });
        }

        const newLog = new HealthLog({
            patientId: req.user._id,
            logType,
            vitalsData: logType === 'vitals' ? vitalsData : undefined,
            summaryData: logType === 'medical_summary' ? summaryData : undefined
        });

        await newLog.save();

        res.status(201).json({
            status: 'success',
            message: `${logType === 'vitals' ? 'Vitals logged' : 'Medical summary saved'} successfully!`,
            data: newLog
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create health log entry.', error: error.message });
    }
};

const getPatientHistory = async (req, res) => {
    try {
        const logs = await HealthLog.find({ patientId: req.user._id }).sort({ createdAt: -1 });
        
        res.status(200).json({
            status: 'success',
            count: logs.length,
            data: logs
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving health data logs.', error: error.message });
    }
};

module.exports = { createHealthLog, getPatientHistory };
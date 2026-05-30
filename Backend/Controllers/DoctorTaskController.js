const DoctorTask = require('../Models/DoctorTask');

const createTask = async (req, res) => {
    try {
        const { taskType, patientId, description, dueDate } = req.body;

        if (!taskType || !description) {
            return res.status(400).json({ message: 'Task type and description are required.' });
        }

        const newTask = new DoctorTask({
            doctorId: req.user._id,
            taskType,
            patientId,
            description,
            dueDate
        });

        await newTask.save();

        res.status(201).json({ status: 'success', data: newTask });
    } catch (error) {
        res.status(500).json({ message: 'Error creating task', error: error.message });
    }
};

const getTasks = async (req, res) => {
    try {
        const tasks = await DoctorTask.find({ doctorId: req.user._id })
                                      .populate('patientId', 'name phone')
                                      .sort({ dueDate: 1 });
        res.status(200).json({ status: 'success', data: tasks });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching tasks', error: error.message });
    }
};

const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const task = await DoctorTask.findOneAndUpdate(
            { _id: id, doctorId: req.user._id },
            { status },
            { new: true }
        );

        if (!task) return res.status(404).json({ message: 'Task not found' });

        res.status(200).json({ status: 'success', data: task });
    } catch (error) {
        res.status(500).json({ message: 'Error updating task', error: error.message });
    }
};

module.exports = { createTask, getTasks, updateTaskStatus };

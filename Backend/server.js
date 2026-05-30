const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/db'); // Import the DB connector
const authRoutes = require('./Routes/RegistrationRoute'); // Import the Auth routes
const healthRoutes = require('./Routes/HealthRoute'); // Import the Health routes
const doctorRoutes = require('./Routes/DoctorRoute'); // Import the Doctor routes


dotenv.config();


connectDB();

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());


app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'success', 
        message: 'Medi-Help Backend Server is running smoothly!' 
    });
});


app.use('/auth', authRoutes);
app.use('/health', healthRoutes);
app.use('/doctor', doctorRoutes);


const User = require('./Models/RegistrationSchema'); // Import the schema to query the data

app.get('/seeUsers', async (req, res) => {
    try {
        // Fetch all users from the database, hiding the password hashes for safety
        const users = await User.find({}).select('-password');
        
        res.status(200).json({
            count: users.length,
            status: 'success',
            data: users
        });
    } catch (error) {
        res.status(500).json({ 
            message: 'Error fetching trial data', 
            error: error.message 
        });
    }
});

// Start listening
app.listen(PORT, () => {
    console.log(`🚀 Server safely running on port http://localhost:${PORT}`);
});
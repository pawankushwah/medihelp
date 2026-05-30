const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./Config/db'); // Import the DB connector
const authRoutes = require('./Routes/RegistrationRoute'); // Import the Auth routes
const healthRoutes = require('./Routes/HealthRoute'); // Import the Health routes
const doctorRoutes = require('./Routes/DoctorRoute'); // Import the Doctor routes
const bloodRequestRoutes = require('./Routes/BloodRequestRoute');
const doctorTaskRoutes = require('./Routes/DoctorTaskRoute');
const notificationRoutes = require('./Routes/NotificationRoute');

const { initRealtime } = require('./Config/realtime');
const http = require('http');

const openapiSpec = require('./openapi.json');
dotenv.config();


connectDB();

const app = express();
const server = http.createServer(app);
initRealtime(server);

const PORT = process.env.PORT || 5000;


app.use(cors());
app.use(express.json());

// Scalar API Reference (Dynamic Import to fix Vercel ESM Error)
app.use('/docs', async (req, res, next) => {
    try {
        const { apiReference } = await import('@scalar/express-api-reference');
        const middleware = apiReference({
            theme: 'default',
            spec: {
                content: openapiSpec,
            },
        });
        return middleware(req, res, next);
    } catch (error) {
        console.error('Failed to load Scalar API Reference:', error);
        next(error);
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'Medi-Help Backend Server is running smoothly!'
    });
});


app.use('/auth', authRoutes);
app.use('/health', healthRoutes);
app.use('/doctor', doctorRoutes);
app.use('/blood-request', bloodRequestRoutes);
app.use('/doctor-tasks', doctorTaskRoutes);
app.use('/notifications', notificationRoutes);


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
if (!process.env.VERCEL) {
    server.listen(PORT, () => {
        console.log(`🚀 Server safely running on port http://localhost:${PORT}`);
    });
}

module.exports = app;
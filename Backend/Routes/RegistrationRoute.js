const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Controllers/RegistrationController');


const { protect, authorizeRoles } = require('../Middlewares/RegistrationMiddleware');


router.post('/register', registerUser);
router.post('/login', loginUser);




router.get('/me', protect, (req, res) => {
    res.json({ message: "Token verified! This user is authenticated.", user: req.user });
});


router.get('/patient-dashboard', protect, authorizeRoles('patient'), (req, res) => {
    res.json({ message: "Welcome to the private patient portal!" });
});

module.exports = router;
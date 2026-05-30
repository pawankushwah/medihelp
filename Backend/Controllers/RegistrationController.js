const User = require('../Models/RegistrationSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const generateToken = (id, role) => {
    return jwt.sign(
        { id, role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '30d' } // Long expiration window for hackathon testing convenience
    );
};


const registerUser = async (req, res) => {
    try {
        const { 
            name, email, password, phone, role, city,
            patientProfile, doctorProfile, institutionProfile
        } = req.body;

        // 1. Common Validations
        if (!name || !email || !password || !phone || !role || !city) {
            return res.status(400).json({ message: 'All common fields are required.' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'A user with this email already exists.' });
        }

        // 2. Prepare the base user object
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name,
            email,
            password: hashedPassword,
            phone,
            role,
            city
        };

        // 3. Dynamic Assignment: Only add the profile that matches the role
        // This prevents 'null' or empty objects from being stored for other roles.
        if (role === 'patient') {
            userData.patientProfile = {
                bloodType: patientProfile?.bloodType || 'Unknown',
                isAvailableToDonate: patientProfile?.isAvailableToDonate || false,
                lastDonationDate: patientProfile?.lastDonationDate || null
            };
        } else if (role === 'doctor') {
            if (!doctorProfile?.specialization) {
                return res.status(400).json({ message: 'Doctor specialization is required.' });
            }
            userData.doctorProfile = {
                specialization: doctorProfile.specialization,
                availabilitySlots: doctorProfile.availabilitySlots || ''
            };
        } else if (role === 'institution') {
            userData.institutionProfile = {
                institutionType: institutionProfile?.institutionType || 'Hospital',
                registrationNumber: institutionProfile?.registrationNumber || ''
            };
        }

        // 4. Create User with the optimized object
        const user = await User.create(userData);

        if (user) {
            res.status(201).json({
                status: 'success',
                _id: user._id,
                role: user.role,
                token: generateToken(user._id, user.role),
                message: `${role} registered successfully!`
            });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};





const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 2. Compare incoming password with hashed password in database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // 3. Send back clean profile data along with signed JWT Token
        res.status(200).json({
            status: 'success',
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id, user.role)
        });

    } catch (error) {
        res.status(500).json({ message: 'Server Error during login.', error: error.message });
    }
};



module.exports = {
    registerUser,
    loginUser
};
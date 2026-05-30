const jwt = require('jsonwebtoken');
const User = require('../Models/RegistrationSchema');

// Middleware to verify a standard valid user session
const protect = async (req, res, next) => {
    let token;

    // Check if token exists in headers and starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extract the token string from the header string array
            token = req.headers.authorization.split(' ')[1];

            // Verify token signatures against your system's secret string
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch the user details associated with token payload, hiding password field
            req.user = await User.findById(decoded.id).select('-password');

            next(); // Move forward to the controller safely
        } catch (error) {
            console.error(`Token authentication error: ${error.message}`);
            return res.status(401).json({ message: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token provided.' });
    }
};

// Middleware to restrict access based on user Roles (e.g., only doctors can access)
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: `Forbidden: Role '${req.user?.role || 'Guest'}' is not allowed to access this endpoint.` 
            });
        }
        next();
    };
};

module.exports = { protect, authorizeRoles };
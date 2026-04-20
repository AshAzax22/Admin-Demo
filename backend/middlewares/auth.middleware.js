const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Middleware to protect routes with JWT
 */
const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select('-password');
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    }

    if (!token) {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

/**
 * Middleware to restrict access based on roles
 * @param {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error(`Role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`));
        }
        next();
    };
};

module.exports = { protect, authorize };

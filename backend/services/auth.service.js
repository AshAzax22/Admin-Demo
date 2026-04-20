const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Generate JWT Token
 * @param {string} id - User ID
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });
};

/**
 * Authenticate user and return token
 */
const login = async (email, password) => {
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
        throw new Error('Invalid credentials');
    }

    const token = generateToken(user._id);

    return {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        storeId: user.storeId,
        token
    };
};

/**
 * Register a new user
 */
const register = async (userData) => {
    const { name, email, password, role, storeId } = userData;

    const userExists = await User.findOne({ email });

    if (userExists) {
        throw new Error('User already exists');
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        storeId
    });

    if (user) {
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            storeId: user.storeId,
            token: generateToken(user._id)
        };
    } else {
        throw new Error('Invalid user data');
    }
};

module.exports = {
    login,
    register
};

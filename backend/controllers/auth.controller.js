const authService = require('../services/auth.service');

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error) {
        res.status(401);
        next(error);
    }
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Private/Super Admin
const registerUser = async (req, res, next) => {
    try {
        const result = await authService.register(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400);
        next(error);
    }
};

module.exports = {
    loginUser,
    registerUser
};

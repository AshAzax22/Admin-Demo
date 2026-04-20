const express = require('express');
const router = express.Router();
const { loginUser, registerUser } = require('../controllers/auth.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.post('/login', loginUser);

// Only Super Admin can register new users in this demo
router.post('/register', protect, authorize('Super Admin'), registerUser);

module.exports = router;

const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/analytics.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/dashboard', protect, authorize('Super Admin', 'Store Manager'), getDashboardStats);

module.exports = router;

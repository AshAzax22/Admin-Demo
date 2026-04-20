const express = require('express');
const router = express.Router();
const { 
    getOrders, 
    getOrder, 
    createOrder, 
    updateStatus 
} = require('../controllers/order.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

router.route('/:id')
    .get(protect, getOrder)
    .patch(protect, authorize('Super Admin', 'Store Manager'), updateStatus);

module.exports = router;

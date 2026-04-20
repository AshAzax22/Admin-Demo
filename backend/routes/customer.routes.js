const express = require('express');
const router = express.Router();
const { 
    getCustomers, 
    getCustomer, 
    createCustomer 
} = require('../controllers/customer.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.route('/')
    .get(protect, getCustomers)
    .post(protect, createCustomer);

router.route('/:id')
    .get(protect, getCustomer);

module.exports = router;

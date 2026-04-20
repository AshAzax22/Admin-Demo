const express = require('express');
const router = express.Router();
const { 
    getInventory, 
    updateInventoryStock, 
    adjustInventoryStock 
} = require('../controllers/inventory.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.route('/')
    .get(protect, getInventory)
    .post(protect, authorize('Super Admin', 'Store Manager'), updateInventoryStock);

router.post('/adjust', protect, authorize('Super Admin', 'Store Manager'), adjustInventoryStock);

module.exports = router;

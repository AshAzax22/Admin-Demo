const express = require('express');
const router = express.Router();
const { 
    getCoupons, 
    createCoupon, 
    deleteCoupon, 
    validateCoupon 
} = require('../controllers/coupon.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.get('/', protect, getCoupons);
router.post('/', protect, authorize('Super Admin'), createCoupon);
router.delete('/:id', protect, authorize('Super Admin'), deleteCoupon);
router.post('/validate', protect, validateCoupon);

module.exports = router;

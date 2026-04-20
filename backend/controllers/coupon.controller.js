const Coupon = require('../models/coupon.model');

const getCoupons = async (req, res, next) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        next(error);
    }
};

const createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        next(error);
    }
};

const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) {
            res.status(404);
            throw new Error('Coupon not found');
        }
        res.json({ message: 'Coupon removed' });
    } catch (error) {
        next(error);
    }
};

const validateCoupon = async (req, res, next) => {
    try {
        const { code, purchaseAmount } = req.body;
        const coupon = await Coupon.findOne({ code, isActive: true });

        if (!coupon) {
            res.status(404);
            throw new Error('Invalid or inactive coupon code');
        }

        if (new Date() > coupon.expiryDate) {
            res.status(400);
            throw new Error('Coupon has expired');
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            res.status(400);
            throw new Error('Coupon usage limit reached');
        }

        if (purchaseAmount < coupon.minPurchase) {
            res.status(400);
            throw new Error(`Minimum purchase of ₹${coupon.minPurchase} required`);
        }

        // Calculate discount
        let discount = 0;
        if (coupon.discountType === 'Percentage') {
            discount = (purchaseAmount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        } else {
            discount = coupon.discountValue;
        }

        res.json({
            code: coupon.code,
            discount,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCoupons,
    createCoupon,
    deleteCoupon,
    validateCoupon
};

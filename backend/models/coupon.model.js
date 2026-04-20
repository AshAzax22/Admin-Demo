const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please add a coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        enum: ['Percentage', 'Flat'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number // Only for Percentage type
    },
    expiryDate: {
        type: Date,
        required: true
    },
    usageLimit: {
        type: Number,
        default: 100
    },
    usedCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Coupon', couponSchema);

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    customer: {
        type: mongoose.Schema.ObjectId,
        ref: 'Customer',
        required: true
    },
    store: {
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
        required: true
    },
    items: [{
        product: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: true
        },
        name: String,
        price: Number,
        quantity: Number
    }],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Out for delivery', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Online'],
        required: true
    },
    placedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);

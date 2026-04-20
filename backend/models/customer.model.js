const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    phone: {
        type: String,
        required: [true, 'Please add a phone number']
    },
    loyaltyPoints: {
        type: Number,
        default: 0
    },
    totalSpent: {
        type: Number,
        default: 0
    },
    lastPurchaseDate: Date,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', customerSchema);

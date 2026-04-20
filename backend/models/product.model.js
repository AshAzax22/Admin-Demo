const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    sku: {
        type: String,
        required: [true, 'Please add a SKU'],
        unique: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    price: {
        type: Number,
        required: [true, 'Please add a price']
    },
    category: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        required: [true, 'Please add a category']
    },
    images: [{
        type: String // Store local paths e.g. /uploads/product-123.jpg
    }],
    variants: [{
        name: String, // e.g. Size, Color
        options: [String] // e.g. S, M, L or Red, Blue
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Product', productSchema);

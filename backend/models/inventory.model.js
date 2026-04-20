const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    store: {
        type: mongoose.Schema.ObjectId,
        ref: 'Store',
        required: true
    },
    stock: {
        type: Number,
        required: true,
        default: 0
    },
    lowStockThreshold: {
        type: Number,
        default: 10
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure unique product per store
inventorySchema.index({ product: 1, store: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);

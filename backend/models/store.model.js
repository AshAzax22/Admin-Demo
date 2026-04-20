const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a store name'],
        unique: true
    },
    location: {
        type: String,
        required: [true, 'Please add a location']
    },
    contactNumber: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Store', storeSchema);

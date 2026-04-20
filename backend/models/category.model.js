const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a category name'],
        unique: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true
    },
    parent: {
        type: mongoose.Schema.ObjectId,
        ref: 'Category',
        default: null
    },
    description: String,
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create slug from name before saving
categorySchema.pre('save', async function() {
    if (this.isModified('name')) {
        this.slug = this.name.toLowerCase().split(' ').join('-');
    }
});

module.exports = mongoose.model('Category', categorySchema);

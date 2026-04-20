const Inventory = require('../models/inventory.model');

const getStoreInventory = async (storeId) => {
    return await Inventory.find({ store: storeId }).populate('product');
};

const getAllInventory = async (query = {}) => {
    return await Inventory.find(query).populate('product').populate('store');
};

const updateStock = async (productId, storeId, amount) => {
    // findOneAndUpdate with upsert: true handles both initial creation and updates
    return await Inventory.findOneAndUpdate(
        { product: productId, store: storeId },
        { $set: { stock: amount, lastUpdated: new Date() } },
        { new: true, upsert: true, runValidators: true }
    ).populate('product').populate('store');
};

const adjustStock = async (productId, storeId, delta) => {
    return await Inventory.findOneAndUpdate(
        { product: productId, store: storeId },
        { $inc: { stock: delta }, $set: { lastUpdated: new Date() } },
        { new: true, upsert: true, runValidators: true }
    ).populate('product').populate('store');
};

module.exports = {
    getStoreInventory,
    getAllInventory,
    updateStock,
    adjustStock
};

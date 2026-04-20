const Store = require('../models/store.model');
const User = require('../models/user.model');
const Inventory = require('../models/inventory.model');
const Order = require('../models/order.model');

const getAllStores = async () => {
    return await Store.find();
};

const getStoreById = async (id) => {
    return await Store.findById(id);
};

const getStoreInsights = async (id) => {
    const [staff, inventory, orders] = await Promise.all([
        User.find({ storeId: id, role: { $in: ['Store Manager', 'Staff'] } }).select('-password'),
        Inventory.find({ store: id }).populate('product', 'name price'),
        Order.find({ store: id }).sort({ createdAt: -1 }).limit(10).populate('customer', 'name')
    ]);

    const totalStock = inventory.reduce((sum, item) => sum + item.stock, 0);
    const lowStockItems = inventory.filter(item => item.stock <= item.lowStockThreshold);
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

    return {
        staff,
        inventory: {
            totalItems: inventory.length,
            totalStock,
            lowStockCount: lowStockItems.length,
            items: inventory.slice(0, 5) // Last 5 inventory records for preview
        },
        recentOrders: orders,
        metrics: {
            totalRevenue,
            avgOrderValue: orders.length > 0 ? totalRevenue / orders.length : 0
        }
    };
};

const createStore = async (storeData) => {
    return await Store.create(storeData);
};

const updateStore = async (id, storeData) => {
    return await Store.findByIdAndUpdate(id, storeData, {
        new: true,
        runValidators: true
    });
};

const deleteStore = async (id) => {
    return await Store.findByIdAndDelete(id);
};

module.exports = {
    getAllStores,
    getStoreById,
    getStoreInsights,
    createStore,
    updateStore,
    deleteStore
};

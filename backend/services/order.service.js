const Order = require('../models/order.model');
const Customer = require('../models/customer.model');
const Inventory = require('../models/inventory.model');

const getAllOrders = async (query = {}, options = {}) => {
    let findQuery = Order.find(query)
        .populate('customer', 'name email')
        .populate('store', 'name')
        .sort({ createdAt: -1 });

    if (options.limit) {
        findQuery = findQuery.limit(options.limit);
    }

    return await findQuery;
};

const getOrderById = async (id) => {
    return await Order.findById(id)
        .populate('customer')
        .populate('store')
        .populate('items.product');
};

const createOrder = async (orderData) => {
    // Generate order number
    const count = await Order.countDocuments();
    const orderNumber = `ORD-${Date.now()}-${count + 1}`;
    
    const order = await Order.create({
        ...orderData,
        orderNumber
    });

    // Reduce inventory for each item
    for (const item of order.items) {
        await Inventory.findOneAndUpdate(
            { product: item.product, store: order.store },
            { $inc: { stock: -item.quantity } }
        );
    }

    return order;
};

const updateOrderStatus = async (id, status) => {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    
    // If completed, update customer stats
    if (status === 'Completed' && order) {
        await Customer.findByIdAndUpdate(order.customer, {
            $inc: { 
                totalSpent: order.totalAmount,
                loyaltyPoints: Math.floor(order.totalAmount / 10) // 1 point per 10 currency units
            },
            $set: { lastPurchaseDate: new Date() }
        });
    }

    return order;
};

module.exports = {
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus
};

const orderService = require('../services/order.service');

const getOrders = async (req, res, next) => {
    try {
        const { storeId, status, customerId, limit } = req.query;
        let query = {};
        
        // Enforce scoping for Store Managers
        if (req.user.role === 'Store Manager') {
            query.store = req.user.storeId;
        } else if (storeId) {
            query.store = storeId;
        }

        if (status) query.status = status;
        if (customerId) query.customer = customerId;

        const options = {
            limit: limit ? parseInt(limit) : 0
        };

        const orders = await orderService.getAllOrders(query, options);
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

const getOrder = async (req, res, next) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

const createOrder = async (req, res, next) => {
    try {
        const order = await orderService.createOrder(req.body);
        res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

const updateStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await orderService.updateOrderStatus(req.params.id, status);
        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }
        res.json(order);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getOrders,
    getOrder,
    createOrder,
    updateStatus
};

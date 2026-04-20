const customerService = require('../services/customer.service');
const Order = require('../models/order.model');

const getCustomers = async (req, res, next) => {
    try {
        const { search } = req.query;
        let query = {};

        // Scope validation for Store Managers: only show customers who have ordered from their store
        if (req.user.role === 'Store Manager') {
            const storeOrders = await Order.find({ store: req.user.storeId }).distinct('customer');
            query._id = { $in: storeOrders };
        }

        if (search) {
            const searchRegex = { $regex: search, $options: 'i' };
            const searchFilter = {
                $or: [
                    { name: searchRegex },
                    { email: searchRegex },
                    { phone: searchRegex }
                ]
            };
            
            // Merge filters
            if (query._id) {
                query = { $and: [ { _id: query._id }, searchFilter ] };
            } else {
                query = searchFilter;
            }
        }
        
        const customers = await customerService.getAllCustomers(query);
        res.json(customers);
    } catch (error) {
        next(error);
    }
};

const getCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.getCustomerById(req.params.id);
        if (!customer) {
            res.status(404);
            throw new Error('Customer not found');
        }
        res.json(customer);
    } catch (error) {
        next(error);
    }
};

const createCustomer = async (req, res, next) => {
    try {
        const customer = await customerService.createCustomer(req.body);
        res.status(201).json(customer);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCustomers,
    getCustomer,
    createCustomer
};

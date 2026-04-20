const Customer = require('../models/customer.model');

const getAllCustomers = async (query = {}) => {
    return await Customer.find(query);
};

const getCustomerById = async (id) => {
    return await Customer.findById(id);
};

const createCustomer = async (customerData) => {
    return await Customer.create(customerData);
};

const updateCustomer = async (id, customerData) => {
    return await Customer.findByIdAndUpdate(id, customerData, {
        new: true,
        runValidators: true
    });
};

module.exports = {
    getAllCustomers,
    getCustomerById,
    createCustomer,
    updateCustomer
};

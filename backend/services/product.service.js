const Product = require('../models/product.model');

const getAllProducts = async (query = {}) => {
    return await Product.find(query).populate('category', 'name');
};

const getProductById = async (id) => {
    return await Product.findById(id).populate('category', 'name');
};

const createProduct = async (productData) => {
    return await Product.create(productData);
};

const updateProduct = async (id, productData) => {
    return await Product.findByIdAndUpdate(id, productData, {
        new: true,
        runValidators: true
    });
};

const deleteProduct = async (id) => {
    return await Product.findByIdAndDelete(id);
};

module.exports = {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};

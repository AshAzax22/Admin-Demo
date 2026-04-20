const productService = require('../services/product.service');

const getProducts = async (req, res, next) => {
    try {
        const { category, search } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (search) query.name = { $regex: search, $options: 'i' };

        const products = await productService.getAllProducts(query);
        res.json(products);
    } catch (error) {
        next(error);
    }
};

const getProduct = async (req, res, next) => {
    try {
        const product = await productService.getProductById(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

const createProduct = async (req, res, next) => {
    try {
        const productData = {
            ...req.body,
            // Images will now be sent as an array of URLs in req.body
            images: req.body.images || [],
            user: req.user._id
        };

        const product = await productService.createProduct(productData);
        res.status(201).json(product);
    } catch (error) {
        next(error);
    }
};

const updateProduct = async (req, res, next) => {
    try {
        const product = await productService.updateProduct(req.params.id, req.body);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        res.json(product);
    } catch (error) {
        next(error);
    }
};

const deleteProduct = async (req, res, next) => {
    try {
        const product = await productService.deleteProduct(req.params.id);
        if (!product) {
            res.status(404);
            throw new Error('Product not found');
        }
        res.json({ message: 'Product removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct
};

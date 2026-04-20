const express = require('express');
const router = express.Router();
const { 
    getProducts, 
    getProduct, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/product.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.route('/')
    .get(getProducts)
    .post(protect, authorize('Super Admin', 'Store Manager'), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, authorize('Super Admin', 'Store Manager'), updateProduct)
    .delete(protect, authorize('Super Admin', 'Store Manager'), deleteProduct);

module.exports = router;

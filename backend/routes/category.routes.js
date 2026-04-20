const express = require('express');
const router = express.Router();
const { 
    getCategories, 
    getCategory, 
    createCategory, 
    updateCategory, 
    deleteCategory 
} = require('../controllers/category.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.route('/')
    .get(getCategories)
    .post(protect, authorize('Super Admin'), createCategory);

router.route('/:id')
    .get(getCategory)
    .put(protect, authorize('Super Admin'), updateCategory)
    .delete(protect, authorize('Super Admin'), deleteCategory);

module.exports = router;

const categoryService = require('../services/category.service');

const getCategories = async (req, res, next) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.json(categories);
    } catch (error) {
        next(error);
    }
};

const getCategory = async (req, res, next) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }
        res.json(category);
    } catch (error) {
        next(error);
    }
};

const createCategory = async (req, res, next) => {
    try {
        const category = await categoryService.createCategory(req.body);
        res.status(201).json(category);
    } catch (error) {
        next(error);
    }
};

const updateCategory = async (req, res, next) => {
    try {
        const category = await categoryService.updateCategory(req.params.id, req.body);
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }
        res.json(category);
    } catch (error) {
        next(error);
    }
};

const deleteCategory = async (req, res, next) => {
    try {
        const category = await categoryService.deleteCategory(req.params.id);
        if (!category) {
            res.status(404);
            throw new Error('Category not found');
        }
        res.json({ message: 'Category removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory
};

const Category = require('../models/category.model');
const mongoose = require('mongoose');

const getAllCategories = async () => {
    return await Category.aggregate([
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'category',
                as: 'products'
            }
        },
        {
            $addFields: {
                productCount: { $size: '$products' }
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'parent',
                foreignField: '_id',
                as: 'parentInfo'
            }
        },
        {
            $addFields: {
                parent: { $arrayElemAt: ['$parentInfo', 0] }
            }
        },
        {
            $project: {
                products: 0,
                parentInfo: 0
            }
        },
        {
            $sort: { parent: 1, name: 1 }
        }
    ]);
};

const getCategoryById = async (id) => {
    const results = await Category.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(id) } },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'category',
                as: 'products'
            }
        },
        {
            $addFields: {
                productCount: { $size: '$products' }
            }
        },
        {
            $lookup: {
                from: 'categories',
                localField: 'parent',
                foreignField: '_id',
                as: 'parent'
            }
        },
        {
            $unwind: { path: '$parent', preserveNullAndEmptyArrays: true }
        },
        { $project: { products: 0 } }
    ]);
    return results[0];
};

const createCategory = async (categoryData) => {
    return await Category.create(categoryData);
};

const updateCategory = async (id, categoryData) => {
    return await Category.findByIdAndUpdate(id, categoryData, {
        new: true,
        runValidators: true
    });
};

const deleteCategory = async (id) => {
    return await Category.findByIdAndDelete(id);
};

module.exports = {
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory
};

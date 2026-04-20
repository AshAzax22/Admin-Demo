const Order = require('../models/order.model');
const mongoose = require('mongoose');

/**
 * Get overall sales stats (KPIs)
 * @param {string} storeId - Optional store ID to filter stats
 */
const getSalesOverview = async (storeId = null) => {
    const matchQuery = { status: 'Completed' };
    if (storeId) {
        matchQuery.store = new mongoose.Types.ObjectId(storeId);
    }

    const stats = await Order.aggregate([
        { $match: matchQuery },
        { 
            $group: { 
                _id: null,
                totalRevenue: { $sum: '$totalAmount' },
                totalOrders: { $sum: 1 },
                avgOrderValue: { $avg: '$totalAmount' }
            } 
        }
    ]);
    return stats[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 };
};

/**
 * Get sales by store
 * @param {string} storeId - Optional store ID to filter stats
 */
const getSalesByStore = async (storeId = null) => {
    const matchQuery = { status: 'Completed' };
    if (storeId) {
        matchQuery.store = new mongoose.Types.ObjectId(storeId);
    }

    const results = await Order.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: '$store',
                revenue: { $sum: '$totalAmount' },
                orderCount: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from: 'stores',
                localField: '_id',
                foreignField: '_id',
                as: 'storeDetails'
            }
        },
        { $unwind: '$storeDetails' },
        {
            $project: {
                _id: 1,
                revenue: 1,
                orderCount: 1,
                name: '$storeDetails.name'
            }
        }
    ]);
    return results;
};

/**
 * Get sales trend over time (Last 30 days)
 * @param {string} storeId - Optional store ID to filter stats
 */
const getDailySalesTrend = async (storeId = null) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const matchQuery = { 
        status: 'Completed',
        placedAt: { $gte: thirtyDaysAgo }
    };
    if (storeId) {
        matchQuery.store = new mongoose.Types.ObjectId(storeId);
    }

    const trend = await Order.aggregate([
        { $match: matchQuery },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m-%d", date: "$placedAt" } },
                revenue: { $sum: "$totalAmount" },
                orderCount: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);
    return trend;
};

module.exports = {
    getSalesOverview,
    getSalesByStore,
    getDailySalesTrend
};

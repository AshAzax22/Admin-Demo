const analyticsService = require('../services/analytics.service');

const getDashboardStats = async (req, res, next) => {
    try {
        const storeId = req.user.role === 'Store Manager' ? req.user.storeId : null;

        const overview = await analyticsService.getSalesOverview(storeId);
        const storePerformance = await analyticsService.getSalesByStore(storeId);
        const trend = await analyticsService.getDailySalesTrend(storeId);

        res.json({
            overview,
            storePerformance,
            trend
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getDashboardStats
};

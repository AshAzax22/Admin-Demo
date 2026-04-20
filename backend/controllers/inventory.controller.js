const inventoryService = require('../services/inventory.service');

const getInventory = async (req, res, next) => {
    try {
        const { storeId, productId } = req.query;
        let query = {};
        
        // Enforce scoping for Store Managers
        if (req.user.role === 'Store Manager') {
            query.store = req.user.storeId;
        } else if (storeId) {
            query.store = storeId;
        }

        if (productId) query.product = productId;

        const inventory = await inventoryService.getAllInventory(query);
        res.json(inventory);
    } catch (error) {
        next(error);
    }
};

const updateInventoryStock = async (req, res, next) => {
    try {
        const { productId, storeId, stock } = req.body;
        const inventory = await inventoryService.updateStock(productId, storeId, stock);
        res.json(inventory);
    } catch (error) {
        next(error);
    }
};

const adjustInventoryStock = async (req, res, next) => {
    try {
        const { productId, storeId, delta } = req.body;
        const inventory = await inventoryService.adjustStock(productId, storeId, delta);
        res.json(inventory);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getInventory,
    updateInventoryStock,
    adjustInventoryStock
};

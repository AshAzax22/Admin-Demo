const storeService = require('../services/store.service');

const getStores = async (req, res, next) => {
    try {
        let stores = await storeService.getAllStores();
        
        // Enforce scoping for Store Managers: Only show their own store
        if (req.user.role === 'Store Manager') {
            stores = stores.filter(s => s._id.toString() === req.user.storeId.toString());
        }

        res.json(stores);
    } catch (error) {
        next(error);
    }
};

const getStore = async (req, res, next) => {
    try {
        const store = await storeService.getStoreById(req.params.id);
        if (!store) {
            res.status(404);
            throw new Error('Store not found');
        }
        res.json(store);
    } catch (error) {
        next(error);
    }
};

const getStoreInsights = async (req, res, next) => {
    try {
        // Enforce scoping: Store Managers can only see their own store's insights
        if (req.user.role === 'Store Manager' && req.user.storeId.toString() !== req.params.id) {
            res.status(403);
            throw new Error('Access denied: You can only view insights for your assigned store');
        }

        const insights = await storeService.getStoreInsights(req.params.id);
        res.json(insights);
    } catch (error) {
        next(error);
    }
};

const createStore = async (req, res, next) => {
    try {
        const store = await storeService.createStore(req.body);
        res.status(201).json(store);
    } catch (error) {
        next(error);
    }
};

const updateStore = async (req, res, next) => {
    try {
        const store = await storeService.updateStore(req.params.id, req.body);
        if (!store) {
            res.status(404);
            throw new Error('Store not found');
        }
        res.json(store);
    } catch (error) {
        next(error);
    }
};

const deleteStore = async (req, res, next) => {
    try {
        const store = await storeService.deleteStore(req.params.id);
        if (!store) {
            res.status(404);
            throw new Error('Store not found');
        }
        res.json({ message: 'Store removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getStores,
    getStore,
    getStoreInsights,
    createStore,
    updateStore,
    deleteStore
};

const express = require('express');
const router = express.Router();
const { 
    getStores, 
    getStore, 
    getStoreInsights,
    createStore, 
    updateStore, 
    deleteStore 
} = require('../controllers/store.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

router.use(protect);
router.get('/:id/insights', authorize('Super Admin', 'Store Manager'), getStoreInsights);

router.route('/')
    .get(getStores)
    .post(protect, authorize('Super Admin'), createStore);

router.route('/:id')
    .get(getStore)
    .put(protect, authorize('Super Admin'), updateStore)
    .delete(protect, authorize('Super Admin'), deleteStore);

module.exports = router;

const express = require('express');
const router = express.Router();
const { 
    getEmployees, 
    createEmployee, 
    updateEmployee, 
    deleteEmployee 
} = require('../controllers/user.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

// All employee routes are restricted to Super Admin or Store Manager
router.use(protect);
router.use(authorize('Super Admin', 'Store Manager'));

router.route('/')
    .get(getEmployees)
    .post(createEmployee);

router.route('/:id')
    .put(updateEmployee)
    .delete(deleteEmployee);

module.exports = router;

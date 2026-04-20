const User = require('../models/user.model');

/**
 * Get all employees (Managers and Staff)
 */
const getEmployees = async (req, res, next) => {
    try {
        let query = { role: { $in: ['Store Manager', 'Staff'] } };
        
        // Enforce scoping for Store Managers
        if (req.user.role === 'Store Manager') {
            query.storeId = req.user.storeId;
        } else if (req.query.storeId) {
            // Respect query param for Super Admins
            query.storeId = req.query.storeId;
        }

        const employees = await User.find(query).populate('storeId', 'name location').select('-password');
        res.json(employees);
    } catch (error) {
        next(error);
    }
};

/**
 * Create a new employee
 */
const createEmployee = async (req, res, next) => {
    try {
        const { name, email, password, role, storeId } = req.body;
        
        // Protection: Only Super Admin can create Managers or Super Admins
        if (req.user.role !== 'Super Admin' && (role === 'Super Admin' || role === 'Store Manager')) {
            res.status(403);
            throw new Error('Unauthorized to create this role');
        }

        // Force storeId for Managers
        const finalStoreId = req.user.role === 'Store Manager' ? req.user.storeId : storeId;

        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const employee = await User.create({
            name,
            email,
            password,
            role,
            storeId: finalStoreId
        });

        res.status(201).json({
            _id: employee._id,
            name: employee.name,
            email: employee.email,
            role: employee.role,
            storeId: employee.storeId
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Update an employee
 */
const updateEmployee = async (req, res, next) => {
    try {
        const employee = await User.findById(req.params.id);
        if (!employee) {
            res.status(404);
            throw new Error('Employee not found');
        }

        employee.name = req.body.name || employee.name;
        employee.email = req.body.email || employee.email;
        employee.role = req.body.role || employee.role;
        employee.storeId = req.body.storeId || employee.storeId;

        if (req.body.password) {
            employee.password = req.body.password;
        }

        const updatedEmployee = await employee.save();
        res.json({
            _id: updatedEmployee._id,
            name: updatedEmployee.name,
            email: updatedEmployee.email,
            role: updatedEmployee.role,
            storeId: updatedEmployee.storeId
        });
    } catch (error) {
        next(error);
    }
};

/**
 * Delete an employee
 */
const deleteEmployee = async (req, res, next) => {
    try {
        const employee = await User.findById(req.params.id);
        if (!employee) {
            res.status(404);
            throw new Error('Employee not found');
        }

        await employee.deleteOne();
        res.json({ message: 'Employee removed' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee
};

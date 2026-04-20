require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Global Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Routes
app.get('/', (req, res) => {
    res.send('Omnichannel Retail Admin API is running...');
});

// Auth Routes
app.use('/api/auth', require('./routes/auth.routes'));
// Category Routes
app.use('/api/categories', require('./routes/category.routes'));
// Product Routes
app.use('/api/products', require('./routes/product.routes'));
// Store Routes
app.use('/api/stores', require('./routes/store.routes'));
// Inventory Routes
app.use('/api/inventory', require('./routes/inventory.routes'));
// Customer Routes
app.use('/api/customers', require('./routes/customer.routes'));
// Order Routes
app.use('/api/orders', require('./routes/order.routes'));
// Coupon Routes
app.use('/api/coupons', require('./routes/coupon.routes'));
// Analytics Routes
app.use('/api/analytics', require('./routes/analytics.routes'));
// User (Employee) Routes
app.use('/api/users', require('./routes/user.routes'));

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

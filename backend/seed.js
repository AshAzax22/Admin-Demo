const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/user.model');
const Store = require('./models/store.model');
const Category = require('./models/category.model');
const Product = require('./models/product.model');
const Inventory = require('./models/inventory.model');
const Customer = require('./models/customer.model');
const Order = require('./models/order.model');
const Coupon = require('./models/coupon.model');

dotenv.config();

const getRandomItem = (array) => array[Math.floor(Math.random() * array.length)];
const getRandomDate = (daysAgo) => {
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
    return date;
};

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for advanced seeding...');

        // Clear existing data
        await User.deleteMany();
        await Store.deleteMany();
        await Category.deleteMany();
        await Product.deleteMany();
        await Inventory.deleteMany();
        await Customer.deleteMany();
        await Order.deleteMany();
        await Coupon.deleteMany();

        console.log('Cleared existing data.');

        // 1. Create Stores
        const stores = await Store.create([
            { name: 'NY Flagship', location: 'Manhattan, NY', contactNumber: '+1 212-555-0198' },
            { name: 'London Store', location: 'Regent St, London', contactNumber: '+44 20 7946 0958' },
            { name: 'Tokyo Hub', location: 'Shibuya, Tokyo', contactNumber: '+81 3-5456-7890' },
            { name: 'Paris Boutique', location: 'Champs-Élysées, Paris', contactNumber: '+33 1 42 25 15 15' },
            { name: 'Berlin Outlet', location: 'Kurfürstendamm, Berlin', contactNumber: '+49 30 12345678' }
        ]);
        console.log('5 Stores created.');

        // 2. Create Users
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@demo.com',
            password: 'password123',
            role: 'Super Admin'
        });

        await User.create({
            name: 'Store Manager',
            email: 'manager@demo.com',
            password: 'password123',
            role: 'Store Manager',
            storeId: stores[0]._id
        });

        // 2.1 Create 15 Staff members
        const staffNames = [
            'Alice Johnson', 'Bob Smith', 'Charlie Brown', 'Diana Prince', 'Ethan Hunt',
            'Fiona Gallagher', 'George Miller', 'Hannah Abbott', 'Ian Wright', 'Jenny Lee',
            'Kevin Hart', 'Laura Palmer', 'Mike Ross', 'Nina Williams', 'Oscar Isaac'
        ];

        for (let i = 0; i < staffNames.length; i++) {
            await User.create({
                name: staffNames[i],
                email: `staff${i+1}@demo.com`,
                password: 'password123',
                role: i < 3 ? 'Store Manager' : 'Staff', // First 3 are also managers
                storeId: getRandomItem(stores)._id
            });
        }

        console.log('20 Users (Admin + Managers + Staff) created.');

        // 3. Create Categories (Hierarchical: Root -> Sub -> Leaf)
        // Root Categories
        const roots = await Category.create([
            { name: 'Electronics', description: 'Gadgets and tech' },
            { name: 'Fashion', description: 'Clothing and accessories' },
            { name: 'Home & Living', description: 'Furniture and decor' }
        ]);

        // Sub-Categories
        const subs = await Category.create([
            { name: 'Computing', parent: roots[0]._id, description: 'Laptops and accessories' },
            { name: 'Audio', parent: roots[0]._id, description: 'Speakers and headphones' },
            { name: 'Men\'s Wear', parent: roots[1]._id, description: 'Clothing for men' },
            { name: 'Women\'s Wear', parent: roots[1]._id, description: 'Clothing for women' },
            { name: 'Furniture', parent: roots[2]._id, description: 'Sofas and tables' }
        ]);

        // Leaf Categories (Products will be mapped here)
        const leaves = await Category.create([
            { name: 'Laptops', parent: subs[0]._id },
            { name: 'Headphones', parent: subs[1]._id },
            { name: 'Smartphones', parent: roots[0]._id }, // Direct child of root for variety
            { name: 'T-Shirts', parent: subs[2]._id },
            { name: 'Watches', parent: roots[1]._id }, // Direct child of root
            { name: 'Desks', parent: subs[4]._id }
        ]);
        console.log('Categories hierarchy created.');

        // 4. Create Customers (20 customers)
        const customers = [];
        for (let i = 1; i <= 20; i++) {
            customers.push(await Customer.create({
                name: `Customer ${i}`,
                email: `customer${i}@example.com`,
                phone: `+1 555-010${i}`,
                address: {
                    street: `${100 + i} Main St`,
                    city: 'New York',
                    state: 'NY',
                    zip: '10001'
                }
            }));
        }
        console.log('20 Customers created.');

        // 5. Create Products (12 products mapped to LEAVES)
        const productMetadata = [
            { name: 'Pro Wireless Headphones', category: leaves[1]._id, price: 15999, sku: 'ELE-001' },
            { name: 'Smart Watch Series 5', category: leaves[4]._id, price: 24999, sku: 'ELE-002' },
            { name: 'Gaming Laptop X1', category: leaves[0]._id, price: 89999, sku: 'ELE-003' },
            { name: 'Premium Cotton Tee', category: leaves[3]._id, price: 1499, sku: 'APP-001' },
            { name: 'Slim Fit Denim', category: leaves[3]._id, price: 3499, sku: 'APP-002' },
            { name: 'Minimalist Desk', category: leaves[5]._id, price: 12999, sku: 'HOM-001' },
            { name: 'Leather Sneakers', category: leaves[4]._id, price: 5999, sku: 'FTW-001' },
            { name: 'Running Shoes', category: leaves[4]._id, price: 7499, sku: 'FTW-002' },
            { name: 'Casual Smartphone', category: leaves[2]._id, price: 4999, sku: 'ELE-004' },
            { name: 'Bluetooth Speaker', category: leaves[1]._id, price: 3499, sku: 'ELE-005' },
            { name: 'Work Desk Pro', category: leaves[5]._id, price: 18999, sku: 'HOM-002' },
            { name: 'Summer Dress', category: leaves[4]._id, price: 4499, sku: 'APP-003' }
        ];

        const products = [];
        for (const p of productMetadata) {
            products.push(await Product.create({
                ...p,
                description: `High-quality ${p.name} from our latest collection.`,
                images: [],
                user: admin._id
            }));
        }
        console.log('12 Products created.');

        // 6. Create Coupons
        const coupons = await Coupon.create([
            { code: 'WELCOME10', discountType: 'Percentage', discountValue: 10, minPurchase: 1000, isActive: true, expiryDate: new Date('2026-12-31') },
            { code: 'SAVE500', discountType: 'Flat', discountValue: 500, minPurchase: 5000, isActive: true, expiryDate: new Date('2026-12-31') },
            { code: 'FESTIVE20', discountType: 'Percentage', discountValue: 20, minPurchase: 2000, isActive: true, expiryDate: new Date('2026-12-31') },
            { code: 'EXPIRED15', discountType: 'Percentage', discountValue: 15, minPurchase: 500, isActive: false, expiryDate: new Date('2024-01-01') }
        ]);
        console.log('4 Coupons created.');

        // 7. Create Inventory Records
        for (const store of stores) {
            for (const product of products) {
                await Inventory.create({
                    product: product._id,
                    store: store._id,
                    stock: Math.floor(Math.random() * 100) + 20,
                    lowStockThreshold: 15
                });
            }
        }
        console.log('Inventory records created.');

        // 8. Create Orders (60 orders spread over 30 days)
        console.log('Creating 60 orders for analytics...');
        for (let i = 1; i <= 60; i++) {
            const customer = getRandomItem(customers);
            const store = getRandomItem(stores);
            const numItems = Math.floor(Math.random() * 3) + 1;
            const items = [];
            let totalAmount = 0;

            for (let j = 0; j < numItems; j++) {
                const product = getRandomItem(products);
                const qty = Math.floor(Math.random() * 2) + 1;
                items.push({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    quantity: qty
                });
                totalAmount += product.price * qty;
            }

            const status = getRandomItem(['Completed', 'Completed', 'Completed', 'Out for delivery', 'Pending', 'Cancelled']);
            const date = getRandomDate(30);

            await Order.create({
                orderNumber: `ORD-${Date.now()}-${i}`,
                customer: customer._id,
                store: store._id,
                items,
                totalAmount,
                status,
                paymentStatus: status === 'Completed' ? 'Paid' : 'Pending',
                paymentMethod: getRandomItem(['Cash', 'Card', 'Online']),
                placedAt: date,
                createdAt: date
            });

            // If completed, update customer stats
            if (status === 'Completed') {
                await Customer.findByIdAndUpdate(customer._id, {
                    $inc: { 
                        totalSpent: totalAmount,
                        loyaltyPoints: Math.floor(totalAmount / 10)
                    },
                    $set: { lastPurchaseDate: date }
                });
            }
        }

        console.log('60 Orders created successfully!');
        console.log('Advanced seeding completed!');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();

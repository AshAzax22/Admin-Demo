import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, User, Mail, Phone, Trophy, CreditCard, ChevronRight, ShoppingBag, Clock } from 'lucide-react';
import Modal from '../components/ui/Modal';
import styles from './CustomersPage.module.css';

const statusColors = {
    'Pending': '#f59e0b',
    'Confirmed': '#3b82f6',
    'Out for delivery': '#8b5cf6',
    'Completed': '#10b981',
    'Cancelled': '#ef4444'
};

const CustomersPage = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    
    // Details Modal State
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customerOrders, setCustomerOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    useEffect(() => {
        fetchCustomers();
    }, [search]);

    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get('/api/customers', {
                params: { search }
            });
            setCustomers(data);
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = async (customer) => {
        setSelectedCustomer(customer);
        setIsDetailsModalOpen(true);
        setLoadingOrders(true);
        try {
            const { data } = await axios.get('/api/orders', {
                params: { customerId: customer._id }
            });
            setCustomerOrders(data);
        } catch (error) {
            console.error('Error fetching customer orders:', error);
        } finally {
            setLoadingOrders(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Customer Relationship Management</h1>
                    <p>Track customer loyalty, purchase history, and engagement.</p>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by name, email or phone..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className={styles.loader}>Loading customer data...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Contact</th>
                                <th>Loyalty Points</th>
                                <th>Total Spent</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => (
                                <tr key={customer._id}>
                                    <td>
                                        <div className={styles.userCell}>
                                            <div className={styles.avatar}>
                                                <User size={20} />
                                            </div>
                                            <div className={styles.userInfo}>
                                                <span className={styles.userName}>{customer.name}</span>
                                                <span className={styles.userId}>ID: {customer._id.slice(-6).toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.contactCell}>
                                            <div className={styles.contactItem}>
                                                <Mail size={14} />
                                                <span>{customer.email}</span>
                                            </div>
                                            <div className={styles.contactItem}>
                                                <Phone size={14} />
                                                <span>{customer.phone}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.loyaltyTag}>
                                            <Trophy size={14} />
                                            <span>{customer.loyaltyPoints} pts</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.spendCell}>
                                            <CreditCard size={14} />
                                            <span>₹{customer.totalSpent.toLocaleString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className={styles.detailsBtn}
                                            onClick={() => handleViewDetails(customer)}
                                        >
                                            <span>View Details</span>
                                            <ChevronRight size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {customers.length === 0 && <div className={styles.empty}>No customers found matching your search.</div>}
                </div>
            )}

            {/* Customer Details Modal */}
            <Modal 
                isOpen={isDetailsModalOpen}
                onClose={() => setIsDetailsModalOpen(false)}
                title="Customer Insights"
            >
                {selectedCustomer && (
                    <div className={styles.detailsContent}>
                        <div className={styles.profileSection}>
                            <div className={styles.profileAvatar}>
                                <User size={32} />
                            </div>
                            <div className={styles.profileInfo}>
                                <h2>{selectedCustomer.name}</h2>
                                <p className={styles.joinedDate}>Joined {new Date(selectedCustomer.createdAt).toLocaleDateString()}</p>
                                <div className={styles.profileStats}>
                                    <div className={styles.pStat}>
                                        <Trophy size={14} />
                                        <span>{selectedCustomer.loyaltyPoints} Points</span>
                                    </div>
                                    <div className={styles.pStat}>
                                        <ShoppingBag size={14} />
                                        <span>₹{selectedCustomer.totalSpent.toLocaleString()} Spent</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={styles.historySection}>
                            <h3>Order History</h3>
                            {loadingOrders ? (
                                <div className={styles.modalLoader}>Retrieving purchase history...</div>
                            ) : customerOrders.length === 0 ? (
                                <p className={styles.emptySmall}>No order history found for this store.</p>
                            ) : (
                                <div className={styles.ordersList}>
                                    {customerOrders.map(order => (
                                        <div key={order._id} className={styles.orderRow}>
                                            <div className={styles.orderInfo}>
                                                <span className={styles.orderNum}>{order.orderNumber}</span>
                                                <span className={styles.orderDate}>{new Date(order.placedAt).toLocaleDateString()}</span>
                                            </div>
                                            <div className={styles.orderMeta}>
                                                <span className={styles.orderAmt}>₹{order.totalAmount.toLocaleString()}</span>
                                                <div 
                                                    className={styles.statusDot} 
                                                    style={{ backgroundColor: statusColors[order.status] }}
                                                />
                                                <span className={styles.orderStatus}>{order.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CustomersPage;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { 
    Search, 
    Filter, 
    ShoppingBag, 
    Clock, 
    CheckCircle2, 
    Truck, 
    XCircle,
    Store as StoreIcon,
    ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './OrdersPage.module.css';

const statusColors = {
    'Pending': { color: '#f59e0b', bg: '#fffbeb', icon: <Clock size={14} /> },
    'Confirmed': { color: '#3b82f6', bg: '#eff6ff', icon: <CheckCircle2 size={14} /> },
    'Out for delivery': { color: '#8b5cf6', bg: '#f5f3ff', icon: <Truck size={14} /> },
    'Completed': { color: '#10b981', bg: '#ecfdf5', icon: <CheckCircle2 size={14} /> },
    'Cancelled': { color: '#ef4444', bg: '#fef2f2', icon: <XCircle size={14} /> }
};

const OrdersPage = () => {
    const { user: authUser } = useAuth();
    const [orders, setOrders] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Filters
    const [statusFilter, setStatusFilter] = useState('');
    const [storeFilter, setStoreFilter] = useState('');
    const [search, setSearch] = useState('');

    // Status Update state
    const [updatingId, setUpdatingId] = useState(null);

    useEffect(() => {
        fetchStores();
        fetchOrders();
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [statusFilter, storeFilter]);

    const fetchStores = async () => {
        try {
            const { data } = await api.get('/stores');
            setStores(data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const params = {};
            if (statusFilter) params.status = statusFilter;
            if (storeFilter) params.storeId = storeFilter;
            
            const { data } = await api.get('/orders', { params });
            
            // Client side search filtering (on order number or customer name)
            const filtered = data.filter(order => 
                order.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
                order.customer?.name.toLowerCase().includes(search.toLowerCase())
            );
            
            setOrders(filtered);
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            await api.patch(`/orders/${id}`, { status: newStatus });
            fetchOrders();
        } catch (error) {
            alert('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Order Management</h1>
                    <p>Process customer orders and track delivery statuses.</p>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by order # or customer..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyUp={(e) => e.key === 'Enter' && fetchOrders()}
                    />
                </div>
                {authUser?.role === 'Super Admin' && (
                    <div className={styles.filterWrapper}>
                        <Filter size={18} className={styles.filterIcon} />
                        <select value={storeFilter} onChange={(e) => setStoreFilter(e.target.value)}>
                            <option value="">All Stores</option>
                            {(stores || []).map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
                        </select>
                    </div>
                )}
                <div className={styles.filterWrapper}>
                    <Filter size={18} className={styles.filterIcon} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="">All Statuses</option>
                        {Object.keys(statusColors).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.loader}>Loading orders...</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Order Details</th>
                                <th>Store</th>
                                <th>Customer</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(orders || []).map((order) => (
                                <tr key={order._id}>
                                    <td>
                                        <div className={styles.orderCell}>
                                            <span className={styles.orderNumber}>{order.orderNumber}</span>
                                            <span className={styles.orderDate}>{new Date(order.placedAt).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.storeTag}>
                                            <StoreIcon size={14} />
                                            <span>{order.store?.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.customerInfo}>
                                            <span className={styles.customerName}>{order.customer?.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={styles.amount}>₹{order.totalAmount.toLocaleString()}</span>
                                    </td>
                                    <td>
                                        <div 
                                            className={styles.statusBadge} 
                                            style={{ 
                                                backgroundColor: statusColors[order.status].bg,
                                                color: statusColors[order.status].color
                                            }}
                                        >
                                            {statusColors[order.status].icon}
                                            <span>{order.status}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.actionMenu}>
                                            <select 
                                                className={styles.statusSelect}
                                                value={order.status}
                                                onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                                                disabled={updatingId === order._id}
                                            >
                                                {Object.keys(statusColors).map(s => (
                                                    <option key={s} value={s}>{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(orders || []).length === 0 && <div className={styles.empty}>No orders found.</div>}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;

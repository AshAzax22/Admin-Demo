import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { useAuth } from '../context/AuthContext';
import { 
    TrendingUp, 
    Users, 
    ShoppingCart, 
    Package, 
    ArrowUpRight, 
    ArrowDownRight,
    Search
} from 'lucide-react';
import { 
    AreaChart, 
    Area, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer 
} from 'recharts';
import styles from './Dashboard.module.css';

const StatCard = ({ title, value, icon, trend, trendValue, color }) => (
    <div className={styles.card}>
        <div className={styles.cardHeader}>
            <div className={styles.iconWrapper} style={{ backgroundColor: `${color}15`, color: color }}>
                {icon}
            </div>
            <div className={trend === 'up' ? styles.trendUp : styles.trendDown}>
                {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                <span>{trendValue}%</span>
            </div>
        </div>
        <div className={styles.cardBody}>
            <h3>{value}</h3>
            <p>{title}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [analyticsRes, ordersRes] = await Promise.all([
                api.get('/analytics/dashboard'),
                api.get('/orders?limit=5')
            ]);
            setStats(analyticsRes.data);
            setRecentOrders(ordersRes.data || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
            setError(error.response?.data?.message || 'Failed to load dashboard data. Please check your permissions.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loader}>Loading dashboard analytics...</div>;
    if (error) return (
        <div className={styles.errorContainer}>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button onClick={fetchDashboardData} className={styles.retryBtn}>Retry</button>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.welcome}>
                <h1>Welcome back, {user?.name.split(' ')[0]}!</h1>
                <p>Here's what's happening across your omnichannel stores today.</p>
            </div>

            <div className={styles.statsGrid}>
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${(stats?.overview?.totalRevenue || 0).toLocaleString()}`} 
                    icon={<TrendingUp size={24} />} 
                    trend="up" 
                    trendValue="12.5"
                    color="#10b981"
                />
                <StatCard 
                    title="Total Orders" 
                    value={stats?.overview?.totalOrders || 0} 
                    icon={<ShoppingCart size={24} />} 
                    trend="up" 
                    trendValue="8.2"
                    color="#3b82f6"
                />
                <StatCard 
                    title="Avg Order Value" 
                    value={`₹${Math.round(stats?.overview?.avgOrderValue || 0).toLocaleString()}`} 
                    icon={<Users size={24} />} 
                    trend="up" 
                    trendValue="4.3"
                    color="#8b5cf6"
                />
                <StatCard 
                    title="Store Count" 
                    value={stats?.storePerformance?.length || 0} 
                    icon={<Package size={24} />} 
                    trend="up" 
                    trendValue="0"
                    color="#f59e0b"
                />
            </div>

            <div className={styles.chartSection}>
                <div className={styles.sectionHeader}>
                    <h2>Revenue Trend</h2>
                </div>
                <div className={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={stats?.trend || []}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                            <XAxis 
                                dataKey="_id" 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 12, fill: '#64748b'}}
                                dy={10}
                            />
                            <YAxis 
                                axisLine={false} 
                                tickLine={false} 
                                tick={{fontSize: 12, fill: '#64748b'}}
                            />
                            <Tooltip 
                                contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
                            />
                            <Area 
                                type="monotone" 
                                dataKey="revenue" 
                                stroke="#0f172a" 
                                fillOpacity={1} 
                                fill="url(#colorRevenue)" 
                                strokeWidth={3}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className={styles.contentGrid}>
                <div className={styles.recentOrders}>
                    <div className={styles.sectionHeader}>
                        <h2>Recent Orders</h2>
                    </div>
                    <div className={styles.orderList}>
                        {recentOrders.length === 0 ? (
                            <p className={styles.empty}>No recent orders.</p>
                        ) : (
                            recentOrders.map(order => (
                                <div key={order._id} className={styles.orderRow}>
                                    <div className={styles.orderInfo}>
                                        <span className={styles.orderNum}>{order.orderNumber}</span>
                                        <span className={styles.orderCust}>{order.customer?.name}</span>
                                    </div>
                                    <div className={styles.orderMeta}>
                                        <span className={styles.orderAmt}>₹{order.totalAmount.toLocaleString()}</span>
                                        <span className={styles.orderStatus} data-status={order.status}>{order.status}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
                
                {user?.role === 'Super Admin' && (
                    <div className={styles.storePerformance}>
                        <div className={styles.sectionHeader}>
                            <h2>Top Stores</h2>
                        </div>
                        <div className={styles.storeList}>
                            {stats?.storePerformance.sort((a,b) => b.revenue - a.revenue).slice(0, 4).map(store => (
                                <div key={store._id} className={styles.storeRow}>
                                    <div className={styles.storeName}>{store.name}</div>
                                    <div className={styles.storeVal}>₹{store.revenue.toLocaleString()}</div>
                                </div>
                            ))}
                            {(!stats?.storePerformance || stats?.storePerformance.length === 0) && (
                                <p className={styles.empty}>No store data available.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;

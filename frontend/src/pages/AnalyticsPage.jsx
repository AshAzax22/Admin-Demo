import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip, 
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    Legend
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Download } from 'lucide-react';
import styles from './AnalyticsPage.module.css';

const COLORS = ['#0f172a', '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

const AnalyticsPage = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const { data } = await api.get('/analytics/dashboard');
            setStats(data);
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className={styles.loader}>Analyzing sales data...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Sales Analytics</h1>
                    <p>Deep dive into your omnichannel business performance.</p>
                </div>
                <button className={styles.exportBtn}>
                    <Download size={18} />
                    <span>Export Report</span>
                </button>
            </div>

            <div className={styles.chartGrid}>
                {/* Sales Trend Line Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <TrendingUp size={20} />
                        <h3>30-Day Sales Trend</h3>
                    </div>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={stats?.trend || []}>
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
                                    contentStyle={{ 
                                        borderRadius: '8px', 
                                        border: '1px solid #e2e8f0',
                                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                    }} 
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="revenue" 
                                    stroke="#0f172a" 
                                    strokeWidth={3} 
                                    dot={{ r: 4, fill: '#0f172a', strokeWidth: 2, stroke: '#fff' }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Store Performance Bar Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <BarChart3 size={20} />
                        <h3>Revenue by Store</h3>
                    </div>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={stats?.storePerformance || []}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                <XAxis 
                                    dataKey="name" 
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
                                    cursor={{fill: '#f1f5f9'}}
                                    contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }} 
                                />
                                <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                                    {(stats?.storePerformance || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order Distribution Pie Chart */}
                <div className={styles.chartCard}>
                    <div className={styles.cardHeader}>
                        <PieChartIcon size={20} />
                        <h3>Order Distribution</h3>
                    </div>
                    <div className={styles.chartBody}>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={stats?.storePerformance || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="orderCount"
                                >
                                    {(stats?.storePerformance || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36}/>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;

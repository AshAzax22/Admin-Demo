import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Tag, Calendar, Users, Trash2, CheckCircle, XCircle } from 'lucide-react';
import styles from './CouponsPage.module.css';

const CouponsPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        discountType: 'Percentage',
        discountValue: 0,
        minPurchase: 0,
        expiryDate: '',
        usageLimit: 100
    });

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await axios.get('/api/coupons');
            setCoupons(data);
        } catch (error) {
            console.error('Error fetching coupons:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/coupons', formData);
            setIsModalOpen(false);
            setFormData({
                code: '',
                discountType: 'Percentage',
                discountValue: 0,
                minPurchase: 0,
                expiryDate: '',
                usageLimit: 100
            });
            fetchCoupons();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to create coupon');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this coupon?')) return;
        try {
            await axios.delete(`/api/coupons/${id}`);
            fetchCoupons();
        } catch (error) {
            alert('Failed to delete coupon');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Coupons & Promotions</h1>
                    <p>Manage discount codes and marketing campaigns.</p>
                </div>
                <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    <span>Create Coupon</span>
                </button>
            </div>

            {loading ? (
                <div className={styles.loader}>Loading coupons...</div>
            ) : (
                <div className={styles.grid}>
                    {coupons.map((coupon) => (
                        <div key={coupon._id} className={styles.card}>
                            <div className={styles.cardHeader}>
                                <div className={styles.codeBadge}>
                                    <Tag size={16} />
                                    <span>{coupon.code}</span>
                                </div>
                                <div className={coupon.isActive ? styles.statusActive : styles.statusInactive}>
                                    {coupon.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                                    <span>{coupon.isActive ? 'Active' : 'Expired'}</span>
                                </div>
                            </div>
                            <div className={styles.cardBody}>
                                <div className={styles.discount}>
                                    {coupon.discountType === 'Percentage' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                </div>
                                <p>Min. Purchase: ₹{coupon.minPurchase}</p>
                            </div>
                            <div className={styles.cardFooter}>
                                <div className={styles.meta}>
                                    <Calendar size={14} />
                                    <span>Exp: {new Date(coupon.expiryDate).toLocaleDateString()}</span>
                                </div>
                                <div className={styles.meta}>
                                    <Users size={14} />
                                    <span>{coupon.usedCount} / {coupon.usageLimit} Used</span>
                                </div>
                                <button className={styles.deleteBtn} onClick={() => handleDelete(coupon._id)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {coupons.length === 0 && <div className={styles.empty}>No coupons found. Create your first campaign!</div>}
                </div>
            )}

            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>Create New Coupon</h2>
                        <form onSubmit={handleSubmit} className={styles.form}>
                            <div className={styles.formGroup}>
                                <label>Coupon Code</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={formData.code}
                                    onChange={(e) => setFormData({...formData, code: e.target.value.toUpperCase()})}
                                    placeholder="e.g. SUMMER50"
                                />
                            </div>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Type</label>
                                    <select 
                                        value={formData.discountType}
                                        onChange={(e) => setFormData({...formData, discountType: e.target.value})}
                                    >
                                        <option value="Percentage">Percentage</option>
                                        <option value="Flat">Flat Amount</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Value</label>
                                    <input 
                                        type="number" 
                                        required 
                                        value={formData.discountValue}
                                        onChange={(e) => setFormData({...formData, discountValue: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label>Min. Purchase (₹)</label>
                                    <input 
                                        type="number" 
                                        value={formData.minPurchase}
                                        onChange={(e) => setFormData({...formData, minPurchase: e.target.value})}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Usage Limit</label>
                                    <input 
                                        type="number" 
                                        value={formData.usageLimit}
                                        onChange={(e) => setFormData({...formData, usageLimit: e.target.value})}
                                    />
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Expiry Date</label>
                                <input 
                                    type="date" 
                                    required 
                                    value={formData.expiryDate}
                                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                                />
                            </div>
                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className={styles.submitBtn}>Create Coupon</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CouponsPage;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, MapPin, Phone, Edit2, Trash2, Store as StoreIcon } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import styles from './StoresPage.module.css';

const StoresPage = () => {
    const { user: authUser } = useAuth();
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Selection states
    const [editingStore, setEditingStore] = useState(null);
    const [storeToDelete, setProductToDelete] = useState(null);
    const [insightsStore, setInsightsStore] = useState(null);
    const [storeInsights, setStoreInsights] = useState(null);
    const [loadingInsights, setLoadingInsights] = useState(false);
    const [isInsightsModalOpen, setIsInsightsModalOpen] = useState(false);

    const [formData, setFormData] = useState({ name: '', location: '', contactNumber: '' });

    useEffect(() => {
        fetchStores();
    }, []);

    const fetchStores = async () => {
        try {
            const { data } = await api.get('/stores');
            setStores(data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', location: '', contactNumber: '' });
        setEditingStore(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsFormModalOpen(true);
    };

    const handleEdit = (store) => {
        setEditingStore(store);
        setFormData({
            name: store.name,
            location: store.location,
            contactNumber: store.contactNumber || ''
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingStore) {
                await api.put(`/stores/${editingStore._id}`, formData);
            } else {
                await api.post('/stores', formData);
            }
            setIsFormModalOpen(false);
            resetForm();
            fetchStores();
        } catch (error) {
            alert('Failed to save store');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!storeToDelete) return;
        try {
            await api.delete(`/stores/${storeToDelete._id}`);
            fetchStores();
        } catch (error) {
            alert('Failed to delete store');
        }
    };

    const handleViewInsights = async (store) => {
        setInsightsStore(store);
        setLoadingInsights(true);
        setIsInsightsModalOpen(true);
        try {
            const { data } = await api.get(`/stores/${store._id}/insights`);
            setStoreInsights(data);
        } catch (error) {
            console.error('Error fetching store insights:', error);
            alert('Failed to load insights');
        } finally {
            setLoadingInsights(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Stores</h1>
                    <p>Manage physical storefronts and staff locations.</p>
                </div>
                <button className={styles.addBtn} onClick={handleOpenAdd}>
                    <Plus size={20} />
                    <span>Add Store</span>
                </button>
            </div>

            {loading ? (
                <div className={styles.loader}>Loading stores...</div>
            ) : (
                <div className={styles.grid}>
                    {(stores || []).map((store) => (
                        <div key={store._id} className={styles.card} onClick={() => handleViewInsights(store)}>
                            <div className={styles.cardInfo}>
                                <div className={styles.storeIcon}>
                                    <StoreIcon size={24} />
                                </div>
                                <div className={styles.details}>
                                    <h3>{store.name}</h3>
                                    <div className={styles.meta}>
                                        <MapPin size={14} />
                                        <span>{store.location}</span>
                                    </div>
                                    <div className={styles.meta}>
                                        <Phone size={14} />
                                        <span>{store.contactNumber || 'No contact info'}</span>
                                    </div>
                                </div>
                            </div>
                            {authUser?.role === 'Super Admin' && (
                                <div className={styles.actions}>
                                    <button className={styles.editBtn} onClick={(e) => { e.stopPropagation(); handleEdit(store); }}>
                                        <Edit2 size={16} />
                                    </button>
                                    <button 
                                        className={styles.deleteBtn} 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setProductToDelete(store);
                                            setIsDeleteModalOpen(true);
                                        }}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {(stores || []).length === 0 && <div className={styles.empty}>No stores found.</div>}
                </div>
            )}

            {/* Store Insights Modal */}
            <Modal 
                isOpen={isInsightsModalOpen}
                onClose={() => setIsInsightsModalOpen(false)}
                title={`${insightsStore?.name} Insights`}
            >
                {loadingInsights ? (
                    <div className={styles.modalLoader}>Gathering performance data...</div>
                ) : storeInsights && (
                    <div className={styles.insightsContent}>
                        <div className={styles.statsRow}>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Revenue (Recent)</span>
                                <span className={styles.statValue}>₹{storeInsights.metrics.totalRevenue.toLocaleString()}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Avg Order</span>
                                <span className={styles.statValue}>₹{Math.round(storeInsights.metrics.avgOrderValue).toLocaleString()}</span>
                            </div>
                            <div className={styles.statBox}>
                                <span className={styles.statLabel}>Staff Count</span>
                                <span className={styles.statValue}>{storeInsights.staff.length}</span>
                            </div>
                        </div>

                        <div className={styles.insightSection}>
                            <h4>Assigned Staff</h4>
                            <div className={styles.staffList}>
                                {(storeInsights.staff || []).length === 0 ? (
                                    <p className={styles.emptySmall}>No staff assigned to this location.</p>
                                ) : (
                                    (storeInsights.staff || []).map(member => (
                                        <div key={member._id} className={styles.staffRow}>
                                            <div className={styles.memberInfo}>
                                                <span className={member.role === 'Store Manager' ? styles.manager : styles.staff}>
                                                    {member.name}
                                                </span>
                                                <span className={styles.roleLabel}>{member.role}</span>
                                            </div>
                                            <span className={styles.emailLabel}>{member.email}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className={styles.insightSection}>
                            <h4>Inventory Snapshot</h4>
                            <div className={styles.inventoryMeta}>
                                <div className={styles.invStat}>
                                    <strong>{storeInsights.inventory.totalStock}</strong> units in stock
                                </div>
                                <div className={styles.invStat}>
                                    <strong>{storeInsights.inventory.lowStockCount}</strong> items low on stock
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Store Form Modal */}
            <Modal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)}
                title={editingStore ? 'Edit Store' : 'Add New Store'}
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Store Name</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="e.g. Downtown Flagship"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Location / Address</label>
                        <input 
                            type="text" 
                            required 
                            value={formData.location}
                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                            placeholder="e.g. 123 Main St, New York"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Contact Number</label>
                        <input 
                            type="text" 
                            value={formData.contactNumber}
                            onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                            placeholder="e.g. +1 234-567-8900"
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={() => setIsFormModalOpen(false)}>Cancel</button>
                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? 'Saving...' : (editingStore ? 'Update Store' : 'Save Store')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Store"
                message={`Are you sure you want to delete "${storeToDelete?.name}"? This will affect all inventory linked to it.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default StoresPage;

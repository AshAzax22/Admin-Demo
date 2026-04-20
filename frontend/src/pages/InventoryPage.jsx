import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    Search, 
    Filter, 
    RefreshCcw, 
    AlertTriangle, 
    ArrowRightLeft, 
    History,
    Store as StoreIcon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './InventoryPage.module.css';

const InventoryPage = () => {
    const { user: authUser } = useAuth();
    const [inventory, setInventory] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStore, setSelectedStore] = useState('');
    const [search, setSearch] = useState('');
    
    // Modal state
    const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [adjustment, setAdjustment] = useState({ type: 'set', amount: 0 });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchStores();
        fetchInventory();
    }, []);

    useEffect(() => {
        fetchInventory();
    }, [selectedStore]);

    const fetchStores = async () => {
        try {
            const { data } = await axios.get('/api/stores');
            setStores(data);
        } catch (error) {
            console.error('Error fetching stores:', error);
        }
    };

    const fetchInventory = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedStore) params.storeId = selectedStore;
            const { data } = await axios.get('/api/inventory', { params });
            
            // Client side search filtering
            const filtered = data.filter(item => 
                item.product?.name.toLowerCase().includes(search.toLowerCase()) ||
                item.product?.sku.toLowerCase().includes(search.toLowerCase())
            );
            
            setInventory(filtered);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdjustClick = (item) => {
        setSelectedItem(item);
        setAdjustment({ type: 'set', amount: item.stock });
        setIsAdjustModalOpen(true);
    };

    const handleUpdateStock = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            if (adjustment.type === 'set') {
                await axios.post('/api/inventory', {
                    productId: selectedItem.product._id,
                    storeId: selectedItem.store._id,
                    stock: adjustment.amount
                });
            } else {
                await axios.post('/api/inventory/adjust', {
                    productId: selectedItem.product._id,
                    storeId: selectedItem.store._id,
                    delta: adjustment.type === 'add' ? adjustment.amount : -adjustment.amount
                });
            }
            setIsAdjustModalOpen(false);
            fetchInventory();
        } catch (error) {
            alert('Failed to update stock');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Inventory Tracking</h1>
                    <p>Real-time stock levels across all physical locations.</p>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search by product name or SKU..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                {authUser?.role === 'Super Admin' && (
                    <div className={styles.filterWrapper}>
                        <Filter size={18} className={styles.filterIcon} />
                        <select 
                            value={selectedStore}
                            onChange={(e) => setSelectedStore(e.target.value)}
                        >
                            <option value="">All Stores</option>
                            {stores.map(s => (
                                <option key={s._id} value={s._id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                )}
                <button className={styles.refreshBtn} onClick={fetchInventory}>
                    <RefreshCcw size={18} />
                </button>
            </div>

            <div className={styles.tableWrapper}>
                {loading ? (
                    <div className={styles.loader}>Loading inventory data...</div>
                ) : (
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Store</th>
                                <th>Stock Level</th>
                                <th>Last Updated</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventory.map((item) => (
                                <tr key={item._id}>
                                    <td>
                                        <div className={styles.prodCell}>
                                            <span className={styles.prodName}>{item.product?.name}</span>
                                        </div>
                                    </td>
                                    <td><code className={styles.sku}>{item.product?.sku}</code></td>
                                    <td>
                                        <div className={styles.storeTag}>
                                            <StoreIcon size={14} />
                                            <span>{item.store?.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.stockCell}>
                                            <span className={item.stock <= item.lowStockThreshold ? styles.lowStock : styles.normalStock}>
                                                {item.stock}
                                            </span>
                                            {item.stock <= item.lowStockThreshold && (
                                                <div className={styles.alert}>
                                                    <AlertTriangle size={14} />
                                                    <span>Low</span>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <div className={styles.dateCell}>
                                            <History size={14} />
                                            <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <button 
                                            className={styles.adjustBtn}
                                            onClick={() => handleAdjustClick(item)}
                                        >
                                            <ArrowRightLeft size={16} />
                                            <span>Adjust</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                {!loading && inventory.length === 0 && (
                    <div className={styles.empty}>No inventory records found for the current filters.</div>
                )}
            </div>

            {isAdjustModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <h2>Update Stock</h2>
                            <p>{selectedItem.product.name} @ {selectedItem.store.name}</p>
                        </div>
                        <form onSubmit={handleUpdateStock} className={styles.form}>
                            <div className={styles.adjustmentType}>
                                <button 
                                    type="button"
                                    className={adjustment.type === 'set' ? styles.activeType : ''}
                                    onClick={() => setAdjustment({...adjustment, type: 'set'})}
                                >
                                    Set Total
                                </button>
                                <button 
                                    type="button"
                                    className={adjustment.type === 'add' ? styles.activeType : ''}
                                    onClick={() => setAdjustment({...adjustment, type: 'add'})}
                                >
                                    Add Stock
                                </button>
                                <button 
                                    type="button"
                                    className={adjustment.type === 'remove' ? styles.activeType : ''}
                                    onClick={() => setAdjustment({...adjustment, type: 'remove'})}
                                >
                                    Remove Stock
                                </button>
                            </div>

                            <div className={styles.formGroup}>
                                <label>
                                    {adjustment.type === 'set' ? 'New Total Quantity' : 'Adjustment Amount'}
                                </label>
                                <input 
                                    type="number" 
                                    value={adjustment.amount}
                                    onChange={(e) => setAdjustment({...adjustment, amount: parseInt(e.target.value) || 0})}
                                    min="0"
                                />
                            </div>

                            <div className={styles.modalActions}>
                                <button type="button" onClick={() => setIsAdjustModalOpen(false)}>Cancel</button>
                                <button type="submit" className={styles.submitBtn} disabled={updating}>
                                    {updating ? 'Updating...' : 'Confirm Update'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryPage;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, Edit2, Trash2, Tag, Layers, IndianRupee, Image as ImageIcon } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import styles from './ProductsPage.module.css';

const ProductsPage = () => {
    const { user: authUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Selection states
    const [editingProduct, setEditingProduct] = useState(null);
    const [productToDelete, setProductToDelete] = useState(null);
    
    // Filters
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    // Form Data
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        price: '',
        category: '',
        description: '',
    });
    const [uploadedImages, setUploadedImages] = useState([]); // Now used for URL strings

    useEffect(() => {
        fetchInitialData();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [search, selectedCategory]);

    const fetchInitialData = async () => {
        try {
            const { data } = await axios.get('/api/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (selectedCategory) params.category = selectedCategory;
            const { data } = await axios.get('/api/products', { params });
            setProducts(data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', sku: '', price: '', category: '', description: '' });
        setUploadedImages([]);
        setEditingProduct(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsFormModalOpen(true);
    };

    const handleEdit = (product) => {
        setEditingProduct(product);
        setFormData({
            name: product.name,
            sku: product.sku,
            price: product.price,
            category: product.category?._id || product.category || '',
            description: product.description,
        });
        
        setUploadedImages(product.images || []);
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        
        try {
            const payload = {
                ...formData,
                images: uploadedImages
            };

            if (editingProduct) {
                await axios.put(`/api/products/${editingProduct._id}`, payload);
            } else {
                await axios.post('/api/products', payload);
            }

            setIsFormModalOpen(false);
            resetForm();
            fetchProducts();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save product');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!productToDelete) return;
        try {
            await axios.delete(`/api/products/${productToDelete._id}`);
            fetchProducts();
        } catch (error) {
            alert('Failed to delete product');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Products</h1>
                    <p>Manage your inventory and product listings.</p>
                </div>
                <button className={styles.addBtn} onClick={handleOpenAdd}>
                    <Plus size={20} />
                    <span>Add Product</span>
                </button>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchWrapper}>
                    <Search size={18} className={styles.searchIcon} />
                    <input 
                        type="text" 
                        placeholder="Search product name or SKU..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div className={styles.filterWrapper}>
                    <Filter size={18} className={styles.filterIcon} />
                    <select 
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c._id} value={c._id}>
                                {c.parent ? '— ' : ''}{c.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {loading ? (
                <div className={styles.loader}>Loading products...</div>
            ) : (
                <div className={styles.grid}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>SKU</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((prod) => (
                                <tr key={prod._id}>
                                    <td className={styles.productCell}>
                                        <div className={styles.prodImg}>
                                            {prod.images?.[0] ? (
                                                <img src={prod.images[0]} alt={prod.name} />
                                            ) : (
                                                <Tag size={20} color="#94a3b8" />
                                            )}
                                        </div>
                                        <div className={styles.prodInfo}>
                                            <span className={styles.prodName}>{prod.name}</span>
                                        </div>
                                    </td>
                                    <td><code className={styles.sku}>{prod.sku}</code></td>
                                    <td>
                                        <span className={styles.badge}>
                                            <Layers size={14} />
                                            {prod.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className={styles.price}>
                                            <IndianRupee size={14} />
                                            {prod.price.toLocaleString()}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={prod.isActive ? styles.statusActive : styles.statusInactive}>
                                            {prod.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className={styles.actions}>
                                        {authUser?.role === 'Super Admin' && (
                                            <>
                                                <button 
                                                    className={styles.iconBtn} 
                                                    onClick={() => handleEdit(prod)}
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button 
                                                    className={`${styles.iconBtn} ${styles.delete}`} 
                                                    onClick={() => {
                                                        setProductToDelete(prod);
                                                        setIsDeleteModalOpen(true);
                                                    }}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && <div className={styles.empty}>No products found.</div>}
                </div>
            )}

            {/* Product Form Modal (Add / Edit) */}
            <Modal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)}
                title={editingProduct ? 'Edit Product' : 'Add New Product'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Product Name</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Wireless Headphones"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>SKU</label>
                            <input 
                                type="text" 
                                required 
                                value={formData.sku}
                                onChange={(e) => setFormData({...formData, sku: e.target.value})}
                                placeholder="e.g. WH-1000XM4"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Price (₹)</label>
                            <input 
                                type="number" 
                                required 
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                placeholder="0.00"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Category</label>
                            <select 
                                required 
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.parent ? '— ' : ''}{c.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea 
                            required 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Describe your product highlights..."
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Product Images (URLs - One per line)</label>
                        <div className={styles.urlInputWrapper}>
                            <ImageIcon size={18} className={styles.urlIcon} />
                            <textarea 
                                value={uploadedImages.join('\n')}
                                onChange={(e) => setUploadedImages(e.target.value.split('\n').filter(url => url.trim() !== ''))}
                                placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg"
                                rows={3}
                            />
                        </div>
                        <p className={styles.helperText}>Enter direct links to images hosted on Cloudinary, Imgur, or your CDN.</p>
                    </div>

                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelBtn} onClick={() => setIsFormModalOpen(false)}>Cancel</button>
                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? 'Saving...' : (editingProduct ? 'Update Product' : 'Create Product')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Product"
                message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default ProductsPage;

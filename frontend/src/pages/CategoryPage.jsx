import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { Plus, Trash2, Edit2, AlertCircle } from 'lucide-react';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';
import { useAuth } from '../context/AuthContext';
import styles from './CategoryPage.module.css';

const CategoryPage = () => {
    const { user: authUser } = useAuth();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Modal states
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    
    // Selection states
    const [editingCategory, setEditingCategory] = useState(null);
    const [categoryToDelete, setCategoryToDelete] = useState(null);

    const [formData, setFormData] = useState({ name: '', parent: '', description: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({ name: '', parent: '', description: '' });
        setEditingCategory(null);
    };

    const handleOpenAdd = () => {
        resetForm();
        setIsFormModalOpen(true);
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            parent: category.parent?._id || category.parent || '',
            description: category.description || ''
        });
        setIsFormModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            if (editingCategory) {
                await api.put(`/categories/${editingCategory._id}`, formData);
            } else {
                await api.post('/categories', formData);
            }
            setIsFormModalOpen(false);
            resetForm();
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to save category');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!categoryToDelete) return;
        try {
            await api.delete(`/categories/${categoryToDelete._id}`);
            fetchCategories();
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to delete category');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Categories</h1>
                    <p>Manage product groupings and hierarchy.</p>
                </div>
                <button className={styles.addBtn} onClick={handleOpenAdd}>
                    <Plus size={20} />
                    <span>Add Category</span>
                </button>
            </div>

            {loading ? (
                <div className={styles.loader}>Loading categories...</div>
            ) : (
                <div className={styles.grid}>
                    {categories.length === 0 ? (
                        <div className={styles.empty}>
                            <AlertCircle size={48} />
                            <p>No categories found. Create your first one!</p>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Parent</th>
                                    <th>Products</th>
                                    <th>Slug</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(categories || []).map((cat) => (
                                    <tr key={cat._id}>
                                        <td className={styles.catName}>
                                            {cat.parent ? '— ' : ''}{cat.name}
                                        </td>
                                        <td>{cat.parent?.name || '-'}</td>
                                        <td>
                                            <span className={styles.productBadge}>
                                                {cat.productCount} Items
                                            </span>
                                        </td>
                                        <td><code className={styles.code}>{cat.slug}</code></td>
                                        <td className={styles.actions}>
                                            {authUser?.role === 'Super Admin' && (
                                                <>
                                                    <button 
                                                        className={styles.editBtn} 
                                                        onClick={() => handleEdit(cat)}
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button 
                                                        className={styles.deleteBtn} 
                                                        onClick={() => {
                                                            setCategoryToDelete(cat);
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
                    )}
                </div>
            )}

            {/* Category Form Modal */}
            <Modal 
                isOpen={isFormModalOpen} 
                onClose={() => setIsFormModalOpen(false)}
                title={editingCategory ? 'Edit Category' : 'Create Category'}
            >
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <label>Category Name</label>
                        <input 
                            type="text" 
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            required 
                            placeholder="e.g. Electronics"
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Parent Category (Optional)</label>
                        <select 
                            value={formData.parent}
                            onChange={(e) => setFormData({...formData, parent: e.target.value})}
                        >
                            <option value="">None (Top Level)</option>
                            {(categories || [])
                                .filter(c => c._id !== editingCategory?._id)
                                .map(c => (
                                    <option key={c._id} value={c._id}>
                                        {c.parent ? '— ' : ''}{c.name}
                                    </option>
                                ))
                            }
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Description</label>
                        <textarea 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            placeholder="Brief description..."
                        />
                    </div>
                    <div className={styles.modalActions}>
                        <button type="button" className={styles.cancelBtn} onClick={() => setIsFormModalOpen(false)}>Cancel</button>
                        <button type="submit" className={styles.submitBtn} disabled={submitting}>
                            {submitting ? 'Saving...' : (editingCategory ? 'Update Category' : 'Create Category')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation Modal */}
            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${categoryToDelete?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                type="danger"
            />
        </div>
    );
};

export default CategoryPage;

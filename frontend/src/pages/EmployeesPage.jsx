import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit2, Trash2, UserPlus, Mail, Shield, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './EmployeesPage.module.css';
import Modal from '../components/ui/Modal';
import ConfirmModal from '../components/ui/ConfirmModal';

const EmployeesPage = () => {
    const { user: authUser } = useAuth();
    const [employees, setEmployees] = useState([]);
    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'Staff',
        storeId: ''
    });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [empRes, storeRes] = await Promise.all([
                axios.get('/api/users'),
                axios.get('/api/stores')
            ]);
            setEmployees(empRes.data);
            setStores(storeRes.data);
        } catch (error) {
            console.error('Error fetching employees:', error);
            setError(error.response?.data?.message || 'Failed to load team data. Potentially unauthorized or session expired.');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (employee = null) => {
        if (employee) {
            setCurrentEmployee(employee);
            setFormData({
                name: employee.name,
                email: employee.email,
                password: '', // Don't show password
                role: employee.role,
                storeId: employee.storeId?._id || ''
            });
        } else {
            setCurrentEmployee(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                role: 'Staff',
                storeId: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (currentEmployee) {
                await api.put(`/users/${currentEmployee._id}`, formData);
            } else {
                await api.post('/users', formData);
            }
            fetchData();
            setIsModalOpen(false);
        } catch (error) {
            alert(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`/api/users/${employeeToDelete._id}`);
            fetchData();
            setIsDeleteModalOpen(false);
        } catch (error) {
            alert('Failed to delete employee');
        }
    };

    if (loading) return <div className={styles.loader}>Loading team analytics...</div>;

    if (error) return (
        <div className={styles.errorContainer}>
            <h2>Team Data Unavailable</h2>
            <p>{error}</p>
            <div className={styles.errorActions}>
                <button onClick={fetchData} className={styles.retryBtn}>Retry</button>
                <p className={styles.tip}>Tip: Try logging out and back in if you recently reset the data.</p>
            </div>
        </div>
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1>Team Management</h1>
                    <p>Manage your store staff and administrators.</p>
                </div>
                {authUser?.role === 'Super Admin' && (
                    <button className={styles.addBtn} onClick={() => handleOpenModal()}>
                        <UserPlus size={20} />
                        <span>Add Employee</span>
                    </button>
                )}
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Employee</th>
                            <th>Role</th>
                            <th>Assigned Store</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp._id}>
                                <td>
                                    <div className={styles.employeeInfo}>
                                        <span className={styles.employeeName}>{emp.name}</span>
                                        <span className={styles.employeeEmail}>{emp.email}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className={styles.roleBadge} data-role={emp.role}>
                                        {emp.role}
                                    </span>
                                </td>
                                <td>{emp.storeId?.name || 'N/A'}</td>
                                <td>
                                    <div className={styles.actions}>
                                        <button className={styles.actionBtn} onClick={() => handleOpenModal(emp)}>
                                            <Edit2 size={16} />
                                        </button>
                                        {authUser?.role === 'Super Admin' && (
                                            <button 
                                                className={`${styles.actionBtn} ${styles.deleteBtn}`}
                                                onClick={() => {
                                                    setEmployeeToDelete(emp);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                title={currentEmployee ? 'Edit Employee' : 'Add New Employee'}
            >
                <form onSubmit={handleSubmit}>
                    <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                            <label>Full Name</label>
                            <input 
                                type="text" 
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="John Doe"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input 
                                type="email" 
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                placeholder="john@example.com"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Password {currentEmployee && '(Leave blank to keep current)'}</label>
                            <input 
                                type="password" 
                                required={!currentEmployee}
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                placeholder="******"
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Role</label>
                            <select 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                            >
                                <option value="Staff">Staff</option>
                                <option value="Store Manager">Store Manager</option>
                                <option value="Super Admin">Super Admin</option>
                            </select>
                        </div>
                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Assign to Store</label>
                            <select 
                                value={formData.storeId}
                                onChange={(e) => setFormData({...formData, storeId: e.target.value})}
                                required={formData.role !== 'Super Admin'}
                            >
                                <option value="">Select a store</option>
                                {stores.map(store => (
                                    <option key={store._id} value={store._id}>
                                        {store.name} - {store.location}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className={styles.modalFooter}>
                        <button type="button" className={styles.cancelBtn} onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className={styles.submitBtn}>
                            {currentEmployee ? 'Update Employee' : 'Create Employee'}
                        </button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Employee"
                message={`Are you sure you want to remove ${employeeToDelete?.name}? This will revoke their access to the system.`}
                confirmText="Remove"
                type="danger"
            />
        </div>
    );
};

export default EmployeesPage;

import React, { useState, useEffect } from 'react';
import api from '../api/api';
import { User, Store, Bell, Shield, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import styles from './SettingsPage.module.css';

const SettingsPage = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        storeName: '',
        location: '',
        phone: '',
        bio: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                storeName: 'Omnichannel Flagship',
                location: 'Downtown Office',
                phone: '+1 555-0198',
                bio: 'Managing retail operations across NY and London hubs.'
            });
            setLoading(false);
        }
    }, [user]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await api.put('/users/profile', formData);
            alert('Settings saved successfully!');
        } catch (error) {
            alert('Failed to save settings.');
        }
    };

    if (loading) return <div className={styles.loader}>Loading settings...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1>Settings</h1>
                <p>Manage your account preferences and store configuration.</p>
            </div>

            <div className={styles.grid}>
                <div className={styles.sidebar}>
                    <button 
                        className={`${styles.navBtn} ${activeTab === 'profile' ? styles.active : ''}`}
                        onClick={() => setActiveTab('profile')}
                    >
                        <User size={20} />
                        <span>Profile Setting</span>
                    </button>
                    <button 
                        className={`${styles.navBtn} ${activeTab === 'store' ? styles.active : ''}`}
                        onClick={() => setActiveTab('store')}
                    >
                        <Store size={20} />
                        <span>Store Details</span>
                    </button>
                    <button 
                        className={`${styles.navBtn} ${activeTab === 'notifications' ? styles.active : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        <Bell size={20} />
                        <span>Notifications</span>
                    </button>
                    <button 
                        className={`${styles.navBtn} ${activeTab === 'security' ? styles.active : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        <Shield size={20} />
                        <span>Security</span>
                    </button>
                </div>

                <div className={styles.content}>
                    <form onSubmit={handleSave}>
                        {activeTab === 'profile' && (
                            <div className={styles.section}>
                                <div className={styles.profileHeader}>
                                    <div className={styles.avatar}>
                                        {user?.name?.charAt(0)}
                                    </div>
                                    <div className={styles.uploadInfo}>
                                        <h4>Your Avatar</h4>
                                        <p>JPG, GIF or PNG. Max size of 800K</p>
                                        <button type="button" className={styles.uploadBtn}>Upload Image</button>
                                    </div>
                                </div>

                                <h2>Personal Information</h2>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Full Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Email Address</label>
                                        <input 
                                            type="email" 
                                            value={formData.email}
                                            disabled
                                        />
                                    </div>
                                    <div className={`${styles.formGroup} ${styles.full}`}>
                                        <label>Bio / Signature</label>
                                        <textarea 
                                            value={formData.bio}
                                            onChange={(e) => setFormData({...formData, bio: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'store' && (
                            <div className={styles.section}>
                                <h2>Store Configuration</h2>
                                <div className={styles.formGrid}>
                                    <div className={styles.formGroup}>
                                        <label>Public Store Name</label>
                                        <input 
                                            type="text" 
                                            value={formData.storeName}
                                            onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Primary Location</label>
                                        <input 
                                            type="text" 
                                            value={formData.location}
                                            onChange={(e) => setFormData({...formData, location: e.target.value})}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label>Contact Phone</label>
                                        <input 
                                            type="text" 
                                            value={formData.phone}
                                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {(activeTab === 'notifications' || activeTab === 'security') && (
                            <div className={styles.section}>
                                <h2>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings</h2>
                                <p>This section is coming soon in the next update.</p>
                            </div>
                        )}

                        <div className={styles.footer}>
                            <button type="submit" className={styles.saveBtn}>
                                <Save size={18} style={{marginRight: '0.5rem'}} />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;

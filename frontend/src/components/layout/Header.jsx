import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, User, Menu } from 'lucide-react';
import styles from './Header.module.css';

const Header = ({ onToggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.left}>
                <button 
                    className={styles.menuBtn} 
                    onClick={onToggleSidebar}
                    aria-label="Toggle Sidebar"
                >
                    <Menu size={24} />
                </button>
                <div className={styles.info}>
                    <span className={styles.role}>{user?.role}</span>
                    {user?.storeId && <span className={styles.store}> • Store #{user.storeId}</span>}
                </div>
            </div>
            
            <div className={styles.actions}>
                <button className={styles.iconBtn} aria-label="Notifications">
                    <Bell size={20} />
                </button>
                <div className={styles.profile}>
                    <div className={styles.avatar}>
                        <User size={20} />
                    </div>
                    <span className={styles.userName}>{user?.name}</span>
                </div>
                <button 
                    className={styles.logoutBtn} 
                    onClick={logout}
                    aria-label="Logout"
                >
                    <LogOut size={20} />
                    <span className={styles.logoutTxt}>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;

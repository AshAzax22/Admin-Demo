import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Bell, User } from 'lucide-react';
import styles from './Header.module.css';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className={styles.header}>
            <div className={styles.info}>
                <span className={styles.role}>{user?.role}</span>
                {user?.storeId && <span className={styles.store}> • Store #{user.storeId}</span>}
            </div>
            <div className={styles.actions}>
                <button className={styles.iconBtn} aria-label="Notifications">
                    <Bell size={20} />
                </button>
                <div className={styles.profile}>
                    <User size={20} />
                    <span>{user?.name}</span>
                </div>
                <button 
                    className={styles.logoutBtn} 
                    onClick={logout}
                    aria-label="Logout"
                >
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </header>
    );
};

export default Header;

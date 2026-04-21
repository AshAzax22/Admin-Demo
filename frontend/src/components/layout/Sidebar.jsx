import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
    LayoutDashboard, 
    Package, 
    Warehouse, 
    ShoppingCart, 
    Users, 
    Tag, 
    BarChart3, 
    Settings,
    Store,
    MapPin,
    X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Sidebar.module.css';

const navItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/', roles: ['Super Admin', 'Store Manager'] },
    { name: 'Products', icon: <Package size={20} />, path: '/products', roles: ['Super Admin', 'Store Manager'] },
    { name: 'Categories', icon: <Tag size={20} />, path: '/categories', roles: ['Super Admin', 'Store Manager'] },
    { name: 'Stores', icon: <MapPin size={20} />, path: '/stores', roles: ['Super Admin'] },
    { name: 'Inventory', icon: <Warehouse size={20} />, path: '/inventory', roles: ['Super Admin', 'Store Manager'] },
    { name: 'Orders', icon: <ShoppingCart size={20} />, path: '/orders', roles: ['Super Admin', 'Store Manager'] },
    { name: 'Customers', icon: <Users size={20} />, path: '/customers', roles: ['Super Admin', 'Store Manager'] },
    { name: 'Employees', icon: <Users size={20} />, path: '/employees', roles: ['Super Admin', 'Store Manager'] },
    { name: 'Coupons', icon: <Tag size={20} />, path: '/coupons', roles: ['Super Admin'] },
    { name: 'Analytics', icon: <BarChart3 size={20} />, path: '/analytics', roles: ['Super Admin'] },
    { name: 'Settings', icon: <Settings size={20} />, path: '/settings', roles: ['Super Admin'] },
];

const Sidebar = ({ isOpen, onClose }) => {
    const { user } = useAuth();

    const filteredItems = navItems.filter(item => 
        !item.roles || item.roles.includes(user?.role)
    );

    return (
        <>
            <div 
                className={`${styles.backdrop} ${isOpen ? styles.backdropVisible : ''}`} 
                onClick={onClose}
            />
            <aside className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ''}`}>
                <div className={styles.header}>
                    <div className={styles.logo}>
                        <Store size={24} color="var(--primary)" />
                        <span>OmniRetail</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close Sidebar">
                        <X size={24} />
                    </button>
                </div>
                <nav className={styles.nav}>
                    {filteredItems.map((item) => (
                        <NavLink 
                            key={item.name} 
                            to={item.path}
                            className={({ isActive }) => 
                                isActive ? `${styles.navItem} ${styles.active}` : styles.navItem
                            }
                            onClick={onClose}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;

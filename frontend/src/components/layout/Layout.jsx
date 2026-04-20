import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './Layout.module.css';

const Layout = () => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.wrapper}>
                <Header />
                <main className={styles.main}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;

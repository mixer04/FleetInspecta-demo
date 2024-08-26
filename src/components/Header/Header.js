import React from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Header.module.css';

const Header = () => {
    const location = useLocation();
    const pageName = location.pathname === '/' ? <>Welcome!</> : location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(1).slice(1);

    return (
        <header className={styles.header}>
            <div className={styles.logo}>
                <h3>{pageName}</h3>
            </div>
            <div className={styles.rightSection}>
            </div>
        </header>
    );
};

export default Header;
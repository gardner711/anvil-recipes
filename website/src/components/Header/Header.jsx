import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <header className="header">
            <div className="header__container">
                <Link to="/" className="header__brand">
                    <div className="header__logo">AR</div>
                    <h1 className="header__title">Anvil Recipes</h1>
                </Link>
                <nav className="header__nav">
                    <Link
                        to="/"
                        className={`header__nav-item ${isActive('/') ? 'header__nav-item--active' : ''}`}
                    >
                        Home
                    </Link>
                    <Link
                        to="/characters"
                        className={`header__nav-item ${isActive('/characters') ? 'header__nav-item--active' : ''}`}
                    >
                        Characters
                    </Link>
                    <Link
                        to="/about"
                        className={`header__nav-item ${isActive('/about') ? 'header__nav-item--active' : ''}`}
                    >
                        About
                    </Link>
                </nav>
            </div>
        </header>
    );
};

export default Header;

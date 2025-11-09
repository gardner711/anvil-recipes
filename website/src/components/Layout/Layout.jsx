import React from 'react';
import Header from '../Header/Header';
import './Layout.css';

const Layout = ({ children, sidebar = null }) => {
    return (
        <div className="layout">
            <Header />
            <div className="layout__content">
                {sidebar ? (
                    <div className="layout__with-sidebar">
                        <aside className="layout__sidebar">{sidebar}</aside>
                        <main className="layout__main-content">{children}</main>
                    </div>
                ) : (
                    <main className="layout__main">{children}</main>
                )}
            </div>
        </div>
    );
};

export default Layout;

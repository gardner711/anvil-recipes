import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation = ({ items }) => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const renderIcon = (icon) => {
        return <span className="navigation__icon">{icon}</span>;
    };

    const renderItem = (item) => (
        <li key={item.id} className="navigation__item">
            <Link
                to={item.url}
                className={`navigation__link ${isActive(item.url) ? 'navigation__link--active' : ''}`}
            >
                {item.icon && renderIcon(item.icon)}
                <span>{item.label}</span>
                {item.badge && <span className="navigation__badge">{item.badge}</span>}
            </Link>
            {item.children && item.children.length > 0 && (
                <ul className="navigation__list navigation__nested">
                    {item.children.map(renderItem)}
                </ul>
            )}
        </li>
    );

    return (
        <nav className="navigation">
            {items.map((section) => (
                <div key={section.id} className="navigation__section">
                    {section.title && (
                        <h3 className="navigation__section-title">{section.title}</h3>
                    )}
                    <ul className="navigation__list">
                        {section.items.map(renderItem)}
                    </ul>
                </div>
            ))}
        </nav>
    );
};

export default Navigation;

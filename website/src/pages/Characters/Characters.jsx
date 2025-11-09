import React from 'react';
import Layout from '../../components/Layout/Layout';
import Navigation from '../../components/Navigation/Navigation';

const Characters = () => {
    const navigationItems = [
        {
            id: 'main',
            title: 'Characters',
            items: [
                { id: '1', label: 'All Characters', icon: '👥', url: '/characters' },
                { id: '2', label: 'Create New', icon: '➕', url: '/characters/new' },
                { id: '3', label: 'Templates', icon: '📋', url: '/characters/templates' }
            ]
        },
        {
            id: 'recent',
            title: 'Recent',
            items: [
                { id: '4', label: 'Aragorn', icon: '⚔️', url: '/characters/1', badge: '3' },
                { id: '5', label: 'Gandalf', icon: '🧙', url: '/characters/2' }
            ]
        }
    ];

    return (
        <Layout sidebar={<Navigation items={navigationItems} />}>
            <div style={{ padding: 'var(--spacing-lg)' }}>
                <h1 style={{ fontSize: '36px', marginBottom: 'var(--spacing-md)' }}>
                    Character Management
                </h1>
                <p style={{ fontSize: 'var(--font-size-large)', color: 'var(--color-text-secondary)', marginBottom: 'var(--spacing-xl)' }}>
                    Create and manage your player characters
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 'var(--spacing-lg)'
                }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                            backgroundColor: 'var(--color-bg-secondary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--border-radius-lg)',
                            padding: 'var(--spacing-lg)',
                            transition: 'transform var(--transition-normal)',
                            cursor: 'pointer'
                        }}>
                            <h3 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-sm)' }}>
                                Character {i}
                            </h3>
                            <p style={{ color: 'var(--color-text-secondary)' }}>
                                Level 5 Warrior • Last updated 2 days ago
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Characters;

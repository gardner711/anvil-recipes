import React from 'react';
import Layout from '../../components/Layout/Layout';

const About = () => {
    return (
        <Layout>
            <div style={{ padding: 'var(--spacing-xl)', maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{ fontSize: '48px', marginBottom: 'var(--spacing-lg)' }}>
                    About Anvil Recipes
                </h1>
                <div style={{ fontSize: 'var(--font-size-large)', lineHeight: '1.8', color: 'var(--color-text-secondary)' }}>
                    <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                        Anvil Recipes is a modern web application designed to help tabletop RPG players
                        create, manage, and track their player characters with ease.
                    </p>
                    <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                        Built with modern web technologies including React, Vite, and a clean,
                        GitHub-inspired interface, our platform provides an intuitive experience
                        for managing complex character data.
                    </p>
                    <h2 style={{ fontSize: '32px', marginTop: 'var(--spacing-xxl)', marginBottom: 'var(--spacing-md)', color: 'var(--color-text-primary)' }}>
                        Our Mission
                    </h2>
                    <p style={{ marginBottom: 'var(--spacing-lg)' }}>
                        We believe that character management should be straightforward, beautiful,
                        and accessible. Our goal is to create tools that enhance your tabletop
                        gaming experience without getting in the way of the fun.
                    </p>
                </div>
            </div>
        </Layout>
    );
};

export default About;

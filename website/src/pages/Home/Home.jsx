import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import './Home.css';

const Home = () => {
    const features = [
        {
            id: 1,
            icon: '⚔️',
            title: 'Character Management',
            description: 'Create and manage detailed player characters with comprehensive attributes, skills, and equipment tracking.'
        },
        {
            id: 2,
            icon: '📊',
            title: 'Real-time Updates',
            description: 'Track character progression in real-time with automatic calculations and live updates across all connected devices.'
        },
        {
            id: 3,
            icon: '🎨',
            title: 'Modern Interface',
            description: 'Enjoy a clean, intuitive interface inspired by modern design principles with dark theme support.'
        }
    ];

    return (
        <Layout>
            <div className="home">
                {/* Hero Section */}
                <section className="hero">
                    <div className="hero__content">
                        <h1 className="hero__headline">
                            Anvil Recipes
                        </h1>
                        <p className="hero__subheadline">
                            The modern platform for managing your tabletop RPG characters
                        </p>
                        <Link to="/characters" className="hero__cta">
                            Get Started
                            <span>→</span>
                        </Link>
                    </div>
                    <div className="hero__scroll-indicator">↓</div>
                </section>

                {/* Features Section */}
                <section className="features">
                    <div className="features__header">
                        <h2 className="features__title">Powerful Features</h2>
                        <p className="features__subtitle">
                            Everything you need to bring your characters to life
                        </p>
                    </div>
                    <div className="features__grid">
                        {features.map((feature) => (
                            <div key={feature.id} className="feature-card">
                                <div className="feature-card__icon">{feature.icon}</div>
                                <h3 className="feature-card__title">{feature.title}</h3>
                                <p className="feature-card__description">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA Section */}
                <section className="cta-section">
                    <h2 className="cta-section__headline">Ready to Begin Your Adventure?</h2>
                    <p className="cta-section__description">
                        Join thousands of players managing their characters with Anvil Recipes
                    </p>
                    <div className="cta-section__buttons">
                        <Link to="/characters" className="cta-section__button cta-section__button--primary">
                            Create Character
                        </Link>
                        <Link to="/about" className="cta-section__button cta-section__button--secondary">
                            Learn More
                        </Link>
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Home;

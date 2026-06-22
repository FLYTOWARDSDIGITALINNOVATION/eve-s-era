import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaShoppingBag, FaStar, FaShieldAlt, FaGem, FaArrowRight } from 'react-icons/fa';
import './LandingPage.css';
import logo from "../assets/logo1.png";
import hero1 from "../assets/hero1.jpg";

const LandingPage = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                duration: 0.8
            }
        }
    };

    const itemVariants = {
        hidden: { y: 30, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                ease: [0.22, 1, 0.36, 1],
                duration: 0.8
            }
        }
    };

    const handleSelectModel = (model) => {
        navigate(`/home?model=${model}`);
    };

    return (
        <div className="landing-container">
            {/* Background Soft Pink Decorations */}
            <div className="bg-gradient-circle circle-1"></div>
            <div className="bg-gradient-circle circle-2"></div>

            <nav className="landing-nav">
                <motion.div 
                    className="landing-logo"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    style={{ marginLeft: '-15px' }}
                >
                  <div style={{ height: '120px', width: '120px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                    <img src={logo} alt="Eve's Era Logo" style={{ maxHeight: '70%', maxWidth: '70%', objectFit: 'contain' }} />
                  </div>
                </motion.div>
                <div className="nav-actions">
                    <button className="nav-btn login-btn" onClick={() => navigate('/auth', { state: { isLogin: true } })}>Login</button>
                    <button className="nav-btn signup-btn" onClick={() => navigate('/auth', { state: { isLogin: false } })}>Get Started</button>
                </div>
            </nav>

            <main className="landing-hero">
                <motion.div 
                    className="hero-content"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="hero-badge">
                        ✨ Soft Feminine Luxury Boutique
                    </motion.div>
                    
                    <motion.h1 variants={itemVariants} className="hero-title">
                        Empowering Your <br />
                        <span className="text-gradient">Signature Style</span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="hero-description">
                        Step into curated elegance. Eve's Era brings you premium silhouettes, refined detailing,
                        and boutique styling made for the modern woman.
                    </motion.p>

                    <motion.div variants={itemVariants} className="hero-cta-splits">
                        <button 
                            className="cta-split manufactured-cta" 
                            onClick={() => handleSelectModel('manufactured')}
                        >
                            <span className="cta-icon"><FaGem /></span>
                            <div className="cta-label-group">
                                <strong>Eve's Era</strong>
                                <span>Premium Boutique Collection</span>
                            </div>
                            <FaArrowRight className="arrow-right-icon" />
                        </button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="hero-features">
                        <div className="feature-item">
                            <FaStar className="feature-icon" />
                            <span>In-House Tailoring</span>
                        </div>
                        <div className="feature-item">
                            <FaShieldAlt className="feature-icon" />
                            <span>Authenticity Assured</span>
                        </div>
                        <div className="feature-item">
                            <FaShoppingBag className="feature-icon" />
                            <span>Boutique Fashion</span>
                        </div>
                    </motion.div>
                </motion.div>

                <motion.div 
                    className="hero-image-container"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <div className="floating-card card-1">
                        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=150&q=80" alt="Eves Era curation" className="card-img" />
                        <div className="card-info-floating">
                            <div className="card-dot-pink"></div>
                            <p>Premium pieces: quality checked</p>
                        </div>
                    </div>
                    <div className="floating-card card-2">
                        <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=150&q=80" alt="Manufacturing process" className="card-img" />
                        <div className="card-info-floating">
                            <div className="card-dot-pink dark"></div>
                            <p>Eve's Era: Silk & Linen</p>
                        </div>
                    </div>
                    <div className="hero-main-visual">
                        <div className="hero-image-wrapper animate-fade-in-up delay-2">
                            <img src={hero1} alt="Eve's Era Fashion Model" className="hero-image-large" />
                        </div>
                    </div>
                </motion.div>
            </main>

            <footer className="landing-footer">
                <p>&copy; 2026 Eve's Era Boutique. All rights reserved. Handcrafted with love.</p>
            </footer>
        </div>
    );
};

export default LandingPage;

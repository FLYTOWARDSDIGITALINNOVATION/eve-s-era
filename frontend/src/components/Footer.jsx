import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaInstagram, FaPhoneAlt, 
    FaMapMarkerAlt, FaChevronUp,
    FaCcVisa, FaCcMastercard, FaCcApplePay, FaPaypal
} from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import logo from "../assets/logo1.png";
import './Footer.css';
import API_BASE_URL from '../api';

const Footer = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 400) {
                setShowBackToTop(true);
            } else {
                setShowBackToTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        fetch(`${API_BASE_URL}/categories`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCategories(data);
                }
            })
            .catch(err => console.error("Footer: Failed to fetch categories:", err));
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="vedan-footer">

            {/* Background Branding Watermark */}
            <div className="footer-watermark">EVE'S ERA</div>

            <div className="footer-container">
                <div className="footer-grid">
                    {/* Brand Section */}
                    <div className="footer-section brand-column">
                        <div className="footer-logo-group">
                          <div style={{ height: '80px', width: '80px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <img src={logo} alt="Eve's Era Logo" style={{ maxHeight: '70%', maxWidth: '70%', objectFit: 'contain' }} />
                          </div>
                        </div>
                        <p className="brand-mission">
                            Crafting timeless luxury and sustainable couture. Discover Eve's Era collections designed for the modern woman.
                        </p>

                        {/* Instagram Icon with ID next to it */}
                        <div className="brand-social-wrapper">
                            <a 
                                href="https://www.instagram.com/eves__era?igsh=MWY4OXg4a291aGJkcA==" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="instagram-handle-badge"
                                title="Instagram: eves__era"
                            >
                                <span className="social-icon instagram">
                                    <FaInstagram />
                                </span>
                                <span className="instagram-id-text">eves__era</span>
                            </a>
                        </div>
                    </div>

                    {/* Collections Section - Top 5 */}
                    <div className="footer-section links-column">
                        <h4 className="footer-heading">Collections</h4>
                        <ul className="footer-list">
                            {categories.slice(0, 5).map(cat => (
                                <li key={cat._id}>
                                    <Link to={`/category/${cat.name}`}>{cat.name}</Link>
                                </li>
                            ))}
                            <li><Link to="/home">All Collection</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links / Navigation Section */}
                    <div className="footer-section links-column">
                        <h4 className="footer-heading">Quick Links</h4>
                        <ul className="footer-list">
                            <li><Link to="/home">Home</Link></li>
                            <li><Link to="/orders">My Orders</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                            <li><Link to="/cart">Cart</Link></li>
                            <li><Link to="/profile">Profile</Link></li>
                        </ul>
                    </div>

                    {/* Support Section with Mobile Number */}
                    <div className="footer-section links-column support-column">
                        <h4 className="footer-heading">Support</h4>
                        <ul className="footer-list">
                            <li><Link to="/customer-service">Contact Us</Link></li>
                            <li><Link to="/customer-service">Help & FAQs</Link></li>
                        </ul>
                        <div className="footer-contact-info">
                            <span className="contact-subtitle">Customer Care</span>
                            <a href="tel:+916374226455" className="contact-tile">
                                <FaPhoneAlt />
                                <span>+91 63742 26455</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <div className="footer-legal">
                        <p>&copy; {new Date().getFullYear()} Eve's Era. All rights reserved.</p>
                        <div className="legal-links">
                            <Link to="/privacy">Privacy</Link>
                            <Link to="/terms">Terms</Link>
                            <Link to="/cookies">Cookies</Link>
                        </div>
                    </div>
                    
                    <div className="payment-methods">
                        <FaCcVisa title="Visa" />
                        <FaCcMastercard title="Mastercard" />
                        <SiGooglepay title="Google Pay" />
                        <FaCcApplePay title="Apple Pay" />
                        <FaPaypal title="PayPal" />
                    </div>
                </div>

                {/* Footer Last - Address */}
                <div className="footer-address">
                    <FaMapMarkerAlt />
                    <span>205 c Gnanagiri road, Near Anso Sports Academy, Sivakasi - 626123</span>
                </div>
            </div>

            {/* Back to Top Button */}
            <button 
                className={`back-to-top ${showBackToTop ? 'visible' : ''}`} 
                onClick={scrollToTop}
                aria-label="Back to top"
            >
                <FaChevronUp />
            </button>
        </footer>
    );
};

export default Footer;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    FaInstagram, FaEnvelope, FaPhoneAlt, 
    FaMapMarkerAlt, FaPaperPlane, FaFacebookF, 
    FaTwitter, FaYoutube, FaChevronUp,
    FaTruck, FaShieldAlt, FaSyncAlt, FaAward,
    FaCcVisa, FaCcMastercard, FaCcApplePay, FaPaypal
} from 'react-icons/fa';
import { SiGooglepay } from 'react-icons/si';
import logo from "../assets/eve's era.jpeg";
import './Footer.css';

const Footer = () => {
    const [showBackToTop, setShowBackToTop] = useState(false);

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
                          <div style={{ height: '120px', width: '120px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
                            <img src={logo} alt="Eve's Era Logo" style={{ maxHeight: '70%', maxWidth: '70%', objectFit: 'contain' }} />
                          </div>
                        </div>
                        <p className="brand-mission">
                            Crafting timeless luxury and sustainable couture. Discover Eve's Era collections designed for the modern woman.
                        </p>
                        <div className="social-links-grid">
                            <a href="#" className="social-icon instagram">
                                <FaInstagram />
                            </a>
                            <a href="#" className="social-icon facebook"><FaFacebookF /></a>
                            <a href="#" className="social-icon twitter"><FaTwitter /></a>
                            <a href="#" className="social-icon youtube"><FaYoutube /></a>
                        </div>
                    </div>

                    {/* Shop Section */}
                    <div className="footer-section links-column">
                        <h4 className="footer-heading">Collections</h4>
                        <ul className="footer-list">
                            <li><Link to="/home?model=manufactured">Eves Era</Link></li>
                            <li><Link to="/category/Women">Women's Wear</Link></li>
                            <li><Link to="/category/Accessories">Accessories</Link></li>
                            <li><Link to="/home">All New Arrivals</Link></li>
                        </ul>
                    </div>

                    {/* Support Section */}
                    <div className="footer-section links-column">
                        <h4 className="footer-heading">Support</h4>
                        <ul className="footer-list">
                            <li><Link to="/orders">My Orders</Link></li>
                            <li><Link to="/wishlist">Wishlist</Link></li>
                            <li><Link to="/profile">Account Settings</Link></li>
                            <li><Link to="/customer-service">Contact Us</Link></li>
                            <li><Link to="/customer-service">Returns & Privacy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter Section */}
                    <div className="footer-section newsletter-column">
                        <h4 className="footer-heading">Join the Circle</h4>
                        <p className="newsletter-text">Subscribe for exclusive drops and early access.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-field-group">
                                <input type="email" placeholder="Email Address" required />
                                <button type="submit" className="subscribe-btn">
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </form>
                        <div className="footer-contact-info">
                            <a href="tel:+918248518238" className="contact-tile">
                                <FaPhoneAlt />
                                <span>+91 82485 18238</span>
                            </a>
                            <a href="mailto:support@evesera.com" className="contact-tile">
                                <FaEnvelope />
                                <span>support@evesera.com</span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-bottom">
                    <div className="footer-legal">
                        <p>&copy; {new Date().getFullYear()} Eve's Era. All rights reserved.</p>
                        <div className="legal-links">
                            <Link to="/customer-service">Privacy</Link>
                            <Link to="/customer-service">Terms</Link>
                            <Link to="/customer-service">Cookies</Link>
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

                <div className="footer-address">
                    <FaMapMarkerAlt />
                    <span>Eve's Era Atelier, Premium Fashion Block, Tirupur 641 603</span>
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


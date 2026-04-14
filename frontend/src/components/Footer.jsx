import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaInstagram, FaEnvelope, FaPhoneAlt, 
    FaMapMarkerAlt, FaPaperPlane, FaFacebookF, 
    FaTwitter, FaYoutube 
} from 'react-icons/fa';
import logo from '../assets/logo.png';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="vedan-footer">
            {/* Background Branding Watermark */}
            <div className="footer-watermark">VEDAN</div>

            <div className="footer-container">
                <div className="footer-grid">
                    {/* 1. Brand Section */}
                    <div className="footer-section brand-column">
                        <div className="footer-logo-group">
                            <img src={logo} alt="VEDAN Logo" className="footer-logo-main" />
                            <span className="footer-brand-title">VEDAN</span>
                        </div>
                        <p className="brand-mission">
                            Crafting premium comfort with a focus on timeless style and local Tirupur heritage. 
                            Elevate your everyday essentials with VEDAN.
                        </p>
                        <div className="social-links-grid">
                            <a href="https://instagram.com/vedan_clothing_" target="_blank" rel="noopener noreferrer" className="social-icon">
                                <FaInstagram />
                            </a>
                            <a href="#" className="social-icon"><FaFacebookF /></a>
                            <a href="#" className="social-icon"><FaTwitter /></a>
                            <a href="#" className="social-icon"><FaYoutube /></a>
                        </div>
                    </div>

                    {/* 2. Shop Section */}
                    <div className="footer-section links-column">
                        <h4 className="footer-heading">Collections</h4>
                        <ul className="footer-list">
                            <li><Link to="/category/Round Neck">Round Neck T-shirts</Link></li>
                            <li><Link to="/category/Oversized">Oversized T-shirts</Link></li>
                            <li><Link to="/category/Polo">Polo T-shirts</Link></li>
                            <li><Link to="/home">New Arrivals</Link></li>
                            <li><Link to="/home">Best Sellers</Link></li>
                        </ul>
                    </div>

                    {/* 3. Help Section */}
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

                    {/* 4. Newsletter Section */}
                    <div className="footer-section newsletter-column">
                        <h4 className="footer-heading">Stay Connected</h4>
                        <p className="newsletter-text">Join the VEDAN inner circle for exclusive drops and offers.</p>
                        <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
                            <div className="input-field-group">
                                <input type="email" placeholder="Your email address" required />
                                <button type="submit" className="subscribe-btn">
                                    <FaPaperPlane />
                                </button>
                            </div>
                        </form>
                        <div className="footer-contact-info">
                            <div className="contact-tile">
                                <FaPhoneAlt />
                                <span>+91 8248 51 8238</span>
                            </div>
                            <div className="contact-tile">
                                <FaEnvelope />
                                <span>kganesh420kumar@gmail.com</span>
                            </div>
                            <div className="contact-tile">
                                <FaInstagram />
                                <span>@vedan_clothing_</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-divider"></div>

                <div className="footer-extra-details">
                    <div className="footer-address-block">
                        <FaMapMarkerAlt />
                        <span>Cotton mill road, Pappa nagar, Near Balamurugan mess, Tirupur 641 603</span>
                    </div>
                    <div className="footer-copyright-area">
                        <p>&copy; {new Date().getFullYear()} VEDAN Clothing. Crafted in Tirupur.</p>
                        <div className="legal-bits">
                            <Link to="/customer-service">Privacy</Link>
                            <Link to="/customer-service">Terms</Link>
                            <Link to="/customer-service">Cookies</Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

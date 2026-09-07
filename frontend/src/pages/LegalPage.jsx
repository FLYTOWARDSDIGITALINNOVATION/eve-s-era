import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
    FaShieldAlt, FaFileContract, FaCookieBite, 
    FaArrowLeft, FaPhoneAlt, FaMapMarkerAlt, 
    FaLock, FaCheckCircle, FaRegClock
} from 'react-icons/fa';
import './LegalPage.css';

const LegalPage = ({ defaultTab = 'privacy' }) => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState(defaultTab);

    useEffect(() => {
        if (location.pathname.includes('terms')) {
            setActiveTab('terms');
        } else if (location.pathname.includes('cookies')) {
            setActiveTab('cookies');
        } else if (location.pathname.includes('privacy')) {
            setActiveTab('privacy');
        } else {
            setActiveTab(defaultTab);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname, defaultTab]);

    return (
        <div className="legal-page-wrapper">
            <Header />

            <div className="legal-banner">
                <div className="container legal-banner-content">
                    <span className="legal-badge">✨ Eve's Era Boutique</span>
                    <h1 className="legal-title">
                        Policies & <span className="highlight-text">Guidelines</span>
                    </h1>
                    <p className="legal-subtitle">
                        Transparency, security, and exceptional boutique service for every modern woman.
                    </p>
                    <div className="legal-last-updated">
                        <FaRegClock /> Last updated: March 2026
                    </div>
                </div>
            </div>

            <main className="legal-main container">
                <div className="legal-navigation-bar">
                    <Link to="/home" className="legal-back-btn">
                        <FaArrowLeft /> Back to Shop
                    </Link>

                    {/* Tab Switcher */}
                    <div className="legal-tabs">
                        <button 
                            className={`legal-tab-btn ${activeTab === 'privacy' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('privacy'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >
                            <FaShieldAlt /> Privacy Policy
                        </button>
                        <button 
                            className={`legal-tab-btn ${activeTab === 'terms' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('terms'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >
                            <FaFileContract /> Terms of Service
                        </button>
                        <button 
                            className={`legal-tab-btn ${activeTab === 'cookies' ? 'active' : ''}`}
                            onClick={() => { setActiveTab('cookies'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                        >
                            <FaCookieBite /> Cookie Policy
                        </button>
                    </div>
                </div>

                {/* TAB CONTENT: PRIVACY POLICY */}
                {activeTab === 'privacy' && (
                    <div className="policy-content-card">
                        <div className="policy-header">
                            <div className="policy-icon-wrapper">
                                <FaShieldAlt />
                            </div>
                            <div>
                                <h2 className="policy-section-title">Privacy Policy</h2>
                                <p className="policy-lead">
                                    Your privacy is deeply valued at Eve's Era. This policy explains what personal data we collect, how it is safeguarded, and your choices as our customer.
                                </p>
                            </div>
                        </div>

                        <div className="policy-body">
                            <section className="policy-block">
                                <h3>1. Information We Collect</h3>
                                <p>To provide an effortless luxury shopping experience, we collect information when you browse our collections, create an account, or complete a purchase:</p>
                                <ul className="policy-checklist">
                                    <li><strong>Personal Information:</strong> Full name, email address, contact telephone/WhatsApp number.</li>
                                    <li><strong>Delivery Details:</strong> Shipping address, pin code, and landmark instructions in Sivakasi and across India.</li>
                                    <li><strong>Payment Information:</strong> Transaction status and tokens handled through RBI-regulated encrypted payment gateways. We never store credit/debit card numbers or CVV.</li>
                                    <li><strong>Order History & Favorites:</strong> Items added to your bag, wishlist favorites, and past couture orders.</li>
                                </ul>
                            </section>

                            <section className="policy-block">
                                <h3>2. How We Use Your Data</h3>
                                <p>We only use your information for legitimate boutique operations and customer satisfaction:</p>
                                <ul className="policy-checklist">
                                    <li>To process and package your clothing orders with couture care.</li>
                                    <li>To dispatch shipments and provide real-time tracking updates via SMS, WhatsApp, and email.</li>
                                    <li>To offer personalized customer care, sizing assistance, and order inquiries.</li>
                                    <li>To detect and prevent fraudulent activities or unauthorized transactions.</li>
                                </ul>
                            </section>

                            <section className="policy-block">
                                <h3>3. Zero Third-Party Selling</h3>
                                <p>
                                    At Eve's Era, we treat your information with utmost confidentiality. <strong>We do not sell, rent, or trade your personal data</strong> to external marketing brokers or third-party advertisers under any circumstances.
                                </p>
                            </section>

                            <section className="policy-block">
                                <h3>4. Data Protection & SSL Security</h3>
                                <div className="security-highlight-box">
                                    <FaLock className="lock-icon" />
                                    <div>
                                        <h4>Industry-Standard SSL Encryption</h4>
                                        <p>All sensitive communications between your browser and our servers are encrypted using 256-bit Secure Socket Layer (SSL) protocols to protect against unauthorized interception.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="policy-block">
                                <h3>5. Your Rights & Control</h3>
                                <p>You have full authority over your data. You may at any time:</p>
                                <ul className="policy-checklist">
                                    <li>Review or edit your profile information in your <Link to="/profile">Account Settings</Link>.</li>
                                    <li>Request complete deletion of your account records by contacting customer support.</li>
                                    <li>Opt out of promotional communications at any moment.</li>
                                </ul>
                            </section>
                        </div>
                    </div>
                )}

                {/* TAB CONTENT: TERMS OF SERVICE */}
                {activeTab === 'terms' && (
                    <div className="policy-content-card">
                        <div className="policy-header">
                            <div className="policy-icon-wrapper">
                                <FaFileContract />
                            </div>
                            <div>
                                <h2 className="policy-section-title">Terms of Service</h2>
                                <p className="policy-lead">
                                    Please read these Terms and Conditions carefully before ordering from Eve's Era. By accessing or shopping on our website, you agree to be bound by these terms.
                                </p>
                            </div>
                        </div>

                        <div className="policy-body">
                            <section className="policy-block">
                                <h3>1. Boutique Eligibility & Account Responsibility</h3>
                                <p>
                                    By using our boutique, you confirm that you are at least 18 years of age or accessing under parental guidance. You are responsible for maintaining the confidentiality of your login credentials.
                                </p>
                            </section>

                            <section className="policy-block">
                                <h3>2. Product Descriptions & Pricing</h3>
                                <ul className="policy-checklist">
                                    <li>All prices are stated in Indian Rupees (INR ₹) and are inclusive of standard taxes.</li>
                                    <li>We present fabric weaves, embroidery, and dress fits with high fidelity. Slight color variations may occur due to individual screen settings or studio lighting.</li>
                                    <li>We reserve the right to correct any typographical pricing errors or adjust availability. In the rare event of an out-of-stock item after payment, an instant full refund is processed.</li>
                                </ul>
                            </section>

                            <section className="policy-block">
                                <h3>3. Payment & Order Confirmation</h3>
                                <p>
                                    We accept all major payment modes including UPI, Google Pay, PhonePe, Debit/Credit Cards, and Net Banking. An order is confirmed once payment authorization is received.
                                </p>
                            </section>

                            <section className="policy-block">
                                <h3>4. Shipping, Dispatch & Delivery</h3>
                                <ul className="policy-checklist">
                                    <li>Orders are prepared and dispatched from our Sivakasi boutique within 24–48 business hours.</li>
                                    <li>Estimated domestic delivery spans between 2 to 5 business days depending on destination geography.</li>
                                    <li>Tracking details are automatically shared once your parcel is handed over to our courier partner.</li>
                                </ul>
                            </section>

                            <section className="policy-block">
                                <h3>5. Returns & Exchange Policy</h3>
                                <div className="terms-pill-box">
                                    <h4>7-Day Return / Exchange Window</h4>
                                    <p>
                                        If an item arrives damaged, defective, or with size discrepancy, you may request an exchange or return within <strong>7 days of delivery</strong> via our <Link to="/customer-service">Customer Support</Link> portal. Apparel must be unused, unwashed, and returned with original tags intact.
                                    </p>
                                </div>
                            </section>

                            <section className="policy-block">
                                <h3>6. Intellectual Property</h3>
                                <p>
                                    All content, including logo designs, brand imagery, couture patterns, graphics, and text, is the exclusive proprietary property of Eve's Era. Any unauthorized commercial copying is strictly prohibited.
                                </p>
                            </section>

                            <section className="policy-block">
                                <h3>7. Jurisdiction</h3>
                                <p>
                                    These Terms shall be governed by and interpreted under the laws of India. Any legal disputes are subject exclusively to the competent courts of Virudhunagar / Sivakasi, Tamil Nadu.
                                </p>
                            </section>
                        </div>
                    </div>
                )}

                {/* TAB CONTENT: COOKIE POLICY */}
                {activeTab === 'cookies' && (
                    <div className="policy-content-card">
                        <div className="policy-header">
                            <div className="policy-icon-wrapper">
                                <FaCookieBite />
                            </div>
                            <div>
                                <h2 className="policy-section-title">Cookie Policy</h2>
                                <p className="policy-lead">
                                    Discover how Eve's Era utilizes cookies to deliver a responsive, personalized, and delightful shopping journey.
                                </p>
                            </div>
                        </div>

                        <div className="policy-body">
                            <section className="policy-block">
                                <h3>1. What Are Cookies?</h3>
                                <p>
                                    Cookies are small text files stored securely on your browser or device when you visit websites. They help the platform remember your actions, preferences, and session state so you don't need to re-enter details repeatedly.
                                </p>
                            </section>

                            <section className="policy-block">
                                <h3>2. Categories of Cookies We Use</h3>
                                <div className="cookie-types-grid">
                                    <div className="cookie-type-card">
                                        <div className="cookie-type-header">
                                            <FaCheckCircle className="check-icon" />
                                            <h4>Essential Cookies</h4>
                                        </div>
                                        <p>Mandatory for website functionality. They keep items in your shopping bag, secure checkout steps, and maintain user login authentication.</p>
                                    </div>

                                    <div className="cookie-type-card">
                                        <div className="cookie-type-header">
                                            <FaCheckCircle className="check-icon" />
                                            <h4>Preference Cookies</h4>
                                        </div>
                                        <p>Remember your selections like wishlist garments, filter choices, and display styles to provide tailored recommendations.</p>
                                    </div>

                                    <div className="cookie-type-card">
                                        <div className="cookie-type-header">
                                            <FaCheckCircle className="check-icon" />
                                            <h4>Performance Cookies</h4>
                                        </div>
                                        <p>Help us evaluate page load speeds, popular collection visits, and user interface responsiveness to constantly refine the boutique.</p>
                                    </div>
                                </div>
                            </section>

                            <section className="policy-block">
                                <h3>3. Third-Party Payment Cookies</h3>
                                <p>
                                    When you process payments via Visa, Mastercard, Google Pay, Apple Pay, or PayPal, secure tokenized cookies may be used by the gateway solely to ensure fraud protection and PCI-DSS compliance.
                                </p>
                            </section>

                            <section className="policy-block">
                                <h3>4. Controlling Your Cookie Settings</h3>
                                <p>
                                    You can adjust or disable cookie permissions at any time through your browser preferences. Note that disabling essential cookies may prevent you from saving items to your bag or completing orders.
                                </p>
                            </section>
                        </div>
                    </div>
                )}

                {/* Common Contact Help Box */}
                <div className="legal-help-card">
                    <div className="help-card-left">
                        <h3>Need More Clarification?</h3>
                        <p>Our dedicated boutique concierge team in Sivakasi is available to assist you with any questions regarding our terms or your data.</p>
                        <div className="help-contact-items">
                            <div className="help-item">
                                <FaMapMarkerAlt />
                                <span>205 c Gnanagiri road, Near Anso Sports Academy, Sivakasi - 626123</span>
                            </div>
                            <div className="help-item">
                                <FaPhoneAlt />
                                <a href="tel:+916374226455">+91 63742 26455</a>
                            </div>
                        </div>
                    </div>
                    <div className="help-card-right">
                        <Link to="/customer-service" className="legal-contact-btn">
                            Chat with Support
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default LegalPage;

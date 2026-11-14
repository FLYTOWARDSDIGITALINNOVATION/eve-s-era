import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaBoxOpen,
  FaTimes,
  FaPhoneAlt
} from "react-icons/fa";
import "./Header.css";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/logo1.png";

const Header = ({ onSearch }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const { wishlist } = useWishlist();
  const { cart } = useCart();
  const [unreadSupportCount, setUnreadSupportCount] = useState(0);

  useEffect(() => {
    if (!user?.email) {
      setUnreadSupportCount(0);
      return;
    }

    const fetchUnreadCount = () => {
      fetch(`${API_BASE_URL}/support/user/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data)) {
            const count = data.filter((chat) => chat.unreadByUser).length;
            setUnreadSupportCount(count);
          }
        })
        .catch((err) => console.error("Error fetching support unread count:", err));
    };

    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);
    return () => clearInterval(interval);
  }, [user?.email]);

  return (
    <header className="sh-header">
      {/* Main Luxury Nav */}
      <div className="main-nav container">
        <Link to="/home" className="logo-brand" style={{ marginLeft: '-15px' }}>
          <div className="logo-mark" style={{ height: '100px', width: '100px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={logo} alt="Eve's Era Logo" style={{ maxHeight: '70%', maxWidth: '70%', objectFit: 'contain' }} />
          </div>
        </Link>

        <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`nav-content ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="nav-icons">

            <div className="header-search-control">
              <button
                type="button"
                className="header-search-icon"
                onClick={() => setIsSearchOpen((open) => !open)}
                aria-label="Toggle search"
                aria-expanded={isSearchOpen}
              >
                <FaSearch />
              </button>
              {isSearchOpen && (
                <div className="header-search-popover">
                  <div className="search-bar">
                    <input
                      type="text"
                      placeholder="Search our luxury collection..."
                      autoFocus
                      onChange={(e) => onSearch && onSearch(e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Orders — always visible */}
            <Link to={user ? "/orders" : "/auth"} state={!user ? { from: "/orders" } : undefined} className="icon-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaBoxOpen />
              <span className="mobile-label">Orders</span>
              <span className="icon-subtext">My Orders</span>
            </Link>

            {/* Wishlist — always visible */}
            <Link to="/wishlist" className="icon-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaHeart />
              {wishlist.length > 0 && (
                <span className="cart-badge">{wishlist.length}</span>
              )}
              <span className="mobile-label">Wishlist</span>
              <span className="icon-subtext">Wishlist</span>
            </Link>

            {/* Cart — always visible */}
            <Link to="/cart" className="icon-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaShoppingCart />
              {cart.length > 0 && (
                <span className="cart-badge">
                  {cart.reduce((sum, i) => sum + i.qty, 0)}
                </span>
              )}
              <span className="mobile-label">Cart</span>
              <span className="icon-subtext">Bag</span>
            </Link>

            {/* Support — mobile only */}
            <Link to="/customer-service" className="icon-link mobile-only-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaPhoneAlt />
              {unreadSupportCount > 0 && (
                <span className="cart-badge">{unreadSupportCount}</span>
              )}
              <span className="mobile-label">Support</span>
              <span className="icon-subtext">Contact Us</span>
            </Link>

            {/* Account — last in the icon row */}
            <Link to={user ? "/profile" : "/auth"} state={!user ? { from: "/profile" } : undefined} className="icon-link" onClick={() => setIsMobileMenuOpen(false)}>
              <FaUser />
              <span className="mobile-label">Profile</span>
              <span className="icon-subtext">Account</span>
            </Link>

            {/* Auth Buttons — Log In & Sign Up for new / existing users */}
            {!user && (
              <div className="header-auth-group">
                <Link 
                  to="/auth" 
                  state={{ isLogin: true }} 
                  className="auth-header-btn login-btn-subtle" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log In
                </Link>
                <Link 
                  to="/auth" 
                  state={{ isLogin: false }} 
                  className="auth-header-btn signup-btn-primary" 
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>
        </div>

      </div>

    </header>
  );
};

export default Header;

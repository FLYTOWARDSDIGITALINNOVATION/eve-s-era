import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaSearch,
  FaUser,
  FaHeart,
  FaShoppingCart,
  FaBars,
  FaSignOutAlt,
  FaBoxOpen,
  FaTimes,
  FaPercent,
  FaInfoCircle,
  FaPhoneAlt
} from "react-icons/fa";
import "./Header.css";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import logo from "../assets/eve's era.jpeg";

const Header = ({ onSearch, onModelFilter }) => {
  const [showCategories, setShowCategories] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const [categories, setCategories] = useState([]);
  const { wishlist } = useWishlist();
  const { cart } = useCart();

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleModelSelect = (model) => {
    if (onModelFilter) {
      onModelFilter(model);
    } else {
      navigate(`/home?model=${model}`);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sh-header">
      {/* Top Premium Ribbon */}
      <div className="top-banner">
        <div className="container banner-flex">
          <div className="delivery-loc">
            <span>✨ Welcome to Eve's Era | Soft Feminine Luxury Boutique</span>
          </div>
          <div className="top-links">
            <Link to="/customer-service"><FaPhoneAlt size={10} /> Contact Support</Link>
          </div>
        </div>
      </div>

      {/* Main Luxury Nav */}
      <div className="main-nav container">
        <Link to="/home" className="logo-brand" style={{ marginLeft: '-15px' }}>
          <div style={{ height: '100px', width: '100px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <img src={logo} alt="Eve's Era Logo" style={{ maxHeight: '70%', maxWidth: '70%', objectFit: 'contain' }} />
          </div>
        </Link>

        {/* Search Bar with Pink Theme */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search our luxury collection..."
            onChange={(e) => onSearch && onSearch(e.target.value)}
          />
          <button className="search-btn">
            <FaSearch />
          </button>
        </div>

        <div className="mobile-toggle" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>

        <div className={`nav-content ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="nav-icons">
            {user ? (
              <>
                <Link to="/profile" className="icon-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaUser />
                  <span className="mobile-label">Profile</span>
                  <span className="icon-subtext">Account</span>
                </Link>

                <Link to="/orders" className="icon-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaBoxOpen />
                  <span className="mobile-label">Orders</span>
                  <span className="icon-subtext">My Orders</span>
                </Link>

                <Link to="/wishlist" className="icon-link" onClick={() => setIsMobileMenuOpen(false)}>
                  <FaHeart />
                  {wishlist.length > 0 && (
                    <span className="cart-badge">{wishlist.length}</span>
                  )}
                  <span className="mobile-label">Wishlist</span>
                  <span className="icon-subtext">Wishlist</span>
                </Link>

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

                <button onClick={handleLogout} className="icon-link logout-btn-header">
                  <FaSignOutAlt />
                  <span className="mobile-label">Logout</span>
                  <span className="icon-subtext">Log out</span>
                </button>
              </>
            ) : (
              <Link to="/auth" className="login-nav-btn" onClick={() => setIsMobileMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Categories & Luxury Segment Bar */}
      <nav className="categories-bar">
        <div className="container categories-flex">
          <div className="luxury-segments">
            <Link to="/home" className={`segment-item ${!location.search ? 'active' : ''}`} onClick={() => handleModelSelect("all")}>
              All Collection
            </Link>
            <button 
              onClick={() => handleModelSelect("manufactured")} 
              className={`segment-item original-seg ${location.search.includes('model=manufactured') ? 'active' : ''}`}
            >
              ✨ Eve's Era
            </button>
          </div>

          <div className="cat-divider"></div>

          <div className="cat-links">
            {categories && categories.map((cat) => {
              const rawName = cat.name || "";
              const name = rawName.toLowerCase().trim();

              const getIcon = (catName) => {
                if (catName.includes("men")) return "👕";
                if (catName.includes("women")) return "👗";
                if (catName.includes("kid")) return "👶";
                if (catName.includes("shoe") || catName.includes("foot")) return "👟";
                if (catName.includes("watch")) return "⌚";
                if (catName.includes("sale")) return "🔥";
                if (catName.includes("bag") || catName.includes("access")) return "👜";
                return "👚";
              };

              return (
                <Link
                  key={cat._id}
                  to={`/category/${rawName}`}
                  className="cat-item"
                >
                  <span className="cat-emoji">{getIcon(name)}</span>
                  <span>{rawName}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;

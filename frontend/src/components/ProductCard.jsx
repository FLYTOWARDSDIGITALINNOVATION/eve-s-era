import API_BASE_URL from '../api';
import React, { useState } from "react";
import { FaHeart, FaEye, FaShoppingCart, FaStar, FaGem, FaLeaf } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [showAdded, setShowAdded] = useState(false);

  const pid = product._id || product.id;
  const isWishlisted = wishlist.some(p => (p._id || p.id) === pid);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    isWishlisted ? removeFromWishlist(pid) : addToWishlist(product);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
    
    if (isWishlisted) {
      removeFromWishlist(pid);
    }

    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
      if (location.pathname === "/wishlist") {
        navigate("/cart");
      }
    }, 1500);
  };

  const isManufactured = product.businessModel === "manufactured";

  return (
    <div className="card" onClick={() => navigate(`/product/${pid}`)}>
      <div className="image-box">
        {/* Model Badge */}
        <div className={`model-badge ${isManufactured ? "manufactured" : "resell"}`}>
          {isManufactured ? (
            <>
              <FaGem size={10} />
              <span>Original</span>
            </>
          ) : (
            <>
              <FaLeaf size={10} />
              <span>Resell</span>
            </>
          )}
        </div>

        <button className={`wishlist-btn ${isWishlisted ? "liked" : ""}`} onClick={toggleWishlist}>
          <FaHeart />
        </button>

        <img src={`${API_BASE_URL}${product.image}`} alt={product.name} onError={(e) => {
          e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=300&q=80";
        }} />

        {showAdded && <div className="added-toast">Added to bag 🛍️</div>}

        <div className="overlay-actions">
          <button className="quick-view-btn" onClick={() => navigate(`/product/${pid}`)}>
            <FaEye /> View Detail
          </button>
        </div>
      </div>

      <div className="card-info">
        <span className="product-category-lbl">{product.category || "Fashion"}</span>
        <h4 className="product-title-lbl">{product.name}</h4>
        
        <div className="rating-container">
          <div className="stars">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={12} color={i < Math.round(product.averageRating || 0) ? "#FFC107" : "#E2E8F0"} />
            ))}
          </div>
          <span className="rating-count">({product.ratingCount || 0})</span>
        </div>

        <div className="price-row">
          <span className="price-val">₹{product.price}</span>
          <button className="add-cart-mini" onClick={handleAddToCart} title="Add to Bag">
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

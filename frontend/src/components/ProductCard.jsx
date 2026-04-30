import API_BASE_URL from '../api';
import React, { useState } from "react";
import { FaHeart, FaEye, FaShoppingCart, FaStar } from "react-icons/fa";
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

  const isWishlisted = wishlist.some(p => p._id === product._id);

  const toggleWishlist = () => {
    isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product);
  };

  const handleAddToCart = () => {
    addToCart(product);
    
    // Automatically remove from wishlist if item is moved to cart
    if (isWishlisted) {
      removeFromWishlist(product._id);
    }

    setShowAdded(true);
    setTimeout(() => {
      setShowAdded(false);
      // Redirect if coming from wishlist page
      if (location.pathname === "/wishlist") {
        navigate("/cart");
      }
    }, 1500);
  };

  return (
    <div className="card">
      <div className="image-box">
        <button className={`wishlist-btn ${isWishlisted ? "liked" : ""}`} onClick={toggleWishlist}>
          <FaHeart />
        </button>

        <img src={`${API_BASE_URL}${product.image}`} alt={product.name} />

        {showAdded && <div className="added-toast">Product added to cart</div>}

        <div className="overlay-actions">
          <button className="quick-view-btn" onClick={() => navigate(`/product/${product._id}`)}>
            <FaEye /> Quick View
          </button>
        </div>
      </div>

      <div className="card-info">
        <h4>{product.name}</h4>
        <div className="rating-container" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '5px' }}>
          <div className="stars" style={{ color: '#fbbf24', display: 'flex' }}>
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} size={14} color={i < Math.round(product.averageRating || 0) ? "#fbbf24" : "#e5e7eb"} />
            ))}
          </div>
          <span style={{ fontSize: '0.8rem', color: '#666' }}>({product.ratingCount || 0})</span>
        </div>
        <p>₹{product.price}</p>
        <button className="add-cart-full" onClick={handleAddToCart}>
          <FaShoppingCart /> {isWishlisted && location.pathname === "/wishlist" ? "Move to Cart" : "Add to Cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;



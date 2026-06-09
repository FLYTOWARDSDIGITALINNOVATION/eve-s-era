import API_BASE_URL from '../api';
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaStar, FaShoppingCart, FaArrowLeft, FaGem, FaLeaf } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Review State
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [uploadImages, setUploadImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User info for reviews
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch product from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        } else {
          setSelectedSize("M");
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        } else {
          setSelectedColor("Pink");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`);
      const data = await res.json();
      if (Array.isArray(data)) setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
    }
  };

  const handleImageChange = (e) => {
    setUploadImages(Array.from(e.target.files));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to leave a review");
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("productId", id);
    formData.append("userEmail", user.email);
    formData.append("userName", user.name);
    formData.append("rating", userRating);
    formData.append("comment", newComment);
    uploadImages.forEach((image) => {
      formData.append("images", image);
    });

    try {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setNewComment("");
        setUserRating(5);
        setUploadImages([]);
        fetchReviews();
        fetch(`${API_BASE_URL}/products/${id}`)
          .then(res => res.json())
          .then(data => setProduct(data));
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        qty: quantity,
        size: selectedSize,
        color: selectedColor,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        ...product,
        qty: quantity,
        size: selectedSize,
        color: selectedColor,
      });
      navigate("/checkout");
    }
  };

  if (loading) {
    return (
      <div className="homepage">
        <Header />
        <div className="loading-state" style={{ padding: '120px 0' }}>
          <div className="spinner-pink"></div>
          <p>Revealing Eves Era design details...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="homepage">
        <Header />
        <div className="empty-state">
          <div className="empty-icon">🔍</div>
          <h3>Product is unavailable</h3>
          <p>The product you are looking for has sold out or is no longer listed.</p>
          <button className="reset-empty-btn" onClick={() => navigate("/home")}>Back to Shop</button>
        </div>
        <Footer />
      </div>
    );
  }

  const isManufactured = product.businessModel === "manufactured";
  const sizes = product.sizes && product.sizes.length > 0 ? product.sizes : ["S", "M", "L", "XL"];
  const colors = product.colors && product.colors.length > 0 ? product.colors : ["Pink", "Rose", "Dusty Mauve"];

  return (
    <div className="product-detail-page animate-fade-in">
      <Header />

      <div className="container detail-container">
        {/* Custom luxury pink return path button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft size={12} /> Return to collection
        </button>

        <div className="detail-grid">
          {/* Main Showcase Image */}
          <div className="product-image-section">
            <div className={`detail-model-tag ${isManufactured ? "manufactured" : "resell"}`}>
              {isManufactured ? <FaGem /> : <FaLeaf />}
              <span>Eves Era</span>
            </div>
            <img
              src={`${API_BASE_URL}${product.image}`}
              alt={product.name}
              className="main-detail-img"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>

          {/* Luxury Specifications Area */}
          <div className="product-info-section">
            <span className="detail-tag-category">{product.category || "Boutique"}</span>
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={16}
                    color={i < Math.round(product.averageRating || 0) ? "#FFC107" : "#E2E8F0"}
                  />
                ))}
              </div>
              <span className="reviews">
                ({product.ratingCount || 0} reviews)
              </span>
            </div>

            <div className="detail-price-box">
              <span className="price-lbl">₹{product.price}</span>
              {product.stock && product.stock <= 3 && (
                <span className="stock-warning">⚠️ Only {product.stock} items remaining!</span>
              )}
            </div>

            <p className="detail-description">
              {product.description || `Indulge in the pristine details of our luxury ${product.name.toLowerCase()}. Expertly selected to bring you the premium boutique feel that characterizes Eve's Era.`}
            </p>

            {/* Colors picker */}
            <div className="selection-group">
              <span className="sel-title">Select Color variant:</span>
              <div className="color-dots-list">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`color-dot-btn ${selectedColor === c ? "active" : ""}`}
                    onClick={() => setSelectedColor(c)}
                    style={{
                      background: c.toLowerCase().includes("pink") ? "#F8D7DA" : 
                                  c.toLowerCase().includes("rose") ? "#F4B6C2" : 
                                  c.toLowerCase().includes("mauve") ? "#C48B9F" : 
                                  c.toLowerCase().includes("charcoal") || c.toLowerCase().includes("gray") ? "#333333" : 
                                  c.toLowerCase().includes("white") ? "#FFFFFF" : "#E2E8F0"
                    }}
                    title={c}
                  />
                ))}
                <span className="selected-color-lbl">{selectedColor}</span>
              </div>
            </div>

            {/* Sizes picker */}
            <div className="selection-group">
              <span className="sel-title">Select Size:</span>
              <div className="size-options">
                {sizes.map((size) => (
                  <button
                    key={size}
                    className={`size-btn ${selectedSize === size ? "active" : ""}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="selection-group">
              <span className="sel-title">Quantity:</span>
              <div className="quantity-control">
                <button className="qty-adj-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="qty-val">{quantity}</span>
                <button className="qty-adj-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            {/* CTA action buttons */}
            <div className="action-buttons">
              <button className="add-to-cart-outline" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Bag
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>

          </div>
        </div>

        {/* Manufacturing details segment */}
        {isManufactured && (
          <div className="manufacturing-details-block animate-fade-in">
            <div className="mfg-icon-box">🎀</div>
            <div className="mfg-content">
              <h3>Original Atelier Manufacturing</h3>
              <p>This item is designed and tailored directly by <strong>Eve's Era</strong>. We utilize 100% organic cottons, pure Mulberry silks, and ethically harvested wool. By manufacturing in-house, we eliminate retail markup and guarantee beautiful, sustainable tailoring.</p>
              <div className="specs-list-mini">
                <div className="spec-pill">🧵 Material: {product.materials || "Mulberry Silk & Organic Cotton"}</div>
                <div className="spec-pill">📍 Atelier: Eves Era Boutique Studio</div>
                <div className="spec-pill">🌱 Ecology: 100% Carbon Offset Production</div>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="review-section">
          <h2>Customer Testimonials</h2>
          <div className="reviews-layout">
            {/* Review form */}
            <div className="review-form-card">
              <h3>Share Your Experience</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  <label>Select Rating:</label>
                  <div className="star-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        size={20}
                        className={star <= userRating ? "star-filled" : "star-empty"}
                        onClick={() => setUserRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="comment-input">
                  <label>Your Review:</label>
                  <textarea
                    placeholder="Describe size fit, material texture, and customer care..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="image-input">
                  <label>Photos (Up to 5):</label>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="file-input-pink" />
                  <div className="image-previews">
                    {uploadImages.map((img, i) => (
                      <img
                        key={i}
                        src={URL.createObjectURL(img)}
                        alt="preview"
                        className="preview-thumb"
                      />
                    ))}
                  </div>
                </div>

                <button type="submit" className="submit-review-btn" disabled={isSubmitting}>
                  {isSubmitting ? "Posting..." : "Submit Review"}
                </button>
              </form>
            </div>

            {/* Reviews display list */}
            <div className="reviews-list">
              {reviews.length === 0 ? (
                <div className="empty-reviews-state">
                  <span className="no-rev-emoji">💬</span>
                  <p>No reviews yet. Be the first to tell others about this luxury fit!</p>
                </div>
              ) : (
                reviews.map((rev, index) => (
                  <div key={index} className="review-item animate-fade-in">
                    <div className="review-header">
                      <div className="user-info">
                        <strong>{rev.userName}</strong>
                        <span className="review-date">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} size={12} className={i < rev.rating ? "star-filled" : "star-empty"} />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                    {rev.images && rev.images.length > 0 && (
                      <div className="review-images">
                        {rev.images.map((img, i) => (
                          <img
                            key={i}
                            src={`${API_BASE_URL}${img}`}
                            alt="review detail"
                            onClick={() => window.open(`${API_BASE_URL}${img}`, "_blank")}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetailPage;

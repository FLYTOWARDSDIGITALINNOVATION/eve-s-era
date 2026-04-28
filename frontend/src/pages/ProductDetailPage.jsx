import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaStar, FaShoppingCart, FaArrowLeft } from "react-icons/fa";
import { useCart } from "../context/CartContext";
import "./ProductDetailPage.css";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch product from API
  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product:", err);
        setLoading(false);
      });
  }, [id]);

  const [selectedSize, setSelectedSize] = useState("M");
  const [quantity, setQuantity] = useState(1);

  // Review State
  const [reviews, setReviews] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [uploadImages, setUploadImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // User info for reviews
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`http://localhost:5000/reviews/${id}`);
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
      const res = await fetch("http://localhost:5000/reviews", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setNewComment("");
        setUserRating(5);
        setUploadImages([]);
        fetchReviews();
        fetch(`http://localhost:5000/products/${id}`)
          .then(res => res.json())
          .then(data => setProduct(data));
      }
    } catch (err) {
      console.error("Failed to submit review:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        ...product,
        qty: quantity,
        size: selectedSize,
      });
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart({
        ...product,
        qty: quantity,
        size: selectedSize,
      });
      navigate("/checkout");
    }
  };

  if (loading) return <div className="container" style={{ marginTop: '100px' }}>Loading...</div>;
  if (!product) return <div className="container" style={{ marginTop: '100px' }}>Product not found</div>;

  return (
    <div className="product-detail-page">
      <Header />

      <div className="container detail-container">
        {/* Updated Modern Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft size={14} /> Back to Shop
        </button>

        <div className="detail-grid">
          <div className="product-image-section">
            <img
              src={`http://localhost:5000${product.image}` || "https://via.placeholder.com/600"}
              alt={product.name}
              className="main-detail-img"
            />
          </div>

          <div className="product-info-section">
            <span className="detail-tag">{product.tag || "New"}</span>
            <h1 className="detail-title">{product.name}</h1>

            <div className="detail-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < Math.round(product.averageRating || 0) ? "star-filled" : "star-empty"}
                  />
                ))}
              </div>
              <span className="reviews">
                ({product.ratingCount || 0} ratings)
              </span>
            </div>

            <div className="detail-price">
              <span className="price">₹{product.price}</span>
            </div>

            <p className="detail-description">
              {product.description || `Elevate your style with this premium quality ${product.name.toLowerCase()}.`}
            </p>

            <div className="selection-group">
              <h4>Select Size</h4>
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

            <div className="selection-group">
              <h4>Quantity</h4>
              <div className="quantity-control">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="add-to-cart-outline" onClick={handleAddToCart}>
                <FaShoppingCart /> Add to Cart
              </button>
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
            </div>
          </div>
        </div>

        <div className="review-section">
          <h2>Customer Reviews</h2>
          <div className="reviews-layout">
            <div className="review-form-card">
              <h3>Write a Review</h3>
              <form onSubmit={handleSubmitReview}>
                <div className="rating-input">
                  <label>Rating:</label>
                  <div className="star-selector">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <FaStar
                        key={star}
                        className={star <= userRating ? "star-filled" : "star-empty"}
                        onClick={() => setUserRating(star)}
                      />
                    ))}
                  </div>
                </div>

                <div className="comment-input">
                  <label>Comment:</label>
                  <textarea
                    placeholder="Share your experience..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="image-input">
                  <label>Upload Images:</label>
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} />
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
                  {isSubmitting ? "Submitting..." : "Post Review"}
                </button>
              </form>
            </div>

            <div className="reviews-list">
              {reviews.length === 0 ? (
                <p className="no-reviews">No reviews yet. Be the first to rate this product!</p>
              ) : (
                reviews.map((rev, index) => (
                  <div key={index} className="review-item">
                    <div className="review-header">
                      <div className="user-info">
                        <strong>{rev.userName}</strong>
                        <span className="review-date">
                          {new Date(rev.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={i < rev.rating ? "star-filled" : "star-empty"} />
                        ))}
                      </div>
                    </div>
                    <p className="review-comment">{rev.comment}</p>
                    {rev.images && rev.images.length > 0 && (
                      <div className="review-images">
                        {rev.images.map((img, i) => (
                          <img
                            key={i}
                            src={`http://localhost:5000${img}`}
                            alt="review"
                            onClick={() => window.open(`http://localhost:5000${img}`, "_blank")}
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
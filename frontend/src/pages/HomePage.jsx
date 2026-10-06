import API_BASE_URL from '../api';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import BoutiqueCarousel from "../components/BoutiqueCarousel";
import { FaArrowRight } from "react-icons/fa";
import logo from "../assets/logo1.png";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    // Fetch Products (used purely to link category images and counts)
    const fetchProducts = fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProducts(data);
      })
      .catch(err => console.error("Failed to fetch products:", err));

    // Fetch Categories
    const fetchCategories = fetch(`${API_BASE_URL}/categories?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(err => console.error("Failed to fetch categories:", err));

    Promise.all([fetchProducts, fetchCategories]).finally(() => {
      setLoading(false);
    });
  }, []);

  const getCategoryDetails = (cat) => {
    const catName = typeof cat === "string" ? cat : (cat?.name || "");
    const trimmed = catName.toLowerCase().trim();
    const catProducts = products.filter(
      p => p.category && p.category.toLowerCase().trim() === trimmed
    );

    // 1. Image explicitly uploaded by Admin for Category
    let imageUrl = "";
    if (cat && typeof cat === "object" && cat.image && cat.image.trim()) {
      imageUrl = cat.image.startsWith("http")
        ? cat.image
        : `${API_BASE_URL}${cat.image}`;
    }

    // 2. Automatic fallback: Use first product's photo from this category
    if (!imageUrl && catProducts.length > 0) {
      const firstProd = catProducts[0];
      const prodImg = (firstProd.images && firstProd.images.length > 0 && firstProd.images[0]) || firstProd.image;
      if (prodImg && typeof prodImg === "string" && prodImg.trim()) {
        imageUrl = prodImg.startsWith("http")
          ? prodImg
          : `${API_BASE_URL}${prodImg}`;
      }
    }

    return {
      count: catProducts.length,
      imageUrl
    };
  };

  // Filter categories if user types in search bar
  const displayedCategories = categories.filter(cat =>
    (cat.name || "").toLowerCase().includes(searchTerm.toLowerCase().trim())
  );

  return (
    <div className="homepage animate-fade-in">
      <Header onSearch={setSearchTerm} />
      <Hero />

      {/* Categories Showcase Section — Exclusively Categories on HomePage */}
      <section className="categories-showcase-section container">
        <div className="categories-showcase-header">
          <span className="badge-new">✨ EXCLUSIVE COLLECTIONS</span>
          <h2 className="categories-showcase-title">
            Shop By <span className="highlight-text">Category</span>
          </h2>
          <p className="categories-showcase-subtitle">
            Explore our boutique couture, designer sarees, co-ord sets, and curated feminine silhouettes.
          </p>

          {searchTerm && (
            <div className="search-status-bar">
              <span>
                Showing categories matching "<strong>{searchTerm}</strong>" ({displayedCategories.length} found)
              </span>
              <button className="clear-search-btn" onClick={() => setSearchTerm("")}>
                View All Categories
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="spinner-pink"></div>
            <p>Fetching Eve's Era collections...</p>
          </div>
        ) : displayedCategories.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👗</div>
            <h3>No categories found {searchTerm ? `matching "${searchTerm}"` : ""}</h3>
            {searchTerm && (
              <button className="reset-empty-btn" onClick={() => setSearchTerm("")}>
                View All Categories
              </button>
            )}
          </div>
        ) : (
          <div className="categories-showcase-grid animate-fade-in">
            {displayedCategories.map((cat) => {
              const details = getCategoryDetails(cat);
              return (
                <div
                  key={cat._id}
                  className="category-showcase-card"
                  onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                >
                  <div className="cat-card-image-wrap">
                    {details.imageUrl ? (
                      <>
                        <img
                          src={details.imageUrl}
                          alt={cat.name}
                          className="cat-card-image"
                          loading="lazy"
                        />
                        <div className="cat-card-overlay"></div>
                      </>
                    ) : (
                      <div className="cat-card-no-image">
                        <div className="cat-placeholder-logo-box">
                          <img src={logo} alt="Eve's Era" className="cat-placeholder-logo" />
                        </div>
                        <span className="cat-placeholder-text">Eve's Era</span>
                      </div>
                    )}
                    <div className="cat-card-badge">
                      <span>{details.count > 0 ? `${details.count} Designs` : "Boutique Fit"}</span>
                    </div>
                  </div>

                  <div className="cat-card-content">
                    <h3 className="cat-card-name">{cat.name}</h3>
                    <span className="cat-card-action">
                      Explore Collection <FaArrowRight size={12} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <BoutiqueCarousel />
      <Footer />
    </div>
  );
};

export default HomePage;

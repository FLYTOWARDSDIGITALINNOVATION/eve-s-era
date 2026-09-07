import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import { FaFilter, FaArrowLeft } from "react-icons/fa";
import "./CategoryProducts.css";

const CategoryProducts = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const isAllCategory = !category || category.toLowerCase() === "all" || category.toLowerCase() === "all collection";
  const isEvesEraCategory = category && (category.toLowerCase() === "eve's era" || category.toLowerCase() === "eves era");

  const searchParams = new URLSearchParams(location.search);
  const modelQuery = searchParams.get("model");

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter & Sort States
  const [searchTerm, setSearchTerm] = useState("");
  const [modelFilter, setModelFilter] = useState(
    modelQuery || (isEvesEraCategory ? "manufactured" : "all")
  );
  const [priceRange, setPriceRange] = useState(5000);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [sortBy, setSortBy] = useState("Featured");

  // Fetch all categories for sidebar navigation
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(err => console.error("Error fetching categories:", err));
  }, []);

  // Fetch products for the active category
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setSearchTerm("");

    const params = new URLSearchParams(location.search);
    const m = params.get("model");
    if (m) {
      setModelFilter(m);
    } else if (isEvesEraCategory) {
      setModelFilter("manufactured");
    } else {
      setModelFilter("all");
    }

    const fetchUrl = isAllCategory
      ? `${API_BASE_URL}/products`
      : `${API_BASE_URL}/products/category/${encodeURIComponent(category)}`;

    fetch(fetchUrl)
      .then(res => res.json())
      .then(data => {
        const prodList = Array.isArray(data) ? data : [];
        setProducts(prodList);
        if (prodList.length > 0) {
          const maxVal = Math.max(...prodList.map(p => Number(p.price || 0)), 1000);
          setMaxPrice(maxVal);
          setPriceRange(maxVal);
        } else {
          setMaxPrice(5000);
          setPriceRange(5000);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching category products:", err);
        setLoading(false);
      });
  }, [category, location.search]);

  // Filter products based on sidebar selections
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      !searchTerm ||
      (product.name || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModel =
      modelFilter === "all" ||
      (product.businessModel || "resell") === modelFilter;

    const matchesPrice = Number(product.price || 0) <= priceRange;

    return matchesSearch && matchesModel && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return Number(a.price || 0) - Number(b.price || 0);
    if (sortBy === "Price: High to Low") return Number(b.price || 0) - Number(a.price || 0);
    if (sortBy === "Newest") return (b._id || 0) > (a._id || 0) ? 1 : -1;
    return 0; // Default: Featured
  });

  const handleResetFilters = () => {
    setSearchTerm("");
    setModelFilter("all");
    setPriceRange(maxPrice);
    setSortBy("Featured");
  };

  const hasActiveFilters = searchTerm || modelFilter !== "all" || priceRange < maxPrice;

  return (
    <div className="category-page-wrapper">
      <Header onSearch={setSearchTerm} />
      
      <div className="category-page container">
        <div className="category-layout">
          
          {/* 🌟 Left Fixed/Sticky Sidebar */}
          <aside className="category-sidebar">
            <div className="filter-section">
              <div className="filter-header">
                <FaFilter className="filter-icon-side" />
                <h3>Filter & Browse</h3>
              </div>

              {/* Categories Navigation */}
              <div className="filter-group">
                <h4>Categories</h4>
                <div className="cat-nav-list">
                  <button
                    className={`cat-nav-item ${isAllCategory && modelFilter !== "manufactured" ? "active" : ""}`}
                    onClick={() => {
                      setModelFilter("all");
                      navigate("/category/all");
                    }}
                  >
                    <span className="cat-nav-dot"></span>
                    <span className="cat-nav-name">All Collections</span>
                  </button>
                  {categories.map((cat) => {
                    const isActive =
                      !isAllCategory &&
                      (cat.name || "").toLowerCase().trim() ===
                      (category || "").toLowerCase().trim();
                    return (
                      <button
                        key={cat._id || cat.name}
                        className={`cat-nav-item ${isActive ? "active" : ""}`}
                        onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                      >
                        <span className="cat-nav-dot"></span>
                        <span className="cat-nav-name">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collection Type (Business Model) */}
              <div className="filter-group">
                <h4>Collection Type</h4>
                <div className="segment-pills">
                  <button
                    className={`pill-btn ${modelFilter === "all" ? "active" : ""}`}
                    onClick={() => setModelFilter("all")}
                  >
                    All Collections
                  </button>
                  <button
                    className={`pill-btn ${modelFilter === "manufactured" ? "active" : ""}`}
                    onClick={() => setModelFilter("manufactured")}
                  >
                    ✨ Eve's Era Original
                  </button>
                  <button
                    className={`pill-btn ${modelFilter === "resell" ? "active" : ""}`}
                    onClick={() => setModelFilter("resell")}
                  >
                    Curated Resell
                  </button>
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="filter-group">
                <h4>Max Price</h4>
                <div className="price-slider-container">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    step="50"
                    value={priceRange}
                    onChange={(e) => setPriceRange(Number(e.target.value))}
                    className="price-slider"
                  />
                  <div className="price-values">
                    <span>₹0</span>
                    <span className="current-price-tag">Up to ₹{priceRange}</span>
                  </div>
                </div>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button className="clear-btn" onClick={handleResetFilters}>
                  Reset Filters
                </button>
              )}

              {/* Boutique Promo Card */}
              <div className="sidebar-banner">
                <span className="logo-sparkle">✨</span>
                <h3>Eve's Era</h3>
                <p>100% Authentic Handpicked Couture & Boutique Designs</p>
              </div>
            </div>
          </aside>

          {/* 🛍️ Right Main Content */}
          <main className="category-main-content">
            <div className="category-header-banner">
              <button className="back-btn" onClick={() => navigate("/home")}>
                <FaArrowLeft size={13} /> Return to Home
              </button>

              <div className="category-banner-info">
                <div>
                  <h1 className="category-title">
                    {isEvesEraCategory || modelFilter === "manufactured"
                      ? "Eve's Era"
                      : isAllCategory
                      ? "All"
                      : category}{" "}
                    <span className="highlight-text">Collection</span>
                  </h1>
                  <p className="category-count-sub">
                    {sortedProducts.length} designs available
                    {searchTerm && ` matching "${searchTerm}"`}
                  </p>
                </div>

                <div className="sort-box">
                  <label className="sort-label">Sort By:</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                    <option value="Featured">Featured</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Newest">Newest</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="product-grid animate-fade-in">
              {loading ? (
                <div className="loading-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                  <div className="spinner-pink" style={{ margin: '0 auto 16px' }}></div>
                  <p>Fetching {category} collection...</p>
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="empty-state" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '60px 0' }}>
                  <div className="empty-icon">👗</div>
                  <h3>No products found</h3>
                  <p>
                    {hasActiveFilters
                      ? "Try adjusting your price range or collection filter."
                      : `No products have been added to ${category} yet.`}
                  </p>
                  {hasActiveFilters && (
                    <button className="reset-empty-btn" onClick={handleResetFilters}>
                      Clear All Filters
                    </button>
                  )}
                </div>
              ) : (
                sortedProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))
              )}
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CategoryProducts;




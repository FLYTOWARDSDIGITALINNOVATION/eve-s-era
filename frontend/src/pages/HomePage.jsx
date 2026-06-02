import API_BASE_URL from '../api';
import Header from "../components/Header";
import FlashSaleBar from "../components/FlashSaleBar";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";
import Footer from "../components/Footer";
import BoutiqueCarousel from "../components/BoutiqueCarousel";
import { FaStar, FaGem, FaLeaf, FaFilter, FaSlidersH, FaBoxOpen } from "react-icons/fa";
import "./HomePage.css";
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/eve's era.jpeg";

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const modelQuery = searchParams.get("model") || "all";

  const [priceRange, setPriceRange] = useState(2500);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("Featured");

  // Sync state with url query parameters
  const [modelFilter, setModelFilter] = useState(modelQuery);
  useEffect(() => {
    setModelFilter(modelQuery);
  }, [modelQuery]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleModelSelect = (model) => {
    setModelFilter(model);
    if (model === "all") {
      navigate("/home");
    } else {
      navigate(`/home?model=${model}`);
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(product.category);

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesModel =
      modelFilter === "all" ||
      (product.businessModel || "resell") === modelFilter;

    const matchesPrice = Number(product.price || 0) <= priceRange;

    return matchesCategory && matchesSearch && matchesModel && matchesPrice;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "Price: Low to High") return a.price - b.price;
    if (sortBy === "Price: High to Low") return b.price - a.price;
    if (sortBy === "Newest") return b._id > a._id ? 1 : -1;
    return 0; // Default Featured
  });

  useEffect(() => {
    setLoading(true);
    // Fetch Products
    fetch(`${API_BASE_URL}/products`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch products:", err);
        setLoading(false);
      });

    // Fetch Categories
    fetch(`${API_BASE_URL}/categories`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      })
      .catch(err => {
        console.error("Failed to fetch categories:", err);
      });
  }, []);

  return (
    <div className="homepage animate-fade-in">
      <Header onSearch={setSearchTerm} onModelFilter={handleModelSelect} />
      <Hero />

      <div className="home-container container">
        {/* Sidebar Filters with Feminine Style */}
        <aside className="sidebar">
          <div className="filter-section">
            <div className="filter-header">
              <FaSlidersH className="filter-icon-side" />
              <h3>Refine Collection</h3>
            </div>

            {/* Business Model Filter Pills */}
            <div className="filter-group">
              <h4>Business Segment</h4>
              <div className="segment-pills">
                <button 
                  className={`pill-btn ${modelFilter === "all" ? "active" : ""}`}
                  onClick={() => handleModelSelect("all")}
                >
                  👚 All
                </button>
                <button 
                  className={`pill-btn original-pill ${modelFilter === "manufactured" ? "active" : ""}`}
                  onClick={() => handleModelSelect("manufactured")}
                >
                  <FaGem /> Originals
                </button>
                <button 
                  className={`pill-btn resell-pill ${modelFilter === "resell" ? "active" : ""}`}
                  onClick={() => handleModelSelect("resell")}
                >
                  <FaLeaf /> Resell
                </button>
              </div>
            </div>

            {/* Categories */}
            <div className="filter-group">
              <h4>Product Categories</h4>
              <div className="checkbox-list">
                {categories.length > 0 ? (
                  categories.map(cat => (
                    <label key={cat._id} className="checkbox-item">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat.name)}
                        onChange={() => handleCategoryChange(cat.name)}
                      />
                      <span className="checkmark"></span>
                      <span className="cat-name-text">{cat.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="no-cat-text">No categories found</p>
                )}
              </div>
            </div>

            {/* Price Slider */}
            <div className="filter-group">
              <h4>Price Limit</h4>
              <div className="price-slider-container">
                <input
                  type="range"
                  min="0"
                  max="5000"
                  step="100"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="price-slider"
                />
                <div className="price-values">
                  <span>₹0</span>
                  <span>₹{priceRange}</span>
                </div>
              </div>
            </div>

            <button 
              className="clear-btn" 
              onClick={() => {
                setSelectedCategories([]);
                setPriceRange(5000);
                handleModelSelect("all");
              }}
            >
              Reset All Filters
            </button>
          </div>

          <div className="sidebar-banner" style={{ marginLeft: '-15px' }}>
            <div style={{ height: '100px', width: '100px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src={logo} alt="Eve's Era Logo" style={{ maxHeight: '70%', maxWidth: '70%', objectFit: 'contain' }} />
            </div>
            <h3>Eve's Premium Care</h3>
            <p>Our self-manufactured garments use organic linens and pure Mulberry silks. Vetted resell luxury items are thoroughly authenticated by our boutique team.</p>
          </div>
        </aside>

        {/* Main Products Grid */}
        <main className="main-content">
          <div className="content-header">
            <div>
              <h2 className="section-title-label">
                {modelFilter === "manufactured" ? "🌸 Eve's Era Originals" : modelFilter === "resell" ? "♻️ Resell Collection" : "🛍️ Discover All Collections"}
              </h2>
              <p className="result-count">{sortedProducts.length} items found</p>
            </div>
            
            <div className="sort-box">
              <span className="sort-label">Sort by:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="Featured">Featured Collection</option>
                <option value="Price: Low to High">Price: Low to High</option>
                <option value="Price: High to Low">Price: High to Low</option>
                <option value="Newest">Newest Releases</option>
              </select>
            </div>
          </div>

          {/* Loading Screen */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner-pink"></div>
              <p>Fetching Eve's Era collections...</p>
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Empty State */
            <div className="empty-state">
              <div className="empty-icon">🧥</div>
              <h3>No items matched your search</h3>
              <p>Try resetting the category filter or searching for another term.</p>
              <button 
                className="reset-empty-btn" 
                onClick={() => {
                  setSelectedCategories([]);
                  setSearchTerm("");
                  setPriceRange(5000);
                  handleModelSelect("all");
                }}
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="products-grid animate-fade-in">
              {sortedProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          )}
        </main>
      </div>
      <BoutiqueCarousel />
      <Footer />
    </div>
  );
};

export default HomePage;

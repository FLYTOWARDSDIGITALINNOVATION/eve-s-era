import API_BASE_URL from '../api';
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import logo from "../assets/logo1.png";
import brownThreePieceSet from "../assets/mul-chanderi-brown-three-pcs-set.png";
import "./HomePage.css";

const favourites = [
  {
    name: "Mul Chanderi Brush Paint Three Pcs Set",
    image: "/assets/Vibrant Pink Floral Salwar Kameez.png",
    href: "/product/6af71b90220380e3f092c2c8",
    price: "₹1,750",
  },
  {
    name: "Mul Chanderi Three Pcs Set",
    image: "/assets/Elegant Maroon Embroidered Ethnic Ensemble.png",
    href: "/product/6af71a40220380e3f092c2aa",
    price: "₹2,350",
  },
  {
    name: "Aari Emblished Three Pcs Set",
    image: "/assets/Elegant Lavender Anarkali Portrait.png",
    href: "/product/6af719f2220380e3f092c29e",
    price: "₹1,450",
  },
  {
    name: "Mul Chanderi Three Pcs Set",
    image: brownThreePieceSet,
    href: "/product/6af71b43220380e3f092c2bc",
    price: "₹2,150",
  },
];

const moreFavourites = [
  {
    name: "Mul Chanderi Three Pcs Set",
    image: "/assets/Vibrant Pink Indian Traditional Ensemble.png",
    href: "/product/6af719c1220380e3f092c298",
    price: "₹1,200",
  },
  {
    name: "Mul Chanderi Three Pcs Set",
    image: "/assets/Embroidered Kurta with Patterned Dupatta.png",
    href: "/product/6af71996220380e3f092c292",
    price: "₹1,200",
  },
  {
    name: "Mul Chanderi Three Pcs Set",
    image: "/assets/Elegant Pink Kurti Portrait.png",
    href: "/product/6af71af6220380e3f092c2b0",
    price: "₹1,200",
  },
  {
    name: "Mul Chanderi Three Pcs Set",
    image: "/assets/Teal Embroidered Salwar Kameez Portrait.png",
    href: "/product/6af71b1c22038e3f092c2b6",
    price: "₹1,200",
  },
];

const CategoryShowcaseImage = ({ imageUrl, fallbackImageUrl, name, logo }) => {
  const [source, setSource] = useState(imageUrl || fallbackImageUrl || "");

  useEffect(() => {
    setSource(imageUrl || fallbackImageUrl || "");
  }, [imageUrl, fallbackImageUrl]);

  if (!source) {
    return (
      <div className="cat-card-no-image">
        <div className="cat-placeholder-logo-box">
          <img src={logo} alt="Eve's Era" className="cat-placeholder-logo" />
        </div>
        <span className="cat-placeholder-text">Eve's Era</span>
      </div>
    );
  }

  return (
    <img
      src={source}
      alt={name}
      className="cat-card-image"
      loading="lazy"
      onError={() => {
        if (source !== fallbackImageUrl && fallbackImageUrl) setSource(fallbackImageUrl);
        else setSource("");
      }}
    />
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoriesSliderRef = useRef(null);

  const slideCategories = (direction) => {
    if (!categoriesSliderRef.current) return;
    categoriesSliderRef.current.scrollBy({
      left: direction * categoriesSliderRef.current.clientWidth,
      behavior: "smooth"
    });
  };

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

  useEffect(() => {
    if (location.hash !== "#collections") return;
    requestAnimationFrame(() => {
      document.getElementById("collections")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }, [location.key, location.hash]);

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

    let fallbackImageUrl = "";
    if (catProducts.length > 0) {
      const firstProd = catProducts.find((item) => (item.images?.[0] || item.image));
      const prodImg = firstProd && ((firstProd.images && firstProd.images[0]) || firstProd.image);
      if (prodImg && typeof prodImg === "string" && prodImg.trim()) {
        fallbackImageUrl = prodImg.startsWith("http") ? prodImg : `${API_BASE_URL}${prodImg}`;
      }
    }

    return {
      count: catProducts.length,
      imageUrl,
      fallbackImageUrl: imageUrl === fallbackImageUrl ? "" : fallbackImageUrl,
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
      <section id="collections" className="categories-showcase-section container">
        <div className="categories-showcase-header">
          <span className="categories-eyebrow">EXPLORE OUR COLLECTIONS</span>
          <h2 className="categories-showcase-title">
            Find Your Favourite Styles
          </h2>

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
          <div className="categories-carousel">
            {displayedCategories.length > 4 && (
              <div className="categories-slider-controls">
                <button type="button" onClick={() => slideCategories(-1)} aria-label="Previous collections">
                  <FaArrowLeft />
                </button>
                <button type="button" onClick={() => slideCategories(1)} aria-label="Next collections">
                  <FaArrowRight />
                </button>
              </div>
            )}
            <div className="categories-showcase-grid animate-fade-in" ref={categoriesSliderRef}>
            {displayedCategories.map((cat) => {
              const details = getCategoryDetails(cat);
              return (
                <div
                  key={cat._id}
                  className="category-showcase-card"
                  onClick={() => navigate(`/category/${encodeURIComponent(cat.name)}`)}
                >
                  <div className="cat-card-image-wrap">
                    <CategoryShowcaseImage
                      imageUrl={details.imageUrl}
                      fallbackImageUrl={details.fallbackImageUrl}
                      name={cat.name}
                      logo={logo}
                    />
                    <div className="cat-card-overlay"></div>
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
          </div>
        )}
      </section>

      <section className="home-favourites-section" aria-labelledby="favourites-title">
        <div className="home-favourites-heading">
          <span className="home-favourites-eyebrow">CUSTOMER FAVOURITES</span>
          <h2 id="favourites-title">Styles You’ll Love to Wear</h2>
          <p>
            Explore our bestselling collection and find beautiful outfits that match your style.
            <br />Your next favourite look might be waiting here!
          </p>
        </div>
        <div className="home-favourites-grid">
          {[...favourites, ...moreFavourites].map((product) => (
            <Link className="home-favourite-card" key={product.href} to={product.href}>
              <img src={product.image} alt={product.name} loading="lazy" />
              <h3>{product.name}</h3>
              <span className="home-favourite-rating" aria-label="Customer favourite">★★★★★</span>
              <span className="home-favourite-price">{product.price}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* <BoutiqueCarousel /> */}
      <section className="why-choose-section">
        <div className="why-choose-eyebrow">
          <span></span>
          <h2>WHY CHOOSE EVES_ERA</h2>
          <span></span>
        </div>
        <div className="why-choose-content">
          <div className="why-choose-image-wrap">
            <img
              src="/assets/Teal Kurta Fashion Portrait with Potted Plant.png"
              alt="Model wearing an elegant teal kurta from Eve's Era"
              className="why-choose-image"
              loading="lazy"
            />
          </div>
          <div className="why-choose-copy">
            <h3>Find Clothes That<br />Feel <span>Right for You</span></h3>
            <div className="why-choose-rule"></div>
            <p>
              Shopping for clothes is more than just picking an outfit. It's about finding colours, designs and styles that you enjoy wearing. At Eve-S-Era, you can explore a range of women's clothing for everyday outings, casual days and special occasions. Take your time, discover new looks and choose outfits that suit your taste and make you feel comfortable. Whatever your style, there's always something new to explore at Eve-S-Era.
            </p>
          </div>
        </div>
      </section>
      <section className="home-cta-section">
        <div className="home-cta-copy">
          <span className="home-cta-brand">Eve-S-Era</span>
          <h2>Ready to Find Your<br />Next Favourite Outfit?</h2>
          <p>Find your style and love every look with Eve-S-Era!</p>
          <a className="home-cta-button" href="#collections">
            Shop Your Style <FaArrowRight aria-hidden="true" />
          </a>
        </div>
        <div className="home-cta-image-wrap">
          <img
            src="/assets/Elegant Lavender Anarkali Portrait.png"
            alt="Model wearing a lavender outfit from Eve's Era"
            className="home-cta-image"
            loading="lazy"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default HomePage;

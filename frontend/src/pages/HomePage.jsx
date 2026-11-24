import API_BASE_URL, { REMOTE_API_BASE_URL } from '../api';
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import logo from "../assets/logo1.png";
import "./HomePage.css";
import Hero from "../components/landing-page/Hero";

const getImageCandidates = (imagePaths) => {
  const candidates = imagePaths.flatMap((image) => {
    if (typeof image !== "string" || !image.trim()) return [];
    if (/^(https?:|data:)/i.test(image)) return [image];
    const path = image.startsWith("/") ? image : `/${image}`;
    if (path.startsWith("/assets/")) return [path];
    const localImageUrl = `${API_BASE_URL}${path}`;
    const localDevelopment = API_BASE_URL.startsWith("http://127.0.0.1")
      || API_BASE_URL.startsWith("http://localhost");
    if (!localDevelopment || !path.startsWith("/uploads/")) return [localImageUrl];

    const timestamp = Number(path.match(/\/uploads\/(\d{13})(?:-\d+)?\.[^/]+$/)?.[1]);
    const likelyArchivedUpload = Number.isFinite(timestamp)
      && Date.now() - timestamp > 24 * 60 * 60 * 1000;
    const productionImageUrl = `${REMOTE_API_BASE_URL}${path}`;
    return likelyArchivedUpload
      ? [productionImageUrl, localImageUrl]
      : [localImageUrl, productionImageUrl];
  });
  return [...new Set(candidates)];
};

const getFavouriteImageCandidates = (product) => getImageCandidates([
  product.image,
  ...(Array.isArray(product.images) ? product.images : []),
]);

const FavouriteProductImage = ({ product }) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const imageCandidates = getFavouriteImageCandidates(product);

  useEffect(() => {
    setCandidateIndex(0);
  }, [product._id]);

  if (!imageCandidates[candidateIndex]) {
    return <div className="home-favourite-image-unavailable" role="img" aria-label={`${product.name} image unavailable`} />;
  }

  return (
    <img
      src={imageCandidates[candidateIndex]}
      alt={product.name}
      loading="lazy"
      onError={() => setCandidateIndex((index) => index + 1)}
    />
  );
};

const CategoryShowcaseImage = ({ imageCandidates, name, logo }) => {
  const [candidateIndex, setCandidateIndex] = useState(0);
  const candidatesKey = imageCandidates.join("|");

  useEffect(() => {
    setCandidateIndex(0);
  }, [candidatesKey]);

  if (!imageCandidates[candidateIndex]) {
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
      src={imageCandidates[candidateIndex]}
      alt={name}
      className="cat-card-image"
      loading="lazy"
      onError={() => setCandidateIndex((index) => index + 1)}
    />
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [favouriteProducts, setFavouriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const categoriesSliderRef = useRef(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/customer-favourites`)
      .then((res) => res.ok ? res.json() : [])
      .then((data) => {
        if (Array.isArray(data)) setFavouriteProducts(data);
      })
      .catch((err) => console.error("Failed to fetch customer favourites:", err));
  }, []);

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
    return {
      count: catProducts.length,
      imageCandidates: getImageCandidates([
        cat && typeof cat === "object" ? cat.image : "",
        ...catProducts.flatMap((product) => [
          product.image,
          ...(Array.isArray(product.images) ? product.images : []),
        ]),
      ]),
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
                      imageCandidates={details.imageCandidates}
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
          {favouriteProducts.map((product) => (
              <Link className="home-favourite-card" key={product._id} to={`/product/${product._id}`}>
                <FavouriteProductImage product={product} />
                <h3>{product.name}</h3>
                <span className="home-favourite-rating" aria-label="Customer favourite">★★★★★</span>
                <span className="home-favourite-price">₹{Number(product.price || 0).toLocaleString("en-IN")}</span>
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

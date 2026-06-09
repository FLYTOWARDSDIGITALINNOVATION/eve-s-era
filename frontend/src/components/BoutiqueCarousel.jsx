import React, { useState, useEffect, useRef } from "react";
import { FaArrowLeft, FaArrowRight, FaMapMarkerAlt, FaStore, FaClock } from "react-icons/fa";
import boutiqueFront from "../assets/boutique_front.jpg";
import boutiqueInside from "../assets/boutique_inside.jpg";
import "./BoutiqueCarousel.css";

const slides = [
  {
    id: 1,
    img: boutiqueFront,
    badge: "✨ Visit Our Boutique",
    title: "Step Into Eve's Era",
    desc: "Our premium boutique is designed to make you feel like a queen. Experience curated luxury, starting with our iconic hot-pink storefront.",
    usp: ["Vibrant Pink Storefront", "Feminine & Warm Ambience", "Personal Styling Help"]
  },
  {
    id: 2,
    img: boutiqueInside,
    badge: "🛍️ Exclusive In-Store Curation",
    title: "Elegant Interior & Collections",
    desc: "Browse our handpicked range of organic silks, linens, and meticulously authenticated premium boutique garments.",
    usp: ["Mulberry Silk & Linens", "Carefully Checked Finish", "Premium Trial Experience"]
  }
];

function BoutiqueCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoplayTimer = useRef(null);

  const startAutoplay = () => {
    stopAutoplay();
    autoplayTimer.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);
  };

  const stopAutoplay = () => {
    if (autoplayTimer.current) {
      clearInterval(autoplayTimer.current);
    }
  };

  useEffect(() => {
    if (!isHovered) {
      startAutoplay();
    } else {
      stopAutoplay();
    }
    return () => stopAutoplay();
  }, [isHovered]);

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handleDotClick = (index, e) => {
    e.stopPropagation();
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  return (
    <section
      className="boutique-carousel-section"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="boutique-section-header container">
        <div className="header-badge">
          <FaStore className="badge-icon" /> <span>Our Physical Boutique</span>
        </div>
        <h2 className="boutique-section-title">
          Experience <span className="highlight-text-boutique">Eve's Era</span> In Person
        </h2>
        <p className="boutique-section-subtitle">
          Located in a cozy boutique layout, we offer personalized styling sessions and hands-on trial experiences.
        </p>
      </div>

      <div className="container boutique-carousel-container">
        {/* Slides Area */}
        <div className="boutique-carousel-slider">
          {slides.map((slide, index) => {
            let position = "next-slide";
            if (index === currentIndex) {
              position = "active-slide";
            } else if (index === (currentIndex - 1 + slides.length) % slides.length) {
              position = "prev-slide";
            }

            return (
              <div key={slide.id} className={`boutique-slide ${position}`}>
                {/* Background Image with Zoom */}
                <div className="slide-image-wrapper">
                  <img
                    src={slide.img}
                    alt={slide.title}
                    className="slide-image-element"
                  />
                  <div className="slide-overlay-gradient"></div>
                </div>

                {/* Left Glassmorphism Content Card */}
                <div className="slide-content-overlay">
                  <span className="slide-badge">{slide.badge}</span>
                  <h3 className="slide-title-text">{slide.title}</h3>
                  <p className="slide-description-text">{slide.desc}</p>

                  <div className="slide-usp-list">
                    {slide.usp.map((item, idx) => (
                      <span key={idx} className="slide-usp-item">
                        <span className="usp-dot">🌸</span> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Navigation Arrows */}
          <button
            className="carousel-nav-btn prev-btn"
            onClick={handlePrev}
            aria-label="Previous image"
          >
            <FaArrowLeft />
          </button>
          <button
            className="carousel-nav-btn next-btn"
            onClick={handleNext}
            aria-label="Next image"
          >
            <FaArrowRight />
          </button>

          {/* Carousel Dots */}
          <div className="carousel-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
                onClick={(e) => handleDotClick(index, e)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Info Box with Store details */}
        <div className="boutique-info-card">
          <div className="info-header">
            <h4>Boutique Information</h4>
          </div>
          <div className="info-body">
            <div className="info-item">
              <FaMapMarkerAlt className="info-icon" />
              <div>
                <h5>Boutique Address</h5>
                <p>Eves Era Boutique, Women's Clothing Boutique,<br />Near main bazaar road, Tamil Nadu</p>
              </div>
            </div>
            <div className="info-item">
              <FaClock className="info-icon" />
              <div>
                <h5>Opening Hours</h5>
                <p>Monday - Sunday: 10:00 am to 8:45 pm</p>
              </div>
            </div>
            <div className="info-tag-promo">
              <span className="promo-sparkle">✨</span>
              <p>Walk-in today for customized stitching & premium altering recommendations!</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BoutiqueCarousel;

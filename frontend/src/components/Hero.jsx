import React, { useState, useEffect } from "react";
import { FaArrowRight, FaGem, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import fashionHero from "../assets/fashion_hero.png";
import tshirt2 from "../assets/tshirt2.png";
import "./hero.css";

const slides = [
  {
    id: 1,
    img: fashionHero,
    tagline: "Eves Era Originals",
    title: "Manufactured for Elegance",
    desc: "Experience high-end couture handcrafted with love and sustainable processes in our own workshops.",
    btnText: "Shop Originals",
    model: "manufactured",
    icon: <FaGem />
  },
  {
    id: 2,
    img: tshirt2,
    tagline: "Curated Resell Collection",
    title: "Sustainable Fashion Loop",
    desc: "Give premium, high-quality garments a new story. Hand-inspected, branded items at incredible values.",
    btnText: "Shop Resell",
    model: "resell",
    icon: <FaLeaf />
  }
];

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[currentSlide];

  return (
    <section className="hero-section-wrapper">
      <div className="container hero-container" key={slide.id}>
        <div className="hero-left fade-in">
          <span className="badge-new">
            {slide.icon} {slide.tagline}
          </span>

          <h1 className="hero-title-main">
            Redefining <br />
            <span className="highlight-text">{slide.title}</span>
          </h1>

          <p className="hero-desc">
            {slide.desc}
          </p>

          <div className="hero-buttons">
            <button 
              className="primary-btn"
              onClick={() => navigate(`/home?model=${slide.model}`)}
            >
              {slide.btnText} <FaArrowRight />
            </button>
            <button 
              className="secondary-btn"
              onClick={() => navigate("/home")}
            >
              Explore All
            </button>
          </div>

          <div className="hero-usp-row">
            <div className="usp-item">
              <span className="usp-bullet">✨</span>
              <span>100% Quality Inspected</span>
            </div>
            <div className="usp-item">
              <span className="usp-bullet">🌸</span>
              <span>Boutique Luxury Fits</span>
            </div>
          </div>
        </div>

        <div className="hero-right fade-in">
          <div className="featured-card">
            <div className="glass-decor"></div>
            <img
              src={slide.img}
              alt={slide.title}
              className="featured-img"
            />
            <div className="floating-price-tag">
              <span>Boutique Exclusive</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

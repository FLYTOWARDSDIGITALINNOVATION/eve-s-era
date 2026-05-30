import React, { useState, useEffect } from "react";
import { FaArrowRight, FaGem, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";
import hero5 from "../assets/hero5.jpg";
import hero6 from "../assets/hero6.jpg";
import "./hero.css";

const slides = [
  {
    id: 1,
    img: hero1,
    tagline: "Eve's Era Originals",
    title: "Manufactured for Elegance",
    desc: "Experience high-end couture handcrafted with love and sustainable processes in our own workshops.",
    btnText: "Shop Originals",
    model: "manufactured",
    icon: <FaGem />
  },
  {
    id: 2,
    img: hero2,
    tagline: "Curated Resell Collection",
    title: "Sustainable Fashion Loop",
    desc: "Give premium, high-quality garments a new story. Hand-inspected, branded items at incredible values.",
    btnText: "Shop Resell",
    model: "resell",
    icon: <FaLeaf />
  },
  {
    id: 3,
    img: hero3,
    tagline: "Eve's Era Originals",
    title: "Timeless Classics",
    desc: "Discover styles that never fade. Expertly tailored pieces for your everyday luxury.",
    btnText: "Shop Originals",
    model: "manufactured",
    icon: <FaGem />
  },
  {
    id: 4,
    img: hero4,
    tagline: "Curated Resell Collection",
    title: "Eco-Friendly Choices",
    desc: "Join the movement towards a greener future with our pre-loved authentic collections.",
    btnText: "Shop Resell",
    model: "resell",
    icon: <FaLeaf />
  },
  {
    id: 5,
    img: hero5,
    tagline: "Eve's Era Originals",
    title: "Modern Sophistication",
    desc: "Elevate your wardrobe with contemporary designs meant to make a statement.",
    btnText: "Shop Originals",
    model: "manufactured",
    icon: <FaGem />
  },
  {
    id: 6,
    img: hero6,
    tagline: "Curated Resell Collection",
    title: "Vintage Treasures",
    desc: "Unearth rare finds and iconic silhouettes that define authentic fashion history.",
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
    }, 3000);
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

import React from "react";
import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import "./hero.css";

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <img
        className="hero-image"
        src="/assets/Elegant Maroon Embroidered Ethnic Ensemble.png"
        alt="Fashion model wearing an elegant maroon traditional look"
      />
      <div className="image-shade" aria-hidden="true" />
      <div className="hero-copy">
        <h1 id="hero-title">Your style,<br /><em>your choice.</em></h1>
        <div className="copy-rule" />
        <p className="intro">
          Looking for outfits that match your style? Eve-S-Era brings you a
          fresh collection of fashion, making your search for online women’s
          clothing stores a little more exciting. Find pieces you’ll love
          wearing, every day and on every occasion.
        </p>
        <Link className="cta" to="/category/all">
          Explore the collection
          <span><ArrowUpRight size={17} strokeWidth={1.6} /></span>
        </Link>
      </div>
    </section>
  );
}

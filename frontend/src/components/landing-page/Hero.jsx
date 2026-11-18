import { ArrowUpRight } from 'lucide-react';
import './Hero.css';

export default function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <div className="hero-image" role="img" aria-label="Fashion model in an elegant ivory look" />
      <div className="image-shade" />
      <div className="hero-copy">
        <h1 id="hero-title">Your style,<br /><em>your choice.</em></h1>
        <div className="copy-rule" />
        <p className="intro">Looking for outfits that match your style? Eve-S-Era brings you a fresh collection of fashion, making your search for online women’s clothing stores a little more exciting. Find pieces you’ll love wearing, every day and on every occasion.</p>
        <a className="cta" id="collection" href="https://eveseraclothing.com/category/all">Explore the collection <span><ArrowUpRight size={17} strokeWidth={1.6} /></span></a>
      </div>
    </section>
  );
}

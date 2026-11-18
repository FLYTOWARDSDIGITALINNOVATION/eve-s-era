import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import './Collections.css';

const categories = [
  { name: 'Saree', image: 'Kanchipuram Silk Sarees.webp' },
  { name: 'Two Piece Set', image: 'Vibrant Pink Indian Traditional Ensemble.png' },
  { name: 'Three Piece Set', image: 'Embroidered Kurta with Patterned Dupatta.png' },
  { name: 'Western Wear', image: 'Purple Embroidered Kurti.webp' },
  { name: 'Daily Wear', image: 'Elegant Pink Kurti Portrait.png' },
  { name: 'Short Top', image: 'Embroidered Cotton Top.webp' },
  { name: 'Aari Work Top', image: 'Maroon Embroidered Suit.webp' },
  { name: 'Maternity Top', image: 'Pink Salwar Suit Set.webp' },
  { name: 'Maxi', image: 'Vibrant Pink Floral Salwar Kameez.png' },
  { name: 'Nightwear', image: 'Printed Nightwear.webp' },
];

const categoriesPerSlide = 5;
const slideCount = Math.ceil(categories.length / categoriesPerSlide);

export default function Collections() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const showPrevious = () => setActiveSlide((slide) => (slide - 1 + slideCount) % slideCount);
  const showNext = () => setActiveSlide((slide) => (slide + 1) % slideCount);

  useEffect(() => {
    if (isPaused || slideCount < 2) return undefined;
    const timer = window.setInterval(showNext, 4000);
    return () => window.clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="collections" id="collections" aria-labelledby="collections-title">
      <div className="collections-top">
        <div className="collections-heading">
          <p className="section-kicker">Explore our collections</p>
          <h2 id="collections-title">Find Your Favourite Styles</h2>
        </div>
      </div>
      <div
        className="carousel-stage"
        aria-label="Clothing categories carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false);
        }}
      >
        <button className="carousel-arrow carousel-arrow-left" type="button" aria-label="Previous five categories" onClick={showPrevious}><ArrowLeft size={19} strokeWidth={1.5} /></button>
        <div className="carousel-viewport">
          <div className="carousel-track" style={{ transform: `translateX(-${activeSlide * 100}%)` }}>
            {Array.from({ length: slideCount }, (_, slide) => (
              <div className="category-page" key={slide}>
                {categories.slice(slide * categoriesPerSlide, (slide + 1) * categoriesPerSlide).map((category) => (
                  <a className="category-card" href={`https://eveseraclothing.com/category/${encodeURIComponent(category.name)}`} key={category.name}>
                    <div className="category-image-wrap">
                      <img src={`/assets/${encodeURIComponent(category.image)}`} alt={`${category.name} fashion`} loading="lazy" />
                    </div>
                    <span>{category.name}</span>
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>
        <button className="carousel-arrow carousel-arrow-right" type="button" aria-label="Next five categories" onClick={showNext}><ArrowRight size={19} strokeWidth={1.5} /></button>
      </div>
    </section>
  );
}

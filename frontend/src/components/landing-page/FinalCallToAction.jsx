import { ArrowRight } from 'lucide-react';
import './FinalCallToAction.css';

export default function FinalCallToAction() {
  return (
    <section className="final-cta" aria-labelledby="final-cta-title">
      <div className="final-cta-copy">
        <p className="final-cta-kicker">Eve-S-Era</p>
        <h2 id="final-cta-title">Ready to Find Your Next Favourite Outfit?</h2>
        <p>Find your style and love every look with Eve-S-Era!</p>
        <a className="final-cta-button" href="#collections">Shop Your Style <ArrowRight size={18} strokeWidth={1.6} /></a>
      </div>
      <div className="final-cta-image" role="img" aria-label="Model wearing a timeless evening outfit" />
    </section>
  );
}

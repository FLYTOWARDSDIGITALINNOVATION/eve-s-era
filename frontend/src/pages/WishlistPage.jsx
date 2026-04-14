import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronLeft } from "lucide-react"; 
import './WishlistPage.css';

const WishlistPage = () => {
  // This hook ensures that if an item is removed from the Profile page, 
  // it immediately disappears from this list too.
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page-wrapper">
      <Header />
      
      <main className="wishlist-main container">
        <div className="back-btn-container">
          <Link to="/home" className="classic-browse-btn">
            <ChevronLeft size={16} /> Back to Shop
          </Link>
        </div>

        {wishlist.length === 0 ? (
          <div className="empty-wishlist-card">
            <div className="wishlist-icon-wrapper">
              <span className="floating-heart">❤️</span>
            </div>
            
            <h2 className="empty-title">Love at first sight starts here</h2>
            
            <p className="empty-subtitle">
              Your wishlist is feeling a bit lonely. Tap the heart on any <br />
              product to save it for later. Your future self will thank you.
            </p>

            <Link to="/home" className="classic-browse-btn">
               Find Something to Love
            </Link>
          </div>
        ) : (
          <>
            <h2 className="page-title">My Wishlist <span>({wishlist.length})</span></h2>
            <div className="products-grid">
              {wishlist.map((product) => (
                /* Ensure ProductCard uses removeFromWishlist and addToCart from Context */
                <ProductCard key={product.id || product.productId} product={product} />
              ))}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
import React, { useState, useEffect } from "react";
import API_BASE_URL from "../api";
import { FaImage, FaUpload, FaTrash } from "react-icons/fa";
import "./AdminHeroBanners.css";

const AdminHeroBanners = () => {
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(null);

  const fetchSlides = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/hero`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setSlides(data);
      }
    } catch (err) {
      console.error("Failed to fetch hero slides", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlides();
  }, []);

  const handleImageUpload = async (slideId, e) => {
    const file = e.target.files[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    setUploading(slideId);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${API_BASE_URL}/admin/hero/${slideId}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (res.ok) {
        alert(`Slide ${slideId} updated successfully!`);
        fetchSlides();
      } else {
        const errData = await res.json();
        alert(`Failed to update slide: ${errData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload.");
    } finally {
      setUploading(null);
      // Reset file input
      e.target.value = "";
    }
  };

  const handleRemoveSlide = async (slideId) => {
    if (!window.confirm("Are you sure you want to revert to the default image?")) return;
    
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    try {
      const res = await fetch(`${API_BASE_URL}/admin/hero/${slideId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        fetchSlides();
      } else {
        alert("Failed to remove slide.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing slide.");
    }
  };

  const slideIds = [1, 2, 3, 4, 5, 6];

  return (
    <div className="admin-hero-banners animate-fade-in">
      <h2>Hero Banners Management</h2>
      <p className="admin-subtitle">Update the showcase images for the 6 hero slides on the storefront.</p>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-pink"></div>
          <p>Loading banners...</p>
        </div>
      ) : (
        <div className="hero-banners-grid">
          {slideIds.map((id) => {
            const customSlide = slides.find((s) => s.slideId === id);
            return (
              <div key={id} className="hero-banner-card shadow-sm">
                <div className="banner-header">
                  <h3>Slide {id}</h3>
                  <span className="badge">
                    {customSlide ? "Customized" : "Default"}
                  </span>
                </div>
                
                <div className="banner-img-preview">
                  {customSlide ? (
                    <img src={`${API_BASE_URL}${customSlide.img}`} alt={`Slide ${id}`} />
                  ) : (
                    <div className="no-image-placeholder">
                      <FaImage size={40} />
                      <p>Using System Default Image</p>
                    </div>
                  )}
                </div>

                <div className="banner-actions">
                  <input 
                    type="file" 
                    id={`upload-slide-${id}`} 
                    hidden 
                    accept="image/*"
                    onChange={(e) => handleImageUpload(id, e)}
                  />
                  <button 
                    className="upload-banner-btn"
                    onClick={() => document.getElementById(`upload-slide-${id}`).click()}
                    disabled={uploading === id}
                  >
                    <FaUpload /> {uploading === id ? "Uploading..." : "Upload"}
                  </button>
                  {customSlide && (
                    <button 
                      className="remove-banner-btn"
                      onClick={() => handleRemoveSlide(id)}
                      title="Remove Custom Image"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminHeroBanners;

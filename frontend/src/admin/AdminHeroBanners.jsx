import React, { useEffect, useState } from "react";
import API_BASE_URL from "../api";
import { FaTrash } from "react-icons/fa";
import "./AdminHeroBanners.css";

const getProductImage = (product) => product?.image || product?.images?.[0] || "";

const getImageUrl = (image) => {
  if (!image) return "";
  if (/^(https?:|data:)/i.test(image)) return image;
  return `${API_BASE_URL}${image.startsWith("/") ? "" : "/"}${image}`;
};

const AdminHeroBanners = () => {
  const [products, setProducts] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    try {
      const [productsResponse, favouritesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/products`),
        fetch(`${API_BASE_URL}/customer-favourites`),
      ]);
      if (!productsResponse.ok || !favouritesResponse.ok) {
        throw new Error("Could not load products or Customer Favourites.");
      }
      const [productData, favouriteData] = await Promise.all([
        productsResponse.json(),
        favouritesResponse.json(),
      ]);
      setProducts(Array.isArray(productData) ? productData : []);
      setFavourites(Array.isArray(favouriteData) ? favouriteData : []);
    } catch (err) {
      console.error("Failed to load Customer Favourites", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddFavourite = async (event) => {
    event.preventDefault();
    if (!selectedProductId) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    setSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/customer-favourites`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productId: selectedProductId }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(data.message || "Failed to add product.");
        return;
      }
      setSelectedProductId("");
      await fetchData();
      alert("Added to Customer Favourites successfully!");
    } catch (err) {
      console.error(err);
      alert("Could not add this product. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveFavourite = async (productId) => {
    const product = favourites.find((item) => item._id === productId);
    if (!window.confirm(`Remove ${product?.name || "this product"} from Customer Favourites?`)) return;
    const token = localStorage.getItem("token");
    if (!token) return alert("Unauthorized");

    try {
      const response = await fetch(`${API_BASE_URL}/admin/customer-favourites/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        alert(data.message || "Failed to remove product.");
        return;
      }
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Could not remove this product. Please try again.");
    }
  };

  const availableProducts = products.filter(
    (product) => !favourites.some((favourite) => favourite._id === product._id)
  );

  return (
    <div className="admin-hero-banners animate-fade-in">
      <h2>Customer Favourites</h2>
      <p className="admin-subtitle">Choose products to show on the home page. Their current product image and price will be displayed automatically.</p>

      {loading ? (
        <div className="loading-state">
          <div className="spinner-pink"></div>
          <p>Loading products...</p>
        </div>
      ) : (
        <>
          <form className="favourite-add-form" onSubmit={handleAddFavourite}>
            <label htmlFor="favourite-product-select">Add a product</label>
            <select
              id="favourite-product-select"
              value={selectedProductId}
              onChange={(event) => setSelectedProductId(event.target.value)}
            >
              <option value="">Select a product</option>
              {availableProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {product.name} — ₹{Number(product.price || 0).toLocaleString("en-IN")}
                </option>
              ))}
            </select>
            <button type="submit" disabled={!selectedProductId || saving}>
              {saving ? "Adding..." : "Add to Customer Favourites"}
            </button>
          </form>

          {favourites.length === 0 ? (
            <div className="no-favourites-message">No Customer Favourites yet. Add a product above to show it on the home page.</div>
          ) : (
            <div className="hero-banners-grid">
              {favourites.map((product) => (
                <article key={product._id} className="hero-banner-card shadow-sm">
                  <div className="banner-header">
                    <h3>{product.name}</h3>
                    <span className="badge">On home page</span>
                  </div>
                  <div className="banner-img-preview">
                    {getProductImage(product) ? (
                      <img src={getImageUrl(getProductImage(product))} alt={product.name} />
                    ) : (
                      <div className="no-image-placeholder"><p>No product image</p></div>
                    )}
                  </div>
                  <p className="favourite-admin-price">₹{Number(product.price || 0).toLocaleString("en-IN")}</p>
                  <div className="banner-actions">
                    <button
                      type="button"
                      className="remove-banner-btn favourite-remove-btn"
                      onClick={() => handleRemoveFavourite(product._id)}
                      aria-label={`Remove ${product.name} from Customer Favourites`}
                      title="Remove from home page"
                    ><FaTrash /></button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminHeroBanners;

import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaCloudUploadAlt } from "react-icons/fa";
import "./AddProduct.css";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    businessModel: "resell", // default model
    materials: "",
    sizes: "S, M, L, XL",
    colors: "Pink, Rose, Dusty Mauve",
    stock: "15",
    supplierName: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const adminEmail = "admin@gmail.com";
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      });
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!form.name || !form.price || !form.category) {
      alert("Name, Price, and Category are required!");
      return;
    }

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("price", form.price);
    formData.append("description", form.description);
    formData.append("businessModel", form.businessModel);
    formData.append("materials", form.materials);
    formData.append("sizes", form.sizes);
    formData.append("colors", form.colors);
    formData.append("stock", form.stock);
    formData.append("supplierName", form.supplierName);
    formData.append("email", adminEmail);
    
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/product`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      alert(data.message || "Product listed in Eve's Era catalogue successfully!");
      if (res.ok) {
        navigate("/admin");
      }
    } catch (err) {
      console.error("Add Product Error:", err);
      alert("Failed to save product.");
    }
  };

  return (
    <div className="add-product-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Return to Dashboard
      </button>

      <div className="form-card-container">
        <h2>List New Fashion Piece</h2>
        <p className="form-sub-header">Add self-manufactured originals or verified pre-loved resell items to Eves Era.</p>

        <div className="product-form-grid">
          {/* LEFT: Details */}
          <div className="form-details-column">
            <div className="input-group-field">
              <label>Business Model Segment</label>
              <select
                value={form.businessModel}
                onChange={(e) => setForm({ ...form, businessModel: e.target.value })}
                className="pink-admin-select"
              >
                <option value="resell">🌸 Resell / Pre-loved Item</option>
                <option value="manufactured">✨ Eves Era Original (Manufactured)</option>
              </select>
            </div>

            <div className="input-group-field">
              <label>Product Title Name</label>
              <input
                placeholder="e.g. Silk Wrap Maxi Dress"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="pink-admin-input"
              />
            </div>

            <div className="form-row-double">
              <div className="input-group-field">
                <label>Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="pink-admin-select"
                >
                  <option value="">Select Boutique Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="input-group-field">
                <label>Listing Price (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 1850"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="pink-admin-input"
                />
              </div>
            </div>

            <div className="form-row-double">
              <div className="input-group-field">
                <label>Sizes (Comma-separated)</label>
                <input
                  placeholder="S, M, L, XL"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className="pink-admin-input"
                />
              </div>

              <div className="input-group-field">
                <label>Colors (Comma-separated)</label>
                <input
                  placeholder="Blush Pink, Soft Rose"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  className="pink-admin-input"
                />
              </div>
            </div>

            <div className="form-row-double">
              <div className="input-group-field">
                <label>Inventory Stock count</label>
                <input
                  type="number"
                  placeholder="10"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="pink-admin-input"
                />
              </div>

              {form.businessModel === "resell" ? (
                <div className="input-group-field">
                  <label>Supplier Vendor Name</label>
                  <input
                    placeholder="e.g. Bombay Curations"
                    value={form.supplierName}
                    onChange={(e) => setForm({ ...form, supplierName: e.target.value })}
                    className="pink-admin-input"
                  />
                </div>
              ) : (
                <div className="input-group-field">
                  <label>Material Composition</label>
                  <input
                    placeholder="e.g. 80% Mulberry Silk, 20% Cotton"
                    value={form.materials}
                    onChange={(e) => setForm({ ...form, materials: e.target.value })}
                    className="pink-admin-input"
                  />
                </div>
              )}
            </div>

            <div className="input-group-field">
              <label>Description Details</label>
              <textarea
                placeholder="Outline product style, details, weave and material profile..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="pink-admin-textarea"
                rows={4}
              />
            </div>
          </div>

          {/* RIGHT: Image Upload */}
          <div className="form-upload-column">
            <label className="upload-header-lbl">Showcase Image</label>
            <div 
              className="dropzone-box"
              onClick={() => document.getElementById("productImageFile").click()}
            >
              {preview ? (
                <img src={preview} alt="Product showcase preview" className="dropzone-preview-img" />
              ) : (
                <div className="dropzone-msg">
                  <FaCloudUploadAlt className="upload-icon-form" />
                  <span>Click or drag image file here</span>
                  <span className="file-desc-lbl">PNG, JPG up to 5MB</span>
                </div>
              )}
            </div>
            <input
              type="file"
              id="productImageFile"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />

            <button className="submit-form-btn" onClick={handleSubmit}>
              <FaPlus /> List Fashion Piece
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;

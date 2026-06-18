import API_BASE_URL from '../api';
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import "./AddProduct.css"; // Reuse styling

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    businessModel: "manufactured",
    materials: "",
    sizes: "",
    colors: "",
    stock: "",
    supplierName: ""
  });
  const [images, setImages] = useState([]);
  const [currentImages, setCurrentImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  const priceRef = useRef(null);

  const adminEmail = "admin@gmail.com";

  useEffect(() => {
    // Fetch categories
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setCategories(data);
        }
      });

    // Fetch product details
    fetch(`${API_BASE_URL}/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          name: data.name || "",
          category: data.category || "",
          price: data.price || "",
          description: data.description || "",
          businessModel: data.businessModel || "manufactured",
          materials: data.materials || "",
          sizes: Array.isArray(data.sizes) ? data.sizes.join(", ") : (data.sizes || "S, M, L, XL"),
          colors: Array.isArray(data.colors) ? data.colors.join(", ") : (data.colors || "Pink, Rose, Dusty Mauve"),
          stock: data.stock !== undefined ? String(data.stock) : "15",
          supplierName: data.supplierName || ""
        });
        setCurrentImages(data.images || (data.image ? [data.image] : []));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product", err);
        setLoading(false);
      });
  }, [id]);

  // Add multiple images, avoid duplicates by name+size
  const handleImagesChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const existing = new Set(images.map((i) => i.file.name + i.file.size));
    const slotsLeft = Math.max(0, 5 - images.length);
    const toAdd = newFiles
      .filter((f) => !existing.has(f.name + f.size))
      .slice(0, slotsLeft)
      .map((file) => ({ file, preview: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...toAdd]);
    // reset input so the same file can be re-added after removal
    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeCurrentImage = (imagePath) => {
    setCurrentImages((prev) => prev.filter((img) => img !== imagePath));
  };

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.name || !form.name.trim()) {
      newErrors.name = "Product title name is required.";
    }
    if (!form.category) {
      newErrors.category = "Boutique category is required.";
    }
    if (!form.price) {
      newErrors.price = "Listing price is required.";
    } else if (Number(form.price) <= 0) {
      newErrors.price = "Listing price must be greater than zero.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Focus the first invalid input field
      if (newErrors.name && nameRef.current) {
        nameRef.current.focus();
      } else if (newErrors.category && categoryRef.current) {
        categoryRef.current.focus();
      } else if (newErrors.price && priceRef.current) {
        priceRef.current.focus();
      }
      return;
    }

    setErrors({});
    setIsSubmitting(true);

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
    
    // Append all newly selected images with "images" field name
    images.forEach(({ file }) => {
      formData.append("images", file);
    });

    if (images.length === 0 && currentImages.length > 0) {
      formData.append("images", currentImages[0]);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/product/${id}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        alert("Product updated in Eves Era boutique!");
        navigate("/admin?tab=products");
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Update Product Error:", err);
      alert("Failed to save product changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="add-product-page">
        <div className="loading-state" style={{ padding: '100px 0' }}>
          <div className="spinner-pink"></div>
          <p>Retrieving product details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Return to Dashboard
      </button>

      <div className="form-card-container">
        <h2>Modify Listed Fashion Piece</h2>
        <p className="form-sub-header">Update specifications, pricing, inventory, and supplier logs.</p>

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
                <option value="resell">Eves Era</option>
                <option value="manufactured">Eves Era</option>
              </select>
            </div>

            <div className="input-group-field">
              <label>Product Title Name <span className="required-asterisk">*</span></label>
              <input
                ref={nameRef}
                placeholder="e.g. Silk Wrap Maxi Dress"
                value={form.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`pink-admin-input ${errors.name ? "input-error" : ""}`}
              />
              {errors.name && <span className="field-error-msg">{errors.name}</span>}
            </div>

            <div className="form-row-double">
              <div className="input-group-field">
                <label>Category <span className="required-asterisk">*</span></label>
                <select
                  ref={categoryRef}
                  value={form.category}
                  onChange={(e) => handleInputChange("category", e.target.value)}
                  className={`pink-admin-select ${errors.category ? "input-error" : ""}`}
                >
                  <option value="">Select Boutique Category</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>{c.name}</option>
                  ))}
                </select>
                {errors.category && <span className="field-error-msg">{errors.category}</span>}
              </div>

              <div className="input-group-field">
                <label>Listing Price (₹) <span className="required-asterisk">*</span></label>
                <input
                  ref={priceRef}
                  type="number"
                  placeholder="e.g. 1850"
                  value={form.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  className={`pink-admin-input ${errors.price ? "input-error" : ""}`}
                />
                {errors.price && <span className="field-error-msg">{errors.price}</span>}
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
            <label className="upload-header-lbl">Showcase Images (Up to 5)</label>
            
            {/* Current Images */}
            {currentImages.length > 0 && (
              <div className="images-grid">
                <p className="gallery-label">Current Images</p>
                {currentImages.map((imgPath, idx) => (
                  <div key={idx} className="image-thumbnail">
                    <img
                      src={`${API_BASE_URL}${imgPath}`}
                      alt={`Current product ${idx + 1}`}
                      className="thumbnail-img"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeCurrentImage(imgPath)}
                      title="Remove image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Images to Upload */}
            {images.length > 0 && (
              <div className="images-grid">
                <p className="gallery-label">New Images to Upload</p>
                {images.map(({ preview }, idx) => (
                  <div key={idx} className="image-thumbnail">
                    <img
                      src={preview}
                      alt={`New product ${idx + 1}`}
                      className="thumbnail-img"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeImage(idx)}
                      title="Remove image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Area */}
            {currentImages.length + images.length < 5 && (
              <div
                className="dropzone-box"
                onClick={() => document.getElementById("productImageFile").click()}
              >
                <div className="dropzone-msg">
                  <FaCloudUploadAlt className="upload-icon-form" />
                  <span>Click or drag image files here</span>
                  <span className="file-desc-lbl">PNG, JPG up to 5MB • Max 5 images total</span>
                </div>
              </div>
            )}
            
            <input
              type="file"
              id="productImageFile"
              hidden
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />

            <button className="submit-form-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Specifications Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;


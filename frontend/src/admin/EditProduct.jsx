import API_BASE_URL from '../api';
import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaCloudUploadAlt } from "react-icons/fa";
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
    businessModel: "resell",
    materials: "",
    sizes: "",
    colors: "",
    stock: "",
    supplierName: ""
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [currentImage, setCurrentImage] = useState("");
  const [loading, setLoading] = useState(true);
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
          businessModel: data.businessModel || "resell",
          materials: data.materials || "",
          sizes: Array.isArray(data.sizes) ? data.sizes.join(", ") : (data.sizes || "S, M, L, XL"),
          colors: Array.isArray(data.colors) ? data.colors.join(", ") : (data.colors || "Pink, Rose, Dusty Mauve"),
          stock: data.stock !== undefined ? String(data.stock) : "15",
          supplierName: data.supplierName || ""
        });
        setCurrentImage(data.image);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product", err);
        setLoading(false);
      });
  }, [id]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
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
        navigate("/admin");
      } else {
        alert(data.message || "Failed to update product");
      }
    } catch (err) {
      console.error("Update Product Error:", err);
      alert("Failed to save product changes.");
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
                <option value="resell">🌸 Resell / Pre-loved Item</option>
                <option value="manufactured">✨ Eves Era Original (Manufactured)</option>
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
            <label className="upload-header-lbl">Showcase Image</label>
            <div 
              className="dropzone-box"
              onClick={() => document.getElementById("productImageFile").click()}
            >
              {preview ? (
                <img src={preview} alt="Product showcase preview" className="dropzone-preview-img" />
              ) : currentImage ? (
                <img src={`${API_BASE_URL}${currentImage}`} alt="Current product" className="dropzone-preview-img" />
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
              Save Specifications Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;

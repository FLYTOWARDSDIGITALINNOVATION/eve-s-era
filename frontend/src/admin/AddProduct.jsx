import API_BASE_URL from '../api';
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlus, FaCloudUploadAlt, FaTimes } from "react-icons/fa";
import "./AddProduct.css";

const AddProduct = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    businessModel: "manufactured",
    materials: "",
    sizes: "",        // optional — empty by default
  });

  // Multi-image state: array of { file, preview }
  const [images, setImages] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const nameRef = useRef(null);
  const categoryRef = useRef(null);
  const priceRef = useRef(null);

  const adminEmail = "admin@gmail.com";
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      });
  }, []);

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

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: null });
  };

  const handleSubmit = async () => {
    const newErrors = {};
    if (!form.name || !form.name.trim()) newErrors.name = "Product title name is required.";
    if (!form.category) newErrors.category = "Boutique category is required.";
    if (!form.price) newErrors.price = "Listing price is required.";
    else if (Number(form.price) <= 0) newErrors.price = "Listing price must be greater than zero.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      if (newErrors.name && nameRef.current) nameRef.current.focus();
      else if (newErrors.category && categoryRef.current) categoryRef.current.focus();
      else if (newErrors.price && priceRef.current) priceRef.current.focus();
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
    formData.append("sizes", form.sizes);     // may be empty string — that's fine
    formData.append("email", adminEmail);

    // Append all selected images
    images.forEach(({ file }) => {
      formData.append("images", file);
    });
    // Keep backward-compat: also send first image as "image"
    if (images.length > 0) {
      formData.append("image", images[0].file);
    }

    try {
      const res = await fetch(`${API_BASE_URL}/admin/product`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData,
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { message: await res.text() };
      if (!res.ok) {
        throw new Error(data.message || "Failed to save product.");
      }
      alert(data.message || "Product listed in Eve's Era catalogue successfully!");
      if (res.ok) navigate("/admin?tab=products");
    } catch (err) {
      console.error("Add Product Error:", err);
      alert(err.message || "Failed to save product.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-product-page animate-fade-in">
      <button className="back-btn" onClick={() => navigate(-1)}>
        <FaArrowLeft /> Return to Dashboard
      </button>

      <div className="form-card-container">
        <h2>List New Fashion Piece</h2>
        <p className="form-sub-header">Add premium boutique fashion pieces to Eves Era.</p>

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
                <label>
                  Sizes <span className="optional-label">(optional)</span>
                </label>
                <input
                  placeholder="e.g. S, M, L, XL or leave blank"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  className="pink-admin-input"
                />
              </div>

              
            </div>

            {/* Material composition — only for manufactured */}
            {form.businessModel === "manufactured" && (
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

          {/* RIGHT: Multi-Image Upload */}
          <div className="form-upload-column">
            <label className="upload-header-lbl">
              Showcase Images <span className="optional-label">(up to 5)</span>
            </label>

            {/* Dropzone */}
            <div
              className="dropzone-box multi-dropzone"
              onClick={() => document.getElementById("productImagesInput").click()}
            >
              <div className="dropzone-msg">
                <FaCloudUploadAlt className="upload-icon-form" />
                <span>Click to add images</span>
                <span className="file-desc-lbl">PNG, JPG — select multiple at once</span>
              </div>
            </div>

            <input
              type="file"
              id="productImagesInput"
              hidden
              accept="image/*"
              multiple
              onChange={handleImagesChange}
            />

            {/* Thumbnails Grid */}
            {images.length > 0 && (
              <div className="multi-img-preview-grid">
                {images.map((img, idx) => (
                  <div key={idx} className="thumb-wrapper">
                    <img src={img.preview} alt={`preview-${idx}`} className="thumb-img" />
                    {idx === 0 && <span className="thumb-primary-badge">Main</span>}
                    <button
                      className="thumb-remove-btn"
                      onClick={() => removeImage(idx)}
                      title="Remove image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
                {/* Add more tile if under 5 */}
                {images.length < 5 && (
                  <div
                    className="thumb-add-more"
                    onClick={() => document.getElementById("productImagesInput").click()}
                    title="Add more images"
                  >
                    <FaPlus />
                    <span>Add more</span>
                  </div>
                )}
              </div>
            )}

            <button className="submit-form-btn" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Listing Fashion Piece..." : <><FaPlus /> List Fashion Piece</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;



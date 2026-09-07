import API_BASE_URL from '../api';
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, FaImage, FaUpload, FaTrashAlt, 
  FaPen, FaTimes, FaCheck, FaLayerGroup,
  FaExclamationTriangle, FaCheckCircle, FaExclamationCircle
} from "react-icons/fa";
import "./AddCategory.css";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, catId: null, catName: "" });
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/categories?t=${Date.now()}`);
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Cancel edit mode
  const handleCancelEdit = () => {
    setName("");
    setEditId(null);
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Populate form for editing
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
    setImageFile(null);
    if (cat.image) {
      setImagePreview(cat.image.startsWith("http") ? cat.image : `${API_BASE_URL}${cat.image}`);
    } else {
      setImagePreview(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Add or Update category
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert("Please enter a category name");
      return;
    }

    const token = localStorage.getItem("token");
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("email", "admin@gmail.com");
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (editId && !imagePreview) {
        // Image was cleared by user
        formData.append("image", "");
      }

      const url = editId
        ? `${API_BASE_URL}/admin/category/${editId}`
        : `${API_BASE_URL}/admin/category`;
      const method = editId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          "x-admin-email": "admin@gmail.com"
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save category");
      }

      handleCancelEdit();
      await fetchCategories();
      showToast(editId ? "Category updated successfully!" : "Category created successfully!", "success");
    } catch (err) {
      showToast(err.message || "An error occurred", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // Open / Close Delete Confirmation Modal
  const openDeleteModal = (cat) => {
    setDeleteModal({ isOpen: true, catId: cat._id, catName: cat.name });
  };

  const closeDeleteModal = () => {
    if (deleting) return;
    setDeleteModal({ isOpen: false, catId: null, catName: "" });
  };

  // Confirm delete category
  const handleConfirmDelete = async () => {
    if (!deleteModal.catId) return;
    setDeleting(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_BASE_URL}/admin/category/${deleteModal.catId}`, {
        method: "DELETE",
        headers: { 
          Authorization: `Bearer ${token}`,
          "x-admin-email": "admin@gmail.com"
        }
      });

      if (res.ok) {
        const deletedName = deleteModal.catName;
        const deletedId = deleteModal.catId;
        closeDeleteModal();
        if (editId === deletedId) {
          handleCancelEdit();
        }
        await fetchCategories();
        showToast(`Category "${deletedName}" was successfully deleted!`, "success");
      } else {
        const data = await res.json();
        showToast(data.message || "Failed to delete category", "error");
      }
    } catch (err) {
      console.error(err);
      showToast("Error deleting category", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="add-category-page animate-fade-in">
      {/* Back Arrow */}
      <button className="back-btn" onClick={() => navigate("/admin")}>
        <FaArrowLeft /> Back to Dashboard
      </button>

      <div className="category-header-wrap">
        <div className="header-icon-circle">
          <FaLayerGroup />
        </div>
        <h2>{editId ? "Edit Category" : "Add New Category"}</h2>
        <p className="header-subtitle">
          {editId 
            ? "Update the category name or replace its showcase image" 
            : "Create boutique collections and assign showcase images seen on the Home page"}
        </p>
      </div>

      {/* Add / Edit Form */}
      <form className="category-form-card" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Category Name *</label>
          <input
            type="text"
            className="category-name-input"
            placeholder="e.g. Designer Sarees, Co-ord Sets, Western Wear"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category Showcase Image</label>
          <p className="image-help-text">
            This image is displayed on the Home page category cards.
          </p>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            id="cat-image-file"
            style={{ position: "absolute", opacity: 0, width: 1, height: 1, pointerEvents: "none" }}
          />

          {imagePreview ? (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Category Preview" className="category-image-preview" />
              <div className="image-preview-overlay">
                <label
                  htmlFor="cat-image-file"
                  className="change-image-btn"
                  style={{ cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }}
                >
                  <FaUpload /> Change Image
                </label>
                <button
                  type="button"
                  className="remove-image-btn"
                  onClick={handleRemoveImage}
                >
                  <FaTimes /> Remove
                </button>
              </div>
            </div>
          ) : (
            <label 
              htmlFor="cat-image-file" 
              className="image-dropzone"
              style={{ cursor: "pointer", display: "block" }}
            >
              <FaImage className="dropzone-icon" />
              <p className="dropzone-title">Click to upload category image</p>
              <span className="dropzone-hint">PNG, JPG, WEBP up to 5MB</span>
              <div style={{ marginTop: "12px" }}>
                <span className="browse-files-btn">
                  <FaUpload /> Choose Image
                </span>
              </div>
            </label>
          )}
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-category-btn"
            disabled={submitting}
          >
            {submitting ? "Saving..." : (editId ? <><FaCheck /> Update Category</> : <><FaUpload /> Add Category</>)}
          </button>

          {editId && (
            <button 
              type="button" 
              className="cancel-edit-btn"
              onClick={handleCancelEdit}
            >
              <FaTimes /> Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Category List */}
      <div className="category-list-section">
        <div className="list-header-row">
          <h3 className="list-title">Existing Categories ({categories.length})</h3>
        </div>

        {loading ? (
          <div className="cat-loading">Loading categories...</div>
        ) : categories.length === 0 ? (
          <div className="no-cat-box">No categories added yet.</div>
        ) : (
          <div className="category-cards-grid">
            {categories.map((cat) => {
              const catImg = cat.image
                ? (cat.image.startsWith("http") ? cat.image : `${API_BASE_URL}${cat.image}`)
                : null;

              const isCurrentEditing = editId === cat._id;

              return (
                <div 
                  key={cat._id} 
                  className={`category-item-card ${isCurrentEditing ? "is-editing" : ""}`}
                >
                  <div className="cat-card-thumb-wrap">
                    {catImg ? (
                      <img src={catImg} alt={cat.name} className="cat-item-thumb" />
                    ) : (
                      <div className="cat-item-thumb-placeholder">
                        <FaImage />
                      </div>
                    )}
                  </div>

                  <div className="cat-card-info">
                    <span className="cat-name-label">{cat.name}</span>
                    <span className="cat-status-badge">
                      {cat.image ? "Custom Image" : "Default Fallback"}
                    </span>
                  </div>

                  <div className="actions">
                    <button 
                      className="edit-btn" 
                      onClick={() => handleEdit(cat)}
                      title="Edit Category"
                    >
                      <FaPen size={12} /> Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => openDeleteModal(cat)}
                      title="Delete Category"
                    >
                      <FaTrashAlt size={12} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal Popup */}
      {deleteModal.isOpen && (
        <div className="custom-modal-backdrop" onClick={closeDeleteModal}>
          <div className="custom-modal-card animate-zoom-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-danger">
              <FaExclamationTriangle />
            </div>
            <h3 className="modal-title">Delete Category?</h3>
            <p className="modal-desc">
              Are you sure you want to delete <strong>"{deleteModal.catName}"</strong>?
              <br />
              This category will be permanently removed.
            </p>
            <div className="modal-action-buttons">
              <button 
                type="button" 
                className="modal-cancel-btn" 
                onClick={closeDeleteModal}
                disabled={deleting}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="modal-confirm-delete-btn" 
                onClick={handleConfirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : <><FaTrashAlt /> Yes, Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Popup */}
      {toast && (
        <div className={`toast-notification ${toast.type} animate-slide-in`}>
          {toast.type === "success" ? <FaCheckCircle className="toast-icon" /> : <FaExclamationCircle className="toast-icon" />}
          <span className="toast-text">{toast.message}</span>
          <button className="toast-close-btn" onClick={() => setToast(null)}>
            <FaTimes />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddCategory;




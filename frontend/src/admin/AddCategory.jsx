import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCategory.css";

const ADMIN_EMAIL = "admin@gmail.com";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState([]);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  // Fetch categories
  const fetchCategories = async () => {
    const res = await fetch("http://localhost:5000/categories");
    const data = await res.json();
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add or Update category
  const handleSubmit = async () => {
    if (!name) return;

    const token = localStorage.getItem("token");

    if (editId) {
      await fetch(`http://localhost:5000/admin/category/${editId}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, email: ADMIN_EMAIL }),
      });
      setEditId(null);
    } else {
      await fetch("http://localhost:5000/admin/category", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ name, email: ADMIN_EMAIL }),
      });
    }

    setName("");
    fetchCategories();
  };

  // Edit
  const handleEdit = (cat) => {
    setName(cat.name);
    setEditId(cat._id);
  };

  // Delete
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/admin/category/${id}`, {
      method: "DELETE",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ email: ADMIN_EMAIL }),
    });
    fetchCategories();
  };

  return (
    <div className="add-category-page">

      {/* Back Arrow */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <h2>Add Category</h2>

      {/* Add / Edit Form */}
      <div className="category-form">
        <input
          type="text"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {/* Category List */}
      <h3 className="list-title">Category Lists</h3>

      <ul className="category-list">
        {categories.map((cat) => (
          <li key={cat._id} className="category-item">
            <span>{cat.name}</span>

            <div className="actions">
              <button className="edit-btn" onClick={() => handleEdit(cat)}>
                Edit
              </button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(cat._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddCategory;

import API_BASE_URL from '../api';
import { useEffect, useState } from "react";

export default function Categories() {
  const [dbCategories, setDbCategories] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setDbCategories(data))
      .catch((err) => console.error("Category fetch error:", err));
  }, []);

  return (
    <div className="categories">
      {/* Static header – keep this */}
      <span>☰ All Categories</span>

      {/* Static categories (optional – you can remove later if needed) */}
      <span>Electronics</span>
      <span>Fashion</span>
      <span>Home & Living</span>
      <span>Books</span>
      <span>Sports</span>
      <span>Beauty</span>
      <span>Toys</span>
      <span>Automotive</span>

      {/* Dynamic categories from DB */}
      {dbCategories.map((cat) => (
        <span key={cat._id}>{cat.name}</span>
      ))}
    </div>
  );
}




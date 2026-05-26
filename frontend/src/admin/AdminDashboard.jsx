import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCoins, FaBoxOpen, FaInbox, FaUsers, FaArrowLeft, FaSignOutAlt, 
  FaTags, FaTools, FaChartBar, FaPlus, FaTrashAlt, FaPen, FaFileInvoiceDollar, FaGift
} from "react-icons/fa";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  // Statistical states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Supplier registry mock data
  const suppliers = [
    { id: 1, name: "Bombay Couture Importers", contact: "+91 98765 43210", category: "Silks & Sarees", status: "Active" },
    { id: 2, name: "Atelier Cotton Mills", contact: "+91 99887 76655", category: "Organic Cottons", status: "Active" }
  ];

  // Materials & production mock data
  const materials = [
    { name: "Mulberry Silk weave", stock: "120 meters", status: "Optimal" },
    { name: "Premium French Linen", stock: "45 meters", status: "Low Stock" },
    { name: "Organic Knit Wool", stock: "200 meters", status: "Optimal" }
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user || !user.isAdmin) {
      navigate("/auth");
      return;
    }

    // Fetch dashboard records
    Promise.all([
      fetch(`${API_BASE_URL}/admin/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()).catch(() => ({ orders: [] })),
      fetch(`${API_BASE_URL}/products`).then(res => res.json()).catch(() => [])
    ])
      .then(([ordersData, productsData]) => {
        setOrders(ordersData.orders || []);
        setProducts(productsData || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Dashboard statistics loading failed:", err);
        setLoading(false);
      });
  }, [navigate]);

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this fashion piece?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${API_BASE_URL}/admin/product/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p._id !== id));
        alert("Product removed from Eves Era.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  // Metrics math
  const revenue = orders.reduce((sum, o) => sum + (o.price * o.quantity || 0), 0);
  const pendingOrders = orders.filter(o => o.status === "Ordered").length;
  
  const resellCount = products.filter(p => p.businessModel === "resell" || !p.businessModel).length;
  const mfgCount = products.filter(p => p.businessModel === "manufactured").length;

  return (
    <div className="admin-page animate-fade-in">
      {/* Top Ribbon Header */}
      <div className="admin-navbar">
        <div className="admin-nav-logo" onClick={() => navigate("/home")}>
          <span className="logo-sparkle">🎀</span>
          <span>Eves Era Admin Center</span>
        </div>
        <div className="admin-nav-links">
          <button className="back-store-btn" onClick={() => navigate("/home")}>
            <FaArrowLeft /> View Storefront
          </button>
          <button className="logout-admin-btn" onClick={handleLogout}>
            <FaSignOutAlt /> Log Out
          </button>
        </div>
      </div>

      <div className="admin-main-layout">
        {/* SIDEBAR TABS */}
        <aside className="admin-sidebar-menu">
          <button className={`tab-menu-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>
            <FaChartBar /> <span>Performance Overview</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "products" ? "active" : ""}`} onClick={() => setActiveTab("products")}>
            <FaTags /> <span>Product Listings</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => navigate("/admin/orders")}>
            <FaBoxOpen /> <span>Placed Orders</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "suppliers" ? "active" : ""}`} onClick={() => setActiveTab("suppliers")}>
            <FaUsers /> <span>Suppliers Registry</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "support" ? "active" : ""}`} onClick={() => navigate("/admin/support")}>
            <FaInbox /> <span>Customer Support</span>
          </button>
        </aside>

        {/* MAIN DASHBOARD SCREEN */}
        <main className="admin-content-screen">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-pink"></div>
              <p>Analyzing company records...</p>
            </div>
          ) : (
            <>
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="overview-tab-view animate-fade-in">
                  <h2>Company Metrics Dashboard</h2>
                  <p className="admin-subtitle">Live corporate insights across self-manufacturing and reseller networks.</p>

                  {/* 4 Cards Grid */}
                  <div className="metrics-cards-grid">
                    <div className="metric-card shadow-sm">
                      <div className="m-card-header">
                        <span className="m-icon rev-col"><FaFileInvoiceDollar /></span>
                        <span className="m-title">Gross Revenue</span>
                      </div>
                      <h3>₹{revenue.toLocaleString()}</h3>
                      <p className="m-growth">📈 +12% this month</p>
                    </div>

                    <div className="metric-card shadow-sm">
                      <div className="m-card-header">
                        <span className="m-icon ord-col"><FaBoxOpen /></span>
                        <span className="m-title">Total Orders</span>
                      </div>
                      <h3>{orders.length}</h3>
                      <p className="m-growth">🛍️ {pendingOrders} pending delivery</p>
                    </div>

                    <div className="metric-card shadow-sm">
                      <div className="m-card-header">
                        <span className="m-icon prd-col"><FaTags /></span>
                        <span className="m-title">Catalog Items</span>
                      </div>
                      <h3>{products.length}</h3>
                      <p className="m-growth">{mfgCount} Originals | {resellCount} Resell</p>
                    </div>

                    <div className="metric-card shadow-sm">
                      <div className="m-card-header">
                        <span className="m-icon mfg-col"><FaTools /></span>
                        <span className="m-title">Atelier Margin</span>
                      </div>
                      <h3>68.4%</h3>
                      <p className="m-growth">💖 High luxury profitability</p>
                    </div>
                  </div>

                  {/* Interactive SVG Profit & Sales Graph */}
                  <div className="graph-section-card shadow-sm">
                    <h3>Revenue Breakdown & Sales Analysis</h3>
                    <p className="graph-sub-desc">Atelier Manufactured vs. Pre-loved Resell sales metrics.</p>
                    
                    <div className="graph-visual-wrapper">
                      <svg viewBox="0 0 800 240" className="dashboard-svg-chart">
                        {/* Grids */}
                        <line x1="50" y1="30" x2="750" y2="30" stroke="#fce7f3" strokeDasharray="4 4" />
                        <line x1="50" y1="90" x2="750" y2="90" stroke="#fce7f3" strokeDasharray="4 4" />
                        <line x1="50" y1="150" x2="750" y2="150" stroke="#fce7f3" strokeDasharray="4 4" />
                        <line x1="50" y1="210" x2="750" y2="210" stroke="#f4b6c2" strokeWidth="1.5" />

                        {/* Manufactured Line Graph */}
                        <path 
                          d="M 50 180 Q 200 120 350 70 T 650 40 T 750 30" 
                          fill="none" 
                          stroke="#C48B9F" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                        />
                        <circle cx="350" cy="70" r="6" fill="#C48B9F" />
                        <circle cx="650" cy="40" r="6" fill="#C48B9F" />

                        {/* Resell Line Graph */}
                        <path 
                          d="M 50 200 Q 200 180 350 140 T 650 100 T 750 90" 
                          fill="none" 
                          stroke="#F4B6C2" 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                        />
                        <circle cx="350" cy="140" r="6" fill="#F4B6C2" />
                        <circle cx="650" cy="100" r="6" fill="#F4B6C2" />

                        {/* Labels */}
                        <text x="55" y="225" fill="#333" fontSize="10">Jan</text>
                        <text x="205" y="225" fill="#333" fontSize="10">Feb</text>
                        <text x="355" y="225" fill="#333" fontSize="10">Mar</text>
                        <text x="505" y="225" fill="#333" fontSize="10">Apr</text>
                        <text x="655" y="225" fill="#333" fontSize="10">May</text>
                        <text x="740" y="225" fill="#333" fontSize="10">Jun</text>
                      </svg>
                    </div>

                    <div className="graph-legends">
                      <div className="legend-item">
                        <span className="leg-color leg-mfg"></span>
                        <span>Eve's Era Originals (Manufactured)</span>
                      </div>
                      <div className="legend-item">
                        <span className="leg-color leg-resell"></span>
                        <span>Resell Curation (Bombay / Mumbai Suppliers)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PRODUCTS */}
              {activeTab === "products" && (
                <div className="overview-tab-view animate-fade-in">
                  <div className="section-header-row">
                    <div>
                      <h2>Fashion Inventory Catalog</h2>
                      <p className="admin-subtitle">Modify, delete or list new fashion articles.</p>
                    </div>
                    <button className="add-product-admin-btn" onClick={() => navigate("/admin/add-product")}>
                      <FaPlus /> List New Piece
                    </button>
                  </div>

                  <div className="admin-products-table-box">
                    <table className="admin-custom-table">
                      <thead>
                        <tr>
                          <th>Showcase</th>
                          <th>Title Name</th>
                          <th>Segment</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Controls</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map(p => (
                          <tr key={p._id}>
                            <td>
                              <img src={`${API_BASE_URL}${p.image}`} alt={p.name} className="table-prd-thumb" onError={(e) => {
                                e.target.src = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=150&q=80";
                              }} />
                            </td>
                            <td><strong>{p.name}</strong></td>
                            <td>
                              <span className={`table-badge ${p.businessModel === "manufactured" ? "mfg" : "resell"}`}>
                                {p.businessModel === "manufactured" ? "Original" : "Resell"}
                              </span>
                            </td>
                            <td>{p.category}</td>
                            <td>₹{p.price}</td>
                            <td>{p.stock || 10}</td>
                            <td>
                              <div className="table-controls-grp">
                                <button className="ctrl-btn edit-ctrl" onClick={() => navigate(`/admin/edit-product/${p._id}`)}>
                                  <FaPen size={12} />
                                </button>
                                <button className="ctrl-btn del-ctrl" onClick={() => handleDeleteProduct(p._id)}>
                                  <FaTrashAlt size={12} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: SUPPLIERS */}
              {activeTab === "suppliers" && (
                <div className="overview-tab-view animate-fade-in">
                  <h2>Bombay Supplier registry</h2>
                  <p className="admin-subtitle">Approved vendor entities supplying authenticated pre-loved luxury segments.</p>

                  <div className="admin-products-table-box">
                    <table className="admin-custom-table">
                      <thead>
                        <tr>
                          <th>Supplier ID</th>
                          <th>Supplier Entity</th>
                          <th>Contact Details</th>
                          <th>Materials Supplied</th>
                          <th>Registry Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {suppliers.map(s => (
                          <tr key={s.id}>
                            <td><strong>#VND-00{s.id}</strong></td>
                            <td><strong>{s.name}</strong></td>
                            <td>{s.contact}</td>
                            <td>{s.category}</td>
                            <td><span className="status-badge delivered">{s.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

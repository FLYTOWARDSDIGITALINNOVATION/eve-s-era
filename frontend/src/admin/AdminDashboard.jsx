import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { 
  FaCoins, FaBoxOpen, FaInbox, FaUsers, FaArrowLeft, FaSignOutAlt, 
  FaTags, FaTools, FaChartBar, FaPlus, FaTrashAlt, FaPen, FaFileInvoiceDollar, FaGift, FaLayerGroup, FaBars, FaTimes, FaImage
} from "react-icons/fa";
import "./AdminDashboard.css";
import logo from "../assets/logo1.png";
import AdminHeroBanners from "./AdminHeroBanners";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const urlTab = new URLSearchParams(location.search).get("tab") || "overview";
  const [activeTab, setActiveTab] = useState(urlTab);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Statistical states
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

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
      fetch(`${API_BASE_URL}/products`).then(res => res.json()).catch(() => []),
      fetch(`${API_BASE_URL}/admin/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      }).then(res => res.json()).catch(() => [])
    ])
      .then(([ordersData, productsData, usersData]) => {
        setOrders(ordersData.orders || []);
        setProducts(productsData || []);
        setCustomers(Array.isArray(usersData) ? usersData : []);
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
  
  const eveEraCount = products.length;

  return (
    <div className="admin-page animate-fade-in">
      {/* Top Ribbon Header */}
      <div className="admin-navbar">
        <div className="admin-navbar-left">
          <button className="admin-sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          <div className="admin-nav-logo" onClick={() => navigate("/home")} style={{ marginLeft: '4px' }}>
            <div style={{ height: '60px', width: '60px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
              <img src={logo} alt="Eve's Era Admin" style={{ maxHeight: '70%', maxWidth: '70%', objectFit: 'contain' }} />
            </div>
          </div>
        </div>
        <div className="admin-nav-links">
          <button className="back-store-btn" onClick={() => navigate("/home")}>
            <FaArrowLeft /> <span className="nav-btn-text">View Storefront</span>
          </button>
          <button className="logout-admin-btn" onClick={handleLogout}>
            <FaSignOutAlt /> <span className="nav-btn-text">Log Out</span>
          </button>
        </div>
      </div>

      <div className="admin-main-layout">
        {/* SIDEBAR TABS */}
        {sidebarOpen && <div className="admin-sidebar-overlay" onClick={() => setSidebarOpen(false)} />}
        <aside className={`admin-sidebar-menu ${sidebarOpen ? "sidebar-open" : ""}`}>
          <button className={`tab-menu-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => { setActiveTab("overview"); setSidebarOpen(false); }}>
            <FaChartBar /> <span>Performance Overview</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "products" ? "active" : ""}`} onClick={() => { setActiveTab("products"); setSidebarOpen(false); }}>
            <FaTags /> <span>Product Listings</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "orders" ? "active" : ""}`} onClick={() => { navigate("/admin/orders"); setSidebarOpen(false); }}>
            <FaBoxOpen /> <span>Placed Orders</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "suppliers" ? "active" : ""}`} onClick={() => { setActiveTab("suppliers"); setSidebarOpen(false); }}>
            <FaUsers /> <span>Suppliers Registry</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "support" ? "active" : ""}`} onClick={() => { navigate("/admin/support"); setSidebarOpen(false); }}>
            <FaInbox /> <span>Customer Support</span>
          </button>
          <button className={`tab-menu-btn`} onClick={() => { navigate("/admin/add-category"); setSidebarOpen(false); }}>
            <FaLayerGroup /> <span>Manage Categories</span>
          </button>
          <button className={`tab-menu-btn ${activeTab === "hero" ? "active" : ""}`} onClick={() => { setActiveTab("hero"); setSidebarOpen(false); }}>
            <FaImage /> <span>Hero Banners</span>
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
                  <p className="admin-subtitle">Live corporate insights across self-manufacturing and boutique operations.</p>

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
                      <p className="m-growth">{eveEraCount} Eves Era items</p>
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
                    <p className="graph-sub-desc">Eves Era sales metrics and atelier performance.</p>
                    
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

                        {/* Eves Era Line Graph */}
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
                        <span>Eve's Era (Manufactured)</span>
                      </div>
                      <div className="legend-item">
                        <span className="leg-color leg-boutique"></span>
                        <span>Eves Era Boutique Collection</span>
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
                                {"Eves Era"}
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
                  <h2>Registered Customers</h2>
                  <p className="admin-subtitle">View all registered customers and their accounts.</p>

                  <div className="admin-products-table-box">
                    <table className="admin-custom-table">
                      <thead>
                        <tr>
                          <th>User ID</th>
                          <th>Name</th>
                          <th>Email Address</th>
                          <th>Account Type</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {customers.map(c => (
                          <tr key={c._id}>
                            <td><strong>#{c._id.substring(c._id.length - 6)}</strong></td>
                            <td><strong>{c.name}</strong></td>
                            <td>{c.email}</td>
                            <td>{c.isAdmin ? "Admin" : "Customer"}</td>
                            <td><span className="status-badge delivered">Active</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 4: HERO BANNERS */}
              {activeTab === "hero" && (
                <AdminHeroBanners />
              )}

            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

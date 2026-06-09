import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import Footer from "../components/Footer";
import Header from "../components/Header";
import {
  FaUserCircle, FaBoxOpen, FaMapMarkerAlt,
  FaSignOutAlt, FaEdit, FaPlus,
  FaShoppingBag, FaShieldAlt, FaChevronRight,
  FaArrowLeft, FaCoins, FaBell, FaUndoAlt
} from "react-icons/fa";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { removeFromWishlist, setWishlist } = useWishlist();
  const { addToCart } = useCart();

  const userLocal = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;

  const userEmail = userLocal?.email;

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addressLabel, setAddressLabel] = useState("");
  const [addressText, setAddressText] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic"));

  // Mock Wallet and Notification Data
  const walletPoints = 650; 
  const notifications = [
    { id: 1, title: "Order Shipped! 📦", body: "Your Eves Era Silk Blouse is on its way.", date: "Today" },
    { id: 2, title: "Earned Reward Points! 🌸", body: "You earned 150 points from your last checkout.", date: "Yesterday" }
  ];
  const returns = [
    { id: "RET-9081", product: "Cashmere Sweater", status: "Refund Processed", amount: "₹1,450" }
  ];

  useEffect(() => {
    if (!userEmail) return;
    
    Promise.all([
      fetch(`${API_BASE_URL}/user/${userEmail}`).then(r => r.json()).catch(() => null),
      fetch(`${API_BASE_URL}/orders/${userEmail}`).then(r => r.json()).catch(() => []),
      fetch(`${API_BASE_URL}/wishlist/${userEmail}`).then(r => r.json()).catch(() => [])
    ])
      .then(([userData, ordersData, wishlistData]) => {
        const safeUser = userData && userData.email ? userData : userLocal;
        setUser(safeUser);
        setAddresses(safeUser?.addresses || []);
        setOrders(ordersData || []);
        setWishlist(wishlistData || []);
      })
      .catch(() => {
        setUser(userLocal);
      });
  }, [userEmail]);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleAddAddress = async () => {
    if (!addressText) return alert("Address required");

    const res = await fetch(`${API_BASE_URL}/user/address`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        label: addressLabel || "Other",
        address: addressText
      })
    });

    const data = await res.json();
    setAddresses(data.addresses || []);
    setShowAddressForm(false);
    setAddressLabel("");
    setAddressText("");
  };

  const handleChangePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    const res = await fetch(`${API_BASE_URL}/user/update-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: userEmail,
        currentPassword,
        newPassword
      })
    });

    const data = await res.json();
    alert(data.message || "Password updated");

    if (res.ok) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  if (!userEmail) {
    return (
      <div className="homepage">
        <Header />
        <div className="empty-state">
          <div className="empty-icon">🔒</div>
          <h3>Authentication Required</h3>
          <p>Please log in or register to inspect your customer profile details.</p>
          <button className="reset-empty-btn" onClick={() => navigate("/auth")}>Login Now</button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="homepage">
        <Header />
        <div className="loading-state" style={{ padding: '120px 0' }}>
          <div className="spinner-pink"></div>
          <p>Loading your boutique dashboard...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="profile-page-bg animate-fade-in">
      <Header />

      <div className="container profile-container">
        {/* SIDEBAR PANEL */}
        <aside className="profile-sidebar">
          <div className="profile-user-card">
            <div className="avatar-outer-container">
              <div className="avatar-wrapper">
                {profilePic ? (
                  <img src={profilePic} className="profile-avatar-img" alt="Profile" />
                ) : (
                  <FaUserCircle className="profile-avatar-placeholder" />
                )}
              </div>

              <button
                className="avatar-edit-btn"
                onClick={() => document.getElementById("avatarInput").click()}
              >
                <FaEdit size={12} />
              </button>

              <input
                type="file"
                id="avatarInput"
                hidden
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setProfilePic(reader.result);
                      localStorage.setItem("profilePic", reader.result);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>

            <h2>{user.name}</h2>
            <p className="user-meta">{user.email}</p>
          </div>

          <nav className="profile-side-nav">
            <button className="nav-btn" onClick={() => navigate("/orders")}>
              <FaBoxOpen /> <span>My Placed Orders</span> <FaChevronRight />
            </button>
            <button className="nav-btn logout-btn" onClick={logout}>
              <FaSignOutAlt /> <span>Log Out</span>
            </button>
          </nav>
        </aside>

        {/* MAIN DASHBOARD */}
        <main className="profile-content-area">
          
          {/* LOYALTY & REWARD POINTS */}
          <section className="profile-content-section reward-section-box">
            <div className="header-title">
              <FaCoins /> <h3>Eve's Reward Points</h3>
            </div>
            <div className="rewards-card-details">
              <div className="points-showcase">
                <span className="points-num">{walletPoints}</span>
                <span className="points-lbl">Available Points</span>
              </div>
              <div className="rewards-msg">
                <p><strong>1 Point = ₹1.00</strong> toward checkout discounts.</p>
                <p>Earn reward points with each Eve's Era purchase!</p>
              </div>
            </div>
          </section>

          {/* ORDERS */}
          <section className="profile-content-section">
            <div className="header-title">
              <FaShoppingBag /> <h3>Recent Orders</h3>
            </div>

            {orders.length === 0 ? (
              <div className="empty-section-placeholder">No orders registered yet</div>
            ) : (
              orders.slice(0, 3).map(order => (
                <div key={order._id} className="order-row-card">
                  <div>
                    <strong>{order.productName}</strong>
                    <p>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`status-badge ${order.status?.toLowerCase() || 'ordered'}`}>
                    {order.status}
                  </span>
                </div>
              ))
            )}
          </section>

          {/* RETURNS & REFUNDS */}
          <section className="profile-content-section">
            <div className="header-title">
              <FaUndoAlt /> <h3>Returns & Refunds</h3>
            </div>
            {returns.map(ret => (
              <div key={ret.id} className="order-row-card">
                <div>
                  <strong>{ret.product}</strong>
                  <p>Ticket ID: {ret.id}</p>
                </div>
                <div style={{ textAlignment: 'right' }}>
                  <span className="refund-amount">{ret.amount}</span>
                  <span className="status-badge refund-badge">{ret.status}</span>
                </div>
              </div>
            ))}
          </section>

          {/* NOTIFICATION FEED */}
          <section className="profile-content-section">
            <div className="header-title">
              <FaBell /> <h3>Inbox Alerts</h3>
            </div>
            <div className="notifications-list-box">
              {notifications.map(notif => (
                <div key={notif.id} className="notification-row">
                  <div className="notif-dot"></div>
                  <div className="notif-info">
                    <h4>{notif.title}</h4>
                    <p>{notif.body}</p>
                    <span className="notif-time">{notif.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* SAVED ADDRESSES */}
          <section className="profile-content-section">
            <div className="header-title">
              <FaMapMarkerAlt /> <h3>Delivery Addresses</h3>
            </div>

            {addresses.length === 0 ? (
              <div className="empty-section-placeholder">No addresses configured</div>
            ) : (
              <div className="addresses-grid-list">
                {addresses.map((a, i) => (
                  <div key={i} className="address-item-card">
                    <strong>📍 {a.label}</strong>
                    <p>{a.address}</p>
                  </div>
                ))}
              </div>
            )}

            <button className="add-new-btn" onClick={() => setShowAddressForm(true)}>
              <FaPlus /> Add New Address
            </button>

            {showAddressForm && (
              <div className="security-form-card animate-fade-in" style={{ marginTop: '16px' }}>
                <input
                  placeholder="Address Label (e.g. Home, Office)"
                  value={addressLabel}
                  onChange={e => setAddressLabel(e.target.value)}
                  className="profile-txt-input"
                />
                <textarea
                  placeholder="Street details, city, state, pincode"
                  value={addressText}
                  onChange={e => setAddressText(e.target.value)}
                  className="profile-txt-input"
                  rows={3}
                />
                <button className="update-pwd-btn" onClick={handleAddAddress}>Save Address</button>
              </div>
            )}
          </section>

          {/* SECURITY & PASSWORD */}
          <section className="profile-content-section">
            <div className="header-title">
              <FaShieldAlt /> <h3>Password & Credentials</h3>
            </div>

            <div className="security-form-card">
              <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="profile-txt-input" />
              <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="profile-txt-input" />
              <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="profile-txt-input" />
              <button className="update-pwd-btn" onClick={handleChangePassword}>Update Credentials</button>
            </div>
          </section>

        </main>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;

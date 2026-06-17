import API_BASE_URL from '../api';
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Package, Clock, Eye, Printer, X } from "lucide-react";
import "./AdminOrdersPage.css";

const STATUS_OPTIONS = [
  "Ordered",
  "Packed",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);

  // ✅ AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token || !user || !user.isAdmin) {
      navigate("/login");
    }
  }, [navigate]);

  // ✅ FETCH ORDERS
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      let url = `${API_BASE_URL}/admin/orders`;
      if (fromDate && toDate) {
        url += `?from=${fromDate}&to=${toDate}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch orders: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      console.log("Orders data:", data); // Debugging log

      if (data && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        console.error("Invalid data format:", data);
        setOrders([]);
      }
    } catch (err) {
      console.error("Failed to load orders", err);
      alert(`Error loading orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ UPDATE STATUS
  const updateStatus = async (id, status) => {
    const token = localStorage.getItem("token");

    await fetch(`${API_BASE_URL}/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  // ✅ PRINT FUNCTION
  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print invoices.");
      return;
    }
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Eve's Era - Invoice #${order._id?.slice(-6) || 'N/A'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&display=swap');
            body {
              font-family: 'Outfit', sans-serif;
              color: #333;
              margin: 0;
              padding: 20px;
              background-color: #fff;
            }
            .receipt-card {
              max-width: 650px;
              margin: 0 auto;
              border: 1px dashed #e4b6c2;
              border-radius: 12px;
              padding: 30px;
              background: #fff;
            }
            .receipt-header {
              text-align: center;
              border-bottom: 2px solid #f4b6c2;
              padding-bottom: 20px;
              margin-bottom: 25px;
            }
            .receipt-header h1 {
              margin: 0;
              font-size: 28px;
              color: #d15b76;
              letter-spacing: 1px;
              font-weight: 700;
              text-transform: uppercase;
            }
            .receipt-header p {
              margin: 5px 0 0 0;
              font-size: 14px;
              color: #777;
              font-weight: 300;
            }
            .receipt-title {
              font-size: 16px;
              font-weight: 600;
              color: #d15b76;
              border-bottom: 1px solid #f9ebed;
              padding-bottom: 6px;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .grid-2 {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 20px;
            }
            .info-group {
              margin-bottom: 8px;
              font-size: 14px;
            }
            .info-label {
              font-weight: 600;
              color: #666;
              display: inline-block;
              width: 100px;
            }
            .info-value {
              color: #111;
              display: inline-block;
            }
            .address-block {
              font-size: 14px;
              line-height: 1.5;
              background: #fffafb;
              border: 1px solid #f9ebed;
              border-radius: 8px;
              padding: 12px;
              color: #333;
            }
            .item-table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 15px;
              margin-bottom: 20px;
            }
            .item-table th {
              background-color: #fff0f2;
              border-bottom: 2px solid #f4b6c2;
              padding: 10px;
              font-size: 12px;
              font-weight: 600;
              color: #666;
              text-align: left;
              text-transform: uppercase;
            }
            .item-table td {
              padding: 12px 10px;
              border-bottom: 1px solid #f9ebed;
              font-size: 14px;
              color: #333;
            }
            .item-table .total-label {
              text-align: right;
              font-weight: 700;
              color: #d15b76;
            }
            .item-table .total-val {
              font-weight: 700;
              color: #d15b76;
              background-color: #fff0f2;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              font-size: 12px;
              color: #999;
              border-top: 1px solid #f9ebed;
              padding-top: 15px;
            }
            .print-actions {
              display: flex;
              justify-content: center;
              gap: 15px;
              margin-top: 25px;
            }
            .btn {
              background: linear-gradient(135deg, #f4b6c2, #d15b76);
              color: white;
              border: none;
              padding: 10px 24px;
              font-size: 14px;
              font-weight: 600;
              border-radius: 20px;
              cursor: pointer;
              box-shadow: 0 4px 6px rgba(0,0,0,0.05);
              text-transform: uppercase;
            }
            .btn-secondary {
              background: #f1f1f1;
              color: #555;
              border: 1px solid #ddd;
            }
            @media print {
              body { padding: 0; }
              .receipt-card { border: none; padding: 0; max-width: 100%; }
              .print-actions { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="receipt-card">
            <div class="receipt-header">
              <h1>Eve's Era</h1>
              <p>Order Delivery & Customer Details</p>
            </div>

            <div class="grid-2">
              <div>
                <div class="receipt-title">Order Information</div>
                <div class="info-group">
                  <span class="info-label">Order ID:</span>
                  <span class="info-value">#${order._id}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Order Date:</span>
                  <span class="info-value">${order.createdAt ? new Date(order.createdAt).toLocaleString() : 'N/A'}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Status:</span>
                  <span class="info-value">${order.status || 'Ordered'}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Payment:</span>
                  <span class="info-value" style="text-transform: uppercase;">${order.paymentMethod || 'cod'}</span>
                </div>
              </div>

              <div>
                <div class="receipt-title">Customer Information</div>
                <div class="info-group">
                  <span class="info-label">Name:</span>
                  <span class="info-value"><strong>${order.userName || 'Unknown'}</strong></span>
                </div>
                <div class="info-group">
                  <span class="info-label">Email:</span>
                  <span class="info-value">${order.userEmail || 'No Email'}</span>
                </div>
                <div class="info-group">
                  <span class="info-label">Phone:</span>
                  <span class="info-value">${order.shippingAddress?.phone || order.phone || '—'}</span>
                </div>
              </div>
            </div>

            <div class="receipt-title">Shipping Address</div>
            <div class="address-block">
              ${order.shippingAddress?.address ? `
                <strong>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</strong><br/>
                ${order.shippingAddress.address}
              ` : `<span style="color:#aaa;">No shipping address provided</span>`}
            </div>

            <div class="receipt-title">Product Details</div>
            <table class="item-table">
              <thead>
                <tr>
                  <th>Product Name</th>
                  <th>Qty</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${order.productName || 'Unknown Product'}</td>
                  <td>${order.quantity || 0}</td>
                  <td>₹${order.price || 0}</td>
                  <td>₹${(order.price * (order.quantity || 1)) || 0}</td>
                </tr>
                <tr>
                  <td colspan="3" class="total-label">Grand Total:</td>
                  <td class="total-val">₹${(order.price * (order.quantity || 1)) || 0}</td>
                </tr>
              </tbody>
            </table>

            <div class="footer">
              Thank you for managing orders with Eve's Era Admin Portal.
            </div>

            <div class="print-actions">
              <button class="btn btn-secondary" onclick="window.close()">Close</button>
              <button class="btn" onclick="window.print()">Print Invoice</button>
            </div>
          </div>

          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
              }, 300);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="admin-orders-page">
      <div className="ao-container">
        <div className="ao-header">
          <button className="back-btn" onClick={() => navigate("/admin")}>
            <ArrowLeft size={20} /> Back
          </button>
          <h2>Placed Orders</h2>
        </div>

        {/* 🔄 LOADING */}
        {loading && (
          <div className="loading-state">
            <Clock size={40} className="spin" />
            <p>Loading orders...</p>
          </div>
        )}

        {/* 📭 EMPTY */}
        {!loading && orders.length === 0 && (
          <div className="empty-state">
            <Package size={48} />
            <p>No orders found</p>
          </div>
        )}

        {/* 📦 TABLE */}
        {!loading && orders.length > 0 && (
          <>
            <div className="filter-bar">
              <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
              <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
              <button className="filter-btn" onClick={fetchOrders}>
                Filter
              </button>
            </div>

            <div className="table-wrapper">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Delivery Info</th>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td>#{o._id?.slice(-6) || 'N/A'}</td>
                      <td>
                        <b>{o.userName || 'Unknown'}</b>
                        <br />
                        <small>{o.userEmail || 'No Email'}</small>
                      </td>
                      <td>
                        <button
                          className="ao-view-details-btn"
                          onClick={() => setSelectedOrder(o)}
                          title="View Shipping & Contact Details"
                        >
                          <Eye size={16} />
                          <span>View Details</span>
                        </button>
                      </td>
                      <td>{o.productName || 'Unknown Product'}</td>
                      <td>{o.quantity || 0}</td>
                      <td>₹{o.price || 0}</td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleString() : 'N/A'}</td>
                      <td>
                        <select
                          value={o.status || "Ordered"}
                          className={`status-select ${(o.status || "ordered").toLowerCase()}`}
                          onChange={(e) => updateStatus(o._id, e.target.value)}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* 🧾 ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="ao-modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="ao-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="ao-modal-header">
              <h3>Order Details</h3>
              <button className="ao-close-btn" onClick={() => setSelectedOrder(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="ao-modal-body">
              <div className="ao-info-section">
                <h4>Customer Information</h4>
                <div className="ao-info-grid">
                  <div className="ao-info-label">Name:</div>
                  <div className="ao-info-value">{selectedOrder.userName || "N/A"}</div>
                  
                  <div className="ao-info-label">Email:</div>
                  <div className="ao-info-value">{selectedOrder.userEmail || "N/A"}</div>
                  
                  <div className="ao-info-label">Phone:</div>
                  <div className="ao-info-value">
                    {selectedOrder.shippingAddress?.phone || selectedOrder.phone || "—"}
                  </div>
                </div>
              </div>

              <div className="ao-info-section">
                <h4>Shipping Address</h4>
                <div className="ao-address-box">
                  {selectedOrder.shippingAddress?.address ? (
                    <>
                      <strong>
                        {selectedOrder.shippingAddress.firstName} {selectedOrder.shippingAddress.lastName}
                      </strong>
                      <p>{selectedOrder.shippingAddress.address}</p>
                    </>
                  ) : (
                    <span className="no-address">No Shipping Address Provided</span>
                  )}
                </div>
              </div>

              <div className="ao-info-section">
                <h4>Product Details</h4>
                <div className="ao-product-box">
                  <div className="ao-product-name">{selectedOrder.productName || "Unknown Product"}</div>
                  <div className="ao-product-details">
                    <span>Qty: <strong>{selectedOrder.quantity || 0}</strong></span>
                    <span>Price: <strong>₹{selectedOrder.price || 0}</strong></span>
                    <span>Total: <strong>₹{(selectedOrder.price * (selectedOrder.quantity || 1)) || 0}</strong></span>
                  </div>
                </div>
              </div>

              <div className="ao-info-section">
                <h4>Order Metadata</h4>
                <div className="ao-info-grid">
                  <div className="ao-info-label">Order ID:</div>
                  <div className="ao-info-value">#{selectedOrder._id}</div>

                  <div className="ao-info-label">Date:</div>
                  <div className="ao-info-value">
                    {selectedOrder.createdAt ? new Date(selectedOrder.createdAt).toLocaleString() : "N/A"}
                  </div>

                  <div className="ao-info-label">Payment:</div>
                  <div className="ao-info-value" style={{ textTransform: "uppercase" }}>
                    {selectedOrder.paymentMethod || "cod"}
                  </div>

                  <div className="ao-info-label">Status:</div>
                  <div className="ao-info-value">
                    <span className={`status-badge ${(selectedOrder.status || "Ordered").toLowerCase()}`}>
                      {selectedOrder.status || "Ordered"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="ao-modal-footer">
              <button className="ao-print-btn" onClick={() => handlePrint(selectedOrder)}>
                <Printer size={16} /> Print Receipt
              </button>
              <button className="ao-close-btn-secondary" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;




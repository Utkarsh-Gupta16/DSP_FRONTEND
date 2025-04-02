import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user on mount
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.role !== "admin") {
        setError("You are not authorized to access this page.");
        navigate("/count");
      } else {
        fetchOrders();
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/payment/orders", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data || []);
    } catch (err) {
      setError("Failed to fetch orders: " + (err.response?.data?.message || err.message));
      setOrders([]);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Welcome Message and Logout */}
      {user && (
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#28a745" }}>
            Welcome, Admin {user.name || "User"}
          </span>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#ff0000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}

      <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "20px" }}>
        Admin Dashboard - Manage Orders
      </h2>

      {orders.length === 0 ? (
        <p style={{ fontSize: "14px", color: "#666" }}>No orders found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                  Order Date
                </th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                  User
                </th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                  Total Companies
                </th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                  Price
                </th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                  Payment Method
                </th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                  Payment Intent ID
                </th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px", backgroundColor: "#f9f9f9", textAlign: "left" }}>
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {order.userId?.name || order.email || "Unknown User"}
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {order.totalCount?.toLocaleString() || "0"}
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {order.price ? (order.filters?.country?.label === "India" ? `₹${order.price}` : `$${order.price}`) : "0"}
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {order.paymentMethod || "-"}
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {order.paymentDetails?.paymentIntentId || "-"}
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    Successful
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
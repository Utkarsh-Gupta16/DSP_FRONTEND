import React from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const Header = ({ user, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div style={{ width: "250px", background: "#e6f0fa", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "14px", color: "#333" }}>April 17, 2025</span>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <img src="/assets/user-image.png" alt="User" style={{ width: "50px", height: "50px", borderRadius: "50%", marginBottom: "10px" }} />
        <span style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}>
          Welcome, {user?.name || user?.userName || "User"}!
        </span>
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          onClick={handleLogout}
          style={{
            background: "#007bff",
            color: "#fff",
            border: "none",
            padding: "8px 15px",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "14px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "5px",
          }}
        >
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
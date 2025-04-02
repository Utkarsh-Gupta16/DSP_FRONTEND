// src/Header/header.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Header = ({ user, setUser, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    navigate("/login", { state: { from: location.pathname } });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    if (onLogout) onLogout(); // Call the onLogout callback if provided
    navigate("/login");
  };

  return (
    <div style={{ marginBottom: "20px", textAlign: "right" }}>
      {user ? (
        <>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#28a745" }}>
            Welcome, {user.name || "User"}
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
        </>
      ) : (
        <button
          onClick={handleLogin}
          style={{
            padding: "5px 10px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Header;
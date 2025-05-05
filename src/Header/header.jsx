import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";

const Header = ({ user, setUser }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentTime, setCurrentTime] = useState(new Date());

  const navigate = useNavigate();

  // Update date every 24 hours
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 24 * 60 * 60 * 1000); // Every 24 hours

    return () => clearInterval(interval);
  }, []);

  // Update time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60 * 1000); // Every minute

    return () => clearInterval(interval);
  }, []);

  // Format date and time using currentTime to keep it updated
  const formattedDateTime = currentTime.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <div style={{ width: "250px", background: "#e6f0fa", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <span style={{ fontSize: "14px", color: "#333" }}>{formattedDateTime}</span>
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

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // For animations
import { FaCheckCircle } from "react-icons/fa"; // For a checkmark icon

const Success = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // 5-second countdown

  // Countdown timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/"); // Redirect to homepage after countdown
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)", // Gradient background
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          backgroundColor: "#fff",
          padding: "40px",
          borderRadius: "15px",
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)",
          textAlign: "center",
          maxWidth: "500px",
          width: "100%",
        }}
      >
        {/* Success Icon */}
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, yoyo: Infinity }}
        >
          <FaCheckCircle size={60} color="#28a745" />
        </motion.div>

        {/* Success Message */}
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            color: "#333",
            margin: "20px 0 10px",
          }}
        >
          Payment Successful!
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#666",
            marginBottom: "20px",
          }}
        >
          Thank you for your purchase! A CSV file with the company data will be sent to your email shortly.
        </p>

        {/* Countdown Timer */}
        <div
          style={{
            fontSize: "18px",
            color: "#333",
            marginBottom: "20px",
          }}
        >
          Redirecting to homepage in{" "}
          <motion.span
            style={{
              fontWeight: "bold",
              color: "#ff6200",
            }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            {countdown}
          </motion.span>{" "}
          seconds...
        </div>

        {/* Redirect Button (Optional) */}
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#ff6200",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#e55b00")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#ff6200")}
        >
          Go to Homepage Now
        </button>
      </motion.div>
    </div>
  );
};

export default Success;
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Download = () => {
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const downloadFile = async () => {
      try {
        // Check if the user is logged in by retrieving the token from localStorage
        const authToken = localStorage.getItem("token");
        if (!authToken) {
          // If not logged in, redirect to login page with a redirect URL
          navigate(`/login?redirect=/download/${token}`);
          return;
        }

        // Make an authenticated request to the download endpoint
        const response = await axios.get(`/api/payment/download/${token}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: "blob", // Important for downloading files
        });

        // Create a URL for the blob and trigger the download
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `companies_${token}.csv`);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
        window.URL.revokeObjectURL(url);

        // Redirect to homepage after download
        setTimeout(() => navigate("/"), 2000);
      } catch (err) {
        console.error("Error downloading file:", err);
        if (err.response?.status === 401) {
          // If unauthorized, redirect to login
          navigate(`/login?redirect=/download/${token}`);
        } else if (err.response?.status === 410) {
          setError("The download link has expired.");
        } else if (err.response?.status === 404) {
          setError("Download link not found.");
        } else {
          setError("An error occurred while downloading the file.");
        }
      } finally {
        setLoading(false);
      }
    };

    downloadFile();
  }, [token, navigate]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0f7fa 0%, #80deea 100%)",
        fontFamily: "Arial, sans-serif",
        padding: "20px",
      }}
    >
      <div
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
        {loading ? (
          <>
            <h1 style={{ fontSize: "24px", color: "#333", marginBottom: "20px" }}>
              Downloading Your File...
            </h1>
            <p style={{ fontSize: "16px", color: "#666" }}>
              Please wait while we prepare your file for download.
            </p>
          </>
        ) : error ? (
          <>
            <h1 style={{ fontSize: "24px", color: "#d9534f", marginBottom: "20px" }}>
              Error
            </h1>
            <p style={{ fontSize: "16px", color: "#666" }}>{error}</p>
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
                marginTop: "20px",
              }}
            >
              Go to Homepage
            </button>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: "24px", color: "#28a745", marginBottom: "20px" }}>
              Download Started
            </h1>
            <p style={{ fontSize: "16px", color: "#666" }}>
              Your file download should have started. If not, please try again.
            </p>
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
                marginTop: "20px",
              }}
            >
              Go to Homepage
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Download;
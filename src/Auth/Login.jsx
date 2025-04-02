import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotError, setForgotError] = useState("");
  const [forgotSuccess, setForgotSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const response = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      const from = location.state?.from || "/count";
      const action = location.state?.action;
      navigate(from, { state: { action } });
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (response) => {
    console.log("Google Sign-In successful in Login:", response);
    console.log("Token being sent to backend:", response.credential);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/google/verify",
        { token: response.credential },
        { withCredentials: true }
      );
      console.log("Google login successful:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const from = location.state?.from || "/count";
      const action = location.state?.action;
      navigate(from, { state: { action } });
    } catch (err) {
      console.error("Google login error in Login:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Google login failed.");
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed at client-side in Login");
    setError("Google login failed at client-side.");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "1085041803396-6b3fjsu79hdqc3eljmln9g9ceg55pm69.apps.googleusercontent.com", // Replace with the new Client ID
        callback: handleGoogleSuccess,
      });
      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { theme: "outline", size: "large" }
      );
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    setForgotError("");
    setForgotSuccess("");
    setIsSubmitting(true);
    try {
      const response = await axios.post("http://localhost:5000/api/users/forgot-password", {
        email: forgotEmail,
      });
      setForgotSuccess(response.data.message || "A password reset link has been sent to your email.");
      setForgotEmail("");
    } catch (err) {
      console.error("Forgot password error:", err.response?.data || err.message);
      setForgotError(err.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", textAlign: "center" }}>
      <h2>{showForgotPassword ? "Forgot Password" : "Login"}</h2>

      {!showForgotPassword ? (
        <>
          {error && <p style={{ color: "red" }}>{error}</p>}
          {success && <p style={{ color: "green" }}>{success}</p>}
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Email:</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: "10px 20px",
                backgroundColor: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </form>
          <div style={{ marginTop: "10px" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(true);
                setError("");
                setSuccess("");
              }}
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              Forgot Password?
            </a>
          </div>
          <div style={{ marginTop: "20px" }}>
            <p>Or login with:</p>
            <div id="googleSignInButton"></div>
          </div>
          <p style={{ marginTop: "20px" }}>
            Don’t have an account? <a href="/signup">Sign up here</a>
          </p>
        </>
      ) : (
        <>
          {forgotError && <p style={{ color: "red" }}>{forgotError}</p>}
          {forgotSuccess && <p style={{ color: "green" }}>{forgotSuccess}</p>}
          <form onSubmit={handleForgotPasswordSubmit}>
            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                Enter your email to reset your password:
              </label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
                disabled={isSubmitting}
                style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: "10px 20px",
                backgroundColor: isSubmitting ? "#ccc" : "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: isSubmitting ? "not-allowed" : "pointer",
              }}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          <div style={{ marginTop: "10px" }}>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(false);
                setForgotError("");
                setForgotSuccess("");
                setForgotEmail("");
              }}
              style={{ color: "#007BFF", textDecoration: "none" }}
            >
              Back to Login
            </a>
          </div>
        </>
      )}
    </div>
  );
};

export default Login;
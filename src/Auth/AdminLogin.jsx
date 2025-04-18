import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
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
      const response = await axios.post("https://dsp-backend.onrender.com/api/auth/login", {
        email,
        password,
      });
      console.log("Login successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin" && response.data.user.email === "admin@dataselling.com") {
        const from = location.state?.from || "/admin";
        const action = location.state?.action;
        navigate(from, { state: { action } });
      } else {
        setError("Unauthorized access. Only the admin can log in here.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };
  const handleGoogleSuccess = async (response) => {
    console.log("Google Sign-In successful in AdminLogin:", response);
    console.log("Token being sent to backend:", response.credential);
    setError("");
    setSuccess("");
    try {
      const res = await axios.post(
        "https://dsp-backend.onrender.com/api/auth/google/verify",
        { token: response.credential },
        { withCredentials: true }
      );
      console.log("Google login successful:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin" && res.data.user.email === "admin@dataselling.com") {
        const from = location.state?.from || "/admin";
        const action = location.state?.action;
        navigate(from, { state: { action } });
      } else {
        setError("Unauthorized access. Only the admin can log in here.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Google login error in AdminLogin:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Google login failed.");
    }
  };

  const handleGoogleError = () => {
    console.error("Google login failed at client-side in AdminLogin");
    setError("Google login failed at client-side.");
  };

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      window.google.accounts.id.initialize({
        client_id: "1085041803396-6b3fjsu79hdqc3eljmln9g9ceg55pm69.apps.googleusercontent.com",
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
      const response = await axios.post("https://dsp-backend.onrender.com/api/auth/forgot-password", {
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
    <div className="flex h-screen">
      {/* Left side: Login form */}
      <div className="w-1/2 flex flex-col justify-center px-20">
        <div className="flex justify-between items-center mb-10">
          
        </div>
  
        <h1 className="text-3xl font-bold mb-2">
          {showForgotPassword ? "Forgot Password" : "Admin Login"}
        </h1>
        <p className="text-gray-500 mb-6">
          {showForgotPassword ? "Reset your password" : "Login Your Account"}
        </p>
  
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
  
        {!showForgotPassword ? (
          <form onSubmit={handleSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E - Mail Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="wxyz@gmail.com"
              className="w-full mb-4 p-3 bg-gray-100 rounded-md"
            />
  
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="@#12345Amng"
              className="w-full mb-6 p-3 bg-gray-100 rounded-md"
            />
  
            <button
              type="submit"
              className="w-full bg-indigo-900 text-white py-3 rounded-md font-medium hover:bg-indigo-800"
            >
              Login
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPasswordSubmit}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter your email to reset your password:
            </label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              required
              disabled={isSubmitting}
              placeholder="wxyz@gmail.com"
              className="w-full mb-4 p-3 bg-gray-100 rounded-md"
            />
  
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 rounded-md font-medium ${
                isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-indigo-900 hover:bg-indigo-800 text-white"
              }`}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
  
        <div className="mt-4 text-sm">
          {!showForgotPassword ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(true);
                setError("");
                setSuccess("");
              }}
              className="text-indigo-600 hover:underline"
            >
              Forgot Password?
            </a>
          ) : (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setShowForgotPassword(false);
                setForgotError("");
                setForgotSuccess("");
                setForgotEmail("");
              }}
              className="text-indigo-600 hover:underline"
            >
              Back to Login
            </a>
          )}
        </div>
  
        {!showForgotPassword && (
          <>
            <div className="mt-6">
              <p className="text-sm">Or login with:</p>
              <div id="googleSignInButton" className="mt-2" />
            </div>
            <p className="mt-4 text-sm">
              Don’t have an account?{" "}
              <a href="/signup" className="text-indigo-600 hover:underline">
                Sign up here
              </a>
            </p>
          </>
        )}
      </div>
  
      {/* Right side: Illustration */}
      <div className="w-1/2 bg-indigo-900 flex items-center justify-center relative">
        <img
          src="/assets/illustration.svg"
          alt="illustration"
          className="w-3/4"
        />
        <img
          src="/assets/worldmap.svg"
          alt="map"
          className="absolute bottom-0 w-full opacity-10"
        />
      </div>
    </div>
  );
};

export default AdminLogin;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validatePassword = (pwd) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /[0-9]/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);

    if (pwd.length < minLength) return "Password must be at least 8 characters long.";
    if (!hasUpperCase) return "Password must contain at least one uppercase letter.";
    if (!hasLowerCase) return "Password must contain at least one lowercase letter.";
    if (!hasNumber) return "Password must contain at least one number.";
    if (!hasSpecialChar) return "Password must contain at least one special character (e.g., !@#$%^&*).";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post("https://dsp-backend.onrender.com/api/auth/register", {
        name,
        email,
        phone,
        password,
        role: "user",
      });
      console.log("Signup successful:", response.data);
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/count");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Signup failed. Please try again.");
    }
  };

  const handleGoogleSuccess = async (response) => {
    console.log("Google Sign-In successful in Signup:", response);
    console.log("Token being sent to backend:", response.credential);
    setError("");
    try {
      const res = await axios.post(
        "https://dsp-backend.onrender.com/api/auth/google/verify",
        { token: response.credential },
        { withCredentials: true }
      );
      console.log("Google login successful:", res.data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (res.data.user.role === "user") navigate("/count");
      else {
        setError("Unauthorized access. Please use the appropriate signup page.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (err) {
      console.error("Google login error in Signup:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Google login failed.");
    }
  };

  const handleGoogleError = () => {
    console.log("Google login failed at client-side in Signup");
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

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e3a8a', overflow: 'hidden' }}>
      {/* Left side: Illustration */}
      <div style={{ width: '50%', position: 'relative', padding: '80px' }}>
      <img
          src="/assets/signupillustration.svg"
          alt="Signup Illustration"
          style={{
            maxWidth: '80%',
            height: 'auto',
            position: 'absolute',
            top: '20%',
            left: '5%',
            zIndex: 1,
          }}
        />

        {/* World Map */}
        <img
          src="/assets/worldmap.svg"
          alt="World Map"
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            width: '100%',
            height: 'auto',
            opacity: 1,
            zIndex: 0,
          }}
        />
              </div>

      {/* Right side: Signup form */}
      <div style={{ width: '50%', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', maxHeight: '100vh', margin: '0px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e3a8a', marginBottom: '10px' }}>Registration</h2>
        <p style={{ color: '#6b7280', marginBottom: '20px', fontSize: '14px' }}>Create Your Account</p>

        {error && <p style={{ color: 'red', marginBottom: '15px', fontSize: '12px' }}>{error}</p>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxHeight: '70vh', overflowY: 'auto' }}>
          <label style={{ fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '5px' }}>Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Name"
            style={{ width: '100%', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '15px', border: '1px solid #d1d5db' }}
          />

          <label style={{ fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '5px' }}>E - Mail Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter Email"
            style={{ width: '100%', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '15px', border: '1px solid #d1d5db' }}
          />

          <label style={{ fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '5px' }}>Phone</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            placeholder="Phone"
            style={{ width: '100%', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '15px', border: '1px solid #d1d5db' }}
          />

          <label style={{ fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter Password"
            style={{ width: '100%', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '15px', border: '1px solid #d1d5db' }}
          />

          <label style={{ fontSize: '14px', fontWeight: 'medium', color: '#374151', marginBottom: '5px' }}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
            style={{ width: '100%', padding: '10px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '15px', border: '1px solid #d1d5db' }}
          />

          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
            <input type="checkbox" id="terms" required style={{ marginRight: '10px' }} />
            <label htmlFor="terms" style={{ fontSize: '12px', color: '#6b7280' }}>I accept the TERMS & CONDITIONS</label>
          </div>

          <button
            type="submit"
            style={{ width: '100%', padding: '12px', backgroundColor: '#1e3a8a', color: 'white', borderRadius: '4px', fontSize: '16px', fontWeight: 'medium', border: 'none', cursor: 'pointer', marginBottom: '15px' }}
          >
            Create Account
          </button>
        </form>

        <div style={{ marginTop: '20px' }}>
          <p style={{ fontSize: '14px' }}>Or sign up with:</p>
          <div id="googleSignInButton" style={{ marginTop: '10px' }} />
        </div>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#6b7280' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#1e3a8a', textDecoration: 'none' }}>
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
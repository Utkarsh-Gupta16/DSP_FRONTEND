import React, { Suspense, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Lazy Load Components
const CountDashboard = React.lazy(() => import("../src/countdashboard/countdashboard"));
const Login = React.lazy(() => import("../src/Auth/Login"));
const AdminLogin = React.lazy(() => import("../src/Auth/AdminLogin"));
const EmployeeLogin = React.lazy(() => import("../src/Auth/EmployeeLogin"));
const Signup = React.lazy(() => import("../src/Auth/SignUp"));
const EmployeeSignup = React.lazy(() => import("../src/Auth/EmployeeSignup"));
const Transaction = React.lazy(() => import("../src/Transaction/transaction"));
const AdminDashboard = React.lazy(() => import("../src/Admin/adminDashboard"));
const CompanyDetailsPage = React.lazy(() => import("../src/Admin/CompanyDetailsPage"));
const Success = React.lazy(() => import("../src/Transaction/Success"));
const ResetPassword = React.lazy(() => import("../src/Auth/ResetPassword"));
const EmployeeDashboard = React.lazy(() => import("../src/Employee/EmployeeDashboard")); // Add this import
const CompanyDetailsForm = React.lazy(() => import("../src/Employee/CompanyDetailsForm"));
const DemoPage=React.lazy(() => import("../src/countdashboard/demopage"));

const AuthCallback = () => {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const userId = params.get("userId");
    const name = params.get("name");
    const email = params.get("email");
    const role = params.get("role");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify({ id: userId, name, email, role }));
      console.log("Google Sign-In successful:", { userId, name, email, role });

      // Redirect based on role
      switch (role) {
        case "admin":
          window.location.href = "/admin";
          break;
        case "employee":
          window.location.href = "/employee-dashboard"; // Update to match new route
          break;
        case "user":
        default:
          window.location.href = "/count";
          break;
      }
    } else {
      console.error("No token found in callback");
      window.location.href = "/login";
    }
  }, [location]);

  return <div style={{ textAlign: "center", marginTop: "50px" }}>Processing Google Sign-In...</div>;
};

const stripePromise = loadStripe("pk_test_51R1S0AFtO5VILZ3TGjfQJUmr7YpQPqVK509QTDB5rRVgMDIJfJ6UsUMpuiSBXSEOU32yyQKIMnFf0YK5hgFS4VPa00YVeGYKJf");

const App = () => {
  return (
    <GoogleOAuthProvider clientId="1085041803396-6b3fjsu79hdqc3eljmln9g9ceg55pm69.apps.googleusercontent.com">
      <Router>
        <Suspense fallback={<div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>}>
          <Routes>
            {/* Home and Dashboard Routes */}
            <Route path="/" element={<CountDashboard stripePromise={stripePromise} />} />
            <Route path="/count" element={<CountDashboard stripePromise={stripePromise} />} />
            <Route path="/employee" element={<EmployeeDashboard />} /> {/* Add this route */}
            <Route path="/fill-details/:taskId" element={<CompanyDetailsForm />} />
            <Route path="/company-details/:id" element={<CompanyDetailsPage />} />
            <Route path="/demo" element={<DemoPage />} />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/employee-login" element={<EmployeeLogin />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/employee-signup" element={<EmployeeSignup />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Transaction Routes */}
            <Route path="/transaction" element={<Transaction stripePromise={stripePromise} />} />
            <Route path="/success" element={<Success />} />

            {/* Admin Route */}
            <Route path="/admin" element={<AdminDashboard />} />

            {/* Fallback Route */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                  <h1>Page Not Found</h1>
                  <p>The page you are looking for does not exist.</p>
                </div>
              }
            />
          </Routes>
        </Suspense>
      </Router>
    </GoogleOAuthProvider>
  );
};

export default App;
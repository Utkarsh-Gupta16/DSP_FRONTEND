// Transaction.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// Child component to handle the payment form
const PaymentForm = ({ onSubmit, loading, error, setError }) => {
  const stripe = useStripe();
  const elements = useElements();

  const handlePayment = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      if (!stripe || !elements) {
        console.log("Payment system not initialized");
        setError("Payment system not initialized. Please try again.");
        return;
      }

      console.log("Confirming payment with Stripe...");
      const { paymentIntent, error: stripeError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.origin + "/count",
        },
        redirect: "if_required",
      });

      if (stripeError) {
        console.log("Stripe error:", stripeError.message);
        setError(stripeError.message);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        console.log("Payment succeeded, calling onSubmit with PaymentIntent:", paymentIntent.id);
        onSubmit(paymentIntent);
      } else {
        console.log("Payment failed, status:", paymentIntent.status);
        setError("Payment failed. Please try again.");
      }
    } catch (err) {
      console.error("Error in handlePayment:", err);
      setError(err.response?.data?.message || "Failed to submit payment details. Please try again.");
    }
  };

  return (
    <form onSubmit={handlePayment} style={{ marginTop: "10px" }}>
      <div style={{ marginBottom: "10px" }}>
        <label style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>
          Payment Details (Powered by Stripe)
        </label>
        <PaymentElement options={{ layout: "tabs" }} />
      </div>
      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "10px 20px",
          backgroundColor: loading ? "#ccc" : "#ff6200",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          fontSize: "14px",
          cursor: loading ? "not-allowed" : "pointer",
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

const Transaction = ({ stripePromise }) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);

  const filters = state?.filters || {};
  const totalCount = state?.totalCount || 0;
  const selectedAddons = state?.selectedAddons || []; // Receive selectedAddons from CountDashboard
  const country = filters?.country?.label || "US";

  // Dynamic pricing logic including add-ons
  const calculatePrice = (count, addons) => {
    const threshold = 100000;
    const rateFirstTier = 0.5; // Base rate per company
    const rateSecondTier = 0.25; // Reduced rate for companies above threshold
    const addonRate = 0.1; // $0.1 per company per add-on

    let basePrice;
    if (count <= threshold) {
      basePrice = count * rateFirstTier;
    } else {
      const firstTierCost = threshold * rateFirstTier;
      const secondTierCount = count - threshold;
      const secondTierCost = secondTierCount * rateSecondTier;
      basePrice = firstTierCost + secondTierCost;
    }

    const addonCost = count * addonRate * addons.length; // Add-on cost: $0.5 per company per add-on
    return (basePrice + addonCost).toFixed(2);
  };

  const price = calculatePrice(totalCount, selectedAddons);

  // Fetch the client secret for Stripe payment
  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        if (totalCount <= 0) {
          console.log("Invalid total count:", totalCount);
          setError("Invalid total count. Please select at least one company.");
          return;
        }

        console.log("Sending request to create-payment-intent:", { totalCount, country, selectedAddons });
        const response = await api.post("/payment/create-payment-intent", {
          totalCount,
          country,
          selectedAddons: selectedAddons.map(addon => addon.value), // Send add-on values
        });
        console.log("Client secret received:", response.data.clientSecret);
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Error fetching client secret:", err.response?.data || err.message);
        setError(err.response?.data?.message || "Failed to initialize payment. Please try again.");
      }
    };
    fetchClientSecret();
  }, [totalCount, country, selectedAddons]);

  // Timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          navigate("/count");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

// Transaction.jsx (partial update)
// Inside the Transaction component, update handlePaymentSuccess
const handlePaymentSuccess = async (paymentIntent) => {
  setLoading(true);
  try {
    console.log("Payment successful, submitting payment details...");
    const submitResponse = await api.post("/payment/submit", {
      filters,
      totalCount,
      price,
      paymentIntentId: paymentIntent.id,
      selectedAddons: selectedAddons.map(addon => addon.value),
    });
    console.log("Submit response:", submitResponse.data);

    setLoading(false);
    navigate("/success", { state: { totalCount, selectedAddons } }); // Pass state to Success
  } catch (err) {
    setLoading(false);
    console.error("Error in handlePaymentSuccess:", err.response?.data || err.message);
    setError(err.response?.data?.message || "Failed to submit payment details. Please try again.");
  }
};

  // Format filter labels
  const formatString = (str) => {
    if (!str || str === "N/A") return str;
    return str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
<div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      {/* Header */}
      <div
        style={{
          backgroundColor: "#0052cc",
          color: "#fff",
          padding: "10px 15px",
          borderRadius: "4px 4px 0 0",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <span
          style={{
            backgroundColor: "#fff",
            color: "#0052cc",
            borderRadius: "50%",
            width: "24px",
            height: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          4
        </span>
        <h1 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>
          PAYMENT OPTIONS
        </h1>
      </div>

      {/* Timer */}
      <div
        style={{
          backgroundColor: "#fffbe6",
          padding: "10px",
          border: "1px solid #ffe58f",
          borderRadius: "0 0 4px 4px",
          textAlign: "center",
          fontSize: "14px",
          color: "#595959",
        }}
      >
        Complete payment in{" "}
        <span style={{ fontWeight: "bold" }}>
          <span role="img" aria-label="clock">⏰</span> {formatTime(timeLeft)}
        </span>
      </div>

      {/* Summary Section */}
      <div
        style={{
          border: "1px solid #e0e0e0",
          borderRadius: "4px",
          padding: "15px",
          backgroundColor: "#f9f9f9",
          margin: "20px 0",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>
          Purchase Summary
        </h2>
        <p style={{ fontSize: "14px", color: "#666" }}>
          <strong>Total Companies:</strong> {totalCount.toLocaleString()}
        </p>
        {totalCount > 100000 ? (
          <>
            <p style={{ fontSize: "14px", color: "#666" }}>
              <strong>First 100,000 Companies:</strong> $50,000.00 (at $0.5 each)
            </p>
            <p style={{ fontSize: "14px", color: "#666" }}>
              <strong>Additional {totalCount - 100000} Companies:</strong> $
              {((totalCount - 100000) * 0.25).toFixed(2)} (at $0.25 each)
            </p>
          </>
        ) : (
          <p style={{ fontSize: "14px", color: "#666" }}>
            <strong>Base Cost:</strong> ${(totalCount * 0.5).toFixed(2)} (at $0.5 each)
          </p>
        )}
        {selectedAddons.length > 0 && (
          <>
            <p style={{ fontSize: "14px", color: "#666" }}>
              <strong>Add-Ons ({selectedAddons.length}):</strong> $
              {(totalCount * 0.1 * selectedAddons.length).toFixed(2)} (at $0.1 per company per add-on)
            </p>
            <ul style={{ listStyleType: "none", paddingLeft: "0", fontSize: "14px" }}>
              {selectedAddons.map((addon) => (
                <li key={addon.value}>{addon.label}</li>
              ))}
            </ul>
          </>
        )}
        <p style={{ fontSize: "14px", color: "#666" }}>
          <strong>Total Price:</strong> ${price}
        </p>
        <div style={{ marginTop: "10px" }}>
          <strong>Selected Filters:</strong>
          <ul style={{ listStyleType: "none", paddingLeft: "0", fontSize: "14px" }}>
            {filters.categories?.length > 0 && (
              <li>Categories: {filters.categories.map(formatString).join(", ")}</li>
            )}
            {filters.subcategories?.length > 0 && (
              <li>
                Subcategories:{" "}
                {filters.subcategories
                  .filter((subCat) => !filters.categories.includes(subCat.split(":")[0]))
                  .map((subCat) => formatString(subCat.split(":")[1]))
                  .join(", ")}
              </li>
            )}
            {filters.subSubcategories?.length > 0 && (
              <li>
                Sub-subcategories:{" "}
                {filters.subSubcategories
                  .filter((subSubCat) => {
                    const [category, subcategory] = subSubCat.split(":");
                    return (
                      !filters.categories.includes(category) &&
                      !filters.subcategories.includes(`${category}:${subcategory}`)
                    );
                  })
                  .map((subSubCat) => formatString(subSubCat.split(":")[2]))
                  .join(", ")}
              </li>
            )}
            {filters.country && <li>Country: {filters.country.label}</li>}
            {filters.state && <li>State: {filters.state.label}</li>}
            {filters.city && <li>City: {filters.city.label}</li>}
            {selectedAddons.length > 0 && (
              <li>
                Add-Ons: {selectedAddons.map((addon) => formatString(addon.label)).join(", ")}
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Payment Options */}
      <div style={{ border: "1px solid #e0e0e0", borderRadius: "4px", padding: "15px", backgroundColor: "#fff" }}>
        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        {clientSecret ? (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <PaymentForm
              onSubmit={handlePaymentSuccess}
              loading={loading}
              error={error}
              setError={setError}
            />
          </Elements>
        ) : (
          <p>Loading payment options...</p>
        )}
      </div>

      {/* Back Button */}
      <button
        onClick={() => navigate("/count")}
        style={{
          marginTop: "20px",
          padding: "8px 15px",
          backgroundColor: "transparent",
          color: "#0052cc",
          border: "1px solid #0052cc",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default Transaction;
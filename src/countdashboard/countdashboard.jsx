import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaPlus,
  FaHome,
  FaUtensils,
  FaShoppingCart,
  FaTruck,
  FaPlane,
  FaMinus,
  FaTractor,
  FaBriefcase,
  FaUsers,
  FaHardHat,
  FaGraduationCap,
  FaDollarSign,
  FaBuilding,
  FaHeartbeat,
  FaIndustry,
  FaCar,
  FaChevronCircleDown,
  FaChevronCircleUp,
  FaUser,
  FaSpinner,
  FaCheckCircle,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import Select from "react-select";
import debounce from "lodash/debounce";
import Header from "../Header/header";
import Footer from "../Header/Footer";
import AddonFilters from "../Addon/Addon-Filters.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../utils/api.js";

const categoryIcons = {
  Agriculture: { icon: <FaTractor />, color: "#4A90E2" },
  "Business Services": { icon: <FaBriefcase />, color: "#4A90E2" },
  "Community Services": { icon: <FaUsers />, color: "#4A90E2" },
  Construction: { icon: <FaHardHat />, color: "#4A90E2" },
  Education: { icon: <FaGraduationCap />, color: "#4A90E2" },
  Finance: { icon: <FaDollarSign />, color: "#4A90E2" },
  Government: { icon: <FaBuilding />, color: "#4A90E2" },
  "Health Medical": { icon: <FaHeartbeat />, color: "#4A90E2" },
  Industry: { icon: <FaIndustry />, color: "#4A90E2" },
  Manufacturing: { icon: <FaIndustry />, color: "#4A90E2" },
  "Motorized Vehicle": { icon: <FaCar />, color: "#4A90E2" },
  "Personal Services": { icon: <FaUser />, color: "#4A90E2" },
  Professional: { icon: <FaBriefcase />, color: "#4A90E2" },
  "Real Estate": { icon: <FaHome />, color: "#4A90E2" },
  "Restaurants Food Dining": { icon: <FaUtensils />, color: "#4A90E2" },
  "Shopping Shopping Services": { icon: <FaShoppingCart />, color: "#4A90E2" },
  Transportation: { icon: <FaTruck />, color: "#4A90E2" },
  "Travel Tourism": { icon: <FaPlane />, color: "#4A90E2" },
};

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const advancedFilterOptions = [
  { value: "revenueRange", label: "Revenue Range" },
  { value: "employeeCount", label: "Employee Count" },
  { value: "yearFounded", label: "Year Founded" },
  { value: "technologyUsed", label: "Technology Used" },
  { value: "certifications", label: "Certifications" },
];

const AdvancedFilterPaymentForm = ({ order, advancedFilters, onSubmit, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const totalCost = order.totalCount * advancedFilters.length;

  const handlePayment = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      setError("Payment system not initialized. Please try again.");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: stripeError } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.origin + "/count" },
      redirect: "if_required",
    });

    if (stripeError) {
      setError(stripeError.message);
      setLoading(false);
      return;
    }

    if (paymentIntent.status === "succeeded") {
      await onSubmit(paymentIntent);
      onClose();
    } else {
      setError("Payment failed. Please try again.");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        background: "#fff",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 0 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        width: "400px",
        maxHeight: "80vh",
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h3 style={{ fontSize: "16px", marginBottom: "10px" }}>Payment for Advanced Filters</h3>
      <p>Total Companies: {order.totalCount.toLocaleString()}</p>
      <p>Filters Selected: {advancedFilters.length}</p>
      <p>Total Cost: ${totalCost.toFixed(2)} ($1 per company per filter)</p>
      {error && <p style={{ color: "red", margin: "10px 0" }}>{error}</p>}
      <form onSubmit={handlePayment} style={{ marginTop: "10px", flex: 1 }}>
        <div style={{ marginBottom: "10px" }}>
          <label style={{ display: "block", fontSize: "14px", marginBottom: "5px" }}>
            Payment Details (Powered by Stripe)
          </label>
          <PaymentElement options={{ layout: "tabs" }} />
        </div>
        <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
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
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ff0000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

const CountDashboard = ({ stripePromise }) => {
  const [filters, setFilters] = useState({
    categories: [],
    subcategories: [],
    subSubcategories: [],
    country: null,
    state: null,
    city: null,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [expanded, setExpanded] = useState({ categories: {}, subcategories: {} });
  const [activeTab, setActiveTab] = useState("activity");
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || { name: "Abc" });
  const [orders, setOrders] = useState([]);
  const [advancedFilters, setAdvancedFilters] = useState({});
  const [pendingAdvancedFilters, setPendingAdvancedFilters] = useState({});
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [clientSecret, setClientSecret] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [visibleOrders, setVisibleOrders] = useState(10);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const formatString = useCallback((str) => {
    if (!str || str === "N/A") return str;
    // Insert spaces before capital letters and handle multiple consecutive capitals
    let formatted = str.replace(/([A-Z])/g, ' $1').trim();
    // Replace any remaining hyphens with spaces
    formatted = formatted.replace(/-/g, " ");
    // Capitalize the first letter of each word
    return formatted
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }, []);

  const normalizeCountry = useCallback((country) => {
    const countryMap = {
      USA: "United States of America (U.S.A)",
      US: "United States of America (U.S.A)",
      "United States": "United States of America (U.S.A)",
      CAN: "Canada",
      Canada: "Canada",
    };
    return countryMap[country?.trim()] || country?.trim();
  }, []);

  useEffect(() => {
    if (user) {
      fetchSavedFilters(user.id);
    }
  }, [user]);

  useEffect(() => {
    const action = location.state?.action;
    if (user && action === "save") {
      handleSaveSelection();
    } else if (user && action === "buy") {
      handleBuyList();
    }
  }, [user, location.state]);

  const fetchOrders = useCallback(async () => {
    if (!user) return;
    try {
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/payment/my-orders`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setOrders(response.data || []);
    } catch (err) {
      setError("Failed to fetch order history: " + (err.response?.data?.message || err.message));
      setOrders([]);
    }
  }, [user]);

  useEffect(() => {
    if (activeTab === "history" && user) {
      fetchOrders();
    }
  }, [activeTab, user, fetchOrders]);

  const fetchSavedFilters = async (userId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${userId}/saved-filters`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const savedFilters = response.data.filters || {};
      setFilters({
        categories: Array.isArray(savedFilters.categories) ? savedFilters.categories : [],
        subcategories: Array.isArray(savedFilters.subcategories) ? savedFilters.subcategories : [],
        subSubcategories: Array.isArray(savedFilters.subSubcategories) ? savedFilters.subSubcategories : [],
        country: savedFilters.country || null,
        state: savedFilters.state || null,
        city: savedFilters.city || null,
      });
    } catch (err) {
      setError("Failed to load saved filters: " + err.message);
      setFilters({
        categories: [],
        subcategories: [],
        subSubcategories: [],
        country: null,
        state: null,
        city: null,
      });
    }
  };

  const fetchFilterOptions = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      setError(null);

      const [catRes, countryRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/companies/filters?field=category&limit=50`),
        axios.get(`${API_BASE_URL}/api/companies/filters?field=Country`),
      ]);

      const categories = catRes.data.data.map(cat => ({
        category: cat.category,
        count: cat.count,
        subcategories: [],
        loaded: false,
        skip: 0,
        total: catRes.data.total,
      }));
      setCategoriesData(categories);

      const fetchedCountries = countryRes.data.map(country => ({ value: country, label: country }));
      setCountries(fetchedCountries);
    } catch (err) {
      setError("Failed to load filter options: " + (err.response?.data?.error || err.message));
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  const loadMoreCategories = useCallback(async () => {
    try {
      const skip = categoriesData.length;
      const response = await axios.get(`${API_BASE_URL}/api/companies/filters?field=category&skip=${skip}&limit=50`);
      const newCategories = response.data.data.map(cat => ({
        category: cat.category,
        count: cat.count,
        subcategories: [],
        loaded: false,
        skip: 0,
        total: response.data.total,
      }));
      setCategoriesData(prev => [...prev, ...newCategories]);
    } catch (err) {
      setError("Failed to load more categories: " + err.message);
    }
  }, [categoriesData]);

  const fetchSubcategories = useCallback(async (category) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/companies/filters?field=subcategory&category=${category}&limit=50`);
      return response.data.data.map(sub => ({
        value: `${category}:${sub.subcategory}`,
        label: formatString(sub.subcategory),
        count: sub.count,
        subSubcategories: [],
        loaded: false,
        skip: 0,
        total: response.data.total,
      }));
    } catch (err) {
      setError(`Failed to load subcategories for ${category}: ` + err.message);
      return [];
    }
  }, [formatString]);

  const loadMoreSubcategories = useCallback(async (category) => {
    const categoryData = categoriesData.find(cat => cat.category === category);
    const skip = categoryData.subcategories.length;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/companies/filters?field=subcategory&category=${category}&skip=${skip}&limit=50`);
      const newSubcategories = response.data.data.map(sub => ({
        value: `${category}:${sub.subcategory}`,
        label: formatString(sub.subcategory),
        count: sub.count,
        subSubcategories: [],
        loaded: false,
        skip: 0,
        total: response.data.total,
      }));
      setCategoriesData(prev =>
        prev.map(cat =>
          cat.category === category
            ? { ...cat, subcategories: [...cat.subcategories, ...newSubcategories] }
            : cat
        )
      );
    } catch (err) {
      setError(`Failed to load more subcategories for ${category}: ` + err.message);
    }
  }, [categoriesData, formatString]);

  const fetchSubSubcategories = useCallback(async (category, subcategory, skip = 0, limit = 100) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/companies/filters?field=categories&category=${category}&subcategory=${subcategory}&skip=${skip}&limit=${limit}`);
      const { data, total } = response.data;
      return {
        subSubcategories: data.map(subSub => ({
          value: `${category}:${subcategory}:${subSub.label}`,
          label: formatString(subSub.label),
          count: subSub.count,
        })),
        total,
      };
    } catch (err) {
      setError(`Failed to load sub-subcategories for ${category}:${subcategory}: ` + err.message);
      return { subSubcategories: [], total: 0 };
    }
  }, [formatString]);

  const loadMoreSubSubcategories = useCallback(async (category, subcategoryValue) => {
    const [catName, subCatName] = subcategoryValue.split(":");
    const categoryData = categoriesData.find(cat => cat.category === catName);
    const subCatData = categoryData.subcategories.find(sub => sub.value === subcategoryValue);

    if (!subCatData) return;

    const currentSkip = subCatData.skip || 0;
    const limit = 100;
    const { subSubcategories: newSubSubcategories, total } = await fetchSubSubcategories(catName, subCatName, currentSkip, limit);

    setCategoriesData(prev =>
      prev.map(cat =>
        cat.category === catName
          ? {
              ...cat,
              subcategories: cat.subcategories.map(sub =>
                sub.value === subcategoryValue
                  ? {
                      ...sub,
                      subSubcategories: [...sub.subSubcategories, ...newSubSubcategories],
                      skip: currentSkip + newSubSubcategories.length,
                      totalSubSubcategories: total,
                    }
                  : sub
              ),
            }
          : cat
      )
    );
  }, [categoriesData, fetchSubSubcategories]);

  const fetchDependentFilters = useCallback(
    debounce(async (country, state) => {
      try {
        if (country) {
          const normalizedCountry = normalizeCountry(country);
          const stateRes = await axios.get(`${API_BASE_URL}/api/companies/filters?field=State`, {
            params: { Country: normalizedCountry },
          });
          setStates(stateRes.data.map(s => ({ value: s, label: s })));
        }

        if (country && state) {
          const normalizedCountry = normalizeCountry(country);
          const cityRes = await axios.get(`${API_BASE_URL}/api/companies/filters?field=City`, {
            params: { Country: normalizedCountry, State: state },
          });
          setCities(cityRes.data.map(c => ({ value: c, label: c })));
        }
      } catch (err) {
        setError("Failed to load location filters: " + err.message);
      }
    }, 300),
    [normalizeCountry]
  );

  const fetchTotalCount = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      const orConditions = [];

      if (filters.categories?.length > 0) {
        filters.categories.forEach(cat => {
          orConditions.push({ category: cat });
        });
      }

      if (filters.subcategories?.length > 0) {
        filters.subcategories.forEach(sub => {
          const [category, subcategory] = sub.split(":");
          orConditions.push({ category, subcategory });
        });
      }

      if (filters.subSubcategories?.length > 0) {
        const groupedSubSubcategories = {};

        filters.subSubcategories.forEach(subSub => {
          const [category, subcategory, subSubcategory] = subSub.split(":");
          const key = `${category}:${subcategory}`;
          if (!groupedSubSubcategories[key]) {
            groupedSubSubcategories[key] = { category, subcategory, subSubcategories: [] };
          }
          groupedSubSubcategories[key].subSubcategories.push(subSubcategory);
        });

        Object.values(groupedSubSubcategories).forEach(({ category, subcategory, subSubcategories }) => {
          orConditions.push({ category, subcategory, subSubcategories });
        });
      }

      if (orConditions.length > 0) {
        params.or = JSON.stringify(orConditions);
      }

      if (filters.country?.value) params.Country = filters.country.value;
      if (filters.state?.value) params.State = filters.state.value;
      if (filters.city?.value) params.City = filters.city.value;

      if (Object.keys(params).length === 0) {
        setTotalCount(0);
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/companies/count`, { params });
      setTotalCount(response.data.totalCount || 0);
    } catch (err) {
      setError("Failed to fetch total count: " + (err.response?.data?.error || err.message));
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const debouncedFetchTotalCount = useMemo(() => debounce(fetchTotalCount, 1000), [fetchTotalCount]);

  useEffect(() => {
    fetchFilterOptions();
  }, [fetchFilterOptions]);

  useEffect(() => {
    if (filters.country?.value) {
      setFilters(prev => ({ ...prev, state: null, city: null }));
      setStates([]);
      setCities([]);
      fetchDependentFilters(filters.country.value, null);
    } else {
      setFilters(prev => ({ ...prev, state: null, city: null }));
      setStates([]);
      setCities([]);
    }
  }, [filters.country, fetchDependentFilters]);

  useEffect(() => {
    if (filters.state?.value && filters.country?.value) {
      setFilters(prev => ({ ...prev, city: null }));
      setCities([]);
      fetchDependentFilters(filters.country.value, filters.state.value);
    } else if (!filters.state?.value && filters.country?.value) {
      setFilters(prev => ({ ...prev, city: null }));
      setCities([]);
    }
  }, [filters.state, filters.country, fetchDependentFilters]);

  useEffect(() => {
    debouncedFetchTotalCount();
    return () => debouncedFetchTotalCount.cancel();
  }, [filters, debouncedFetchTotalCount]);

  const toggleCategoryExpand = useCallback(async (category) => {
    setExpanded(prev => ({
      ...prev,
      categories: { ...prev.categories, [category]: !prev.categories[category] },
    }));

    if (!expanded.categories[category]) {
      const categoryData = categoriesData.find(cat => cat.category === category);
      if (!categoryData.loaded) {
        const subcategories = await fetchSubcategories(category);
        setCategoriesData(prev =>
          prev.map(cat =>
            cat.category === category ? { ...cat, subcategories, loaded: true } : cat
          )
        );
      }
    }
  }, [expanded.categories, categoriesData, fetchSubcategories]);

  const toggleSubcategoryExpand = useCallback(async (category, subcategoryValue) => {
    setExpanded(prev => ({
      ...prev,
      subcategories: { ...prev.subcategories, [subcategoryValue]: !prev.subcategories[subcategoryValue] },
    }));

    if (!expanded.subcategories[subcategoryValue]) {
      const [catName, subCatName] = subcategoryValue.split(":");
      const categoryData = categoriesData.find(cat => cat.category === catName);
      const subCatData = categoryData.subcategories.find(sub => sub.value === subcategoryValue);

      if (!subCatData.loaded) {
        const { subSubcategories, total } = await fetchSubSubcategories(catName, subCatName);
        setCategoriesData(prev =>
          prev.map(cat =>
            cat.category === catName
              ? {
                  ...cat,
                  subcategories: cat.subcategories.map(sub =>
                    sub.value === subcategoryValue
                      ? { ...sub, subSubcategories, totalSubSubcategories: total, loaded: true, skip: subSubcategories.length }
                      : sub
                  ),
                }
              : cat
          )
        );
      }
    }
  }, [expanded.subcategories, categoriesData, fetchSubSubcategories]);

  const handleCategorySelect = useCallback((category) => {
    setFilters(prev => {
      const isSelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter(cat => cat !== category)
          : [...prev.categories, category],
      };
    });
  }, []);

  const handleSubcategorySelect = useCallback((subcategoryValue) => {
    setFilters(prev => {
      const isSelected = prev.subcategories.includes(subcategoryValue);
      return {
        ...prev,
        subcategories: isSelected
          ? prev.subcategories.filter(sub => sub !== subcategoryValue)
          : [...prev.subcategories, subcategoryValue],
      };
    });
  }, []);

  const handleSubSubcategorySelect = useCallback((subSubcategoryValue) => {
    setFilters(prev => {
      const isSelected = prev.subSubcategories.includes(subSubcategoryValue);
      return {
        ...prev,
        subSubcategories: isSelected
          ? prev.subSubcategories.filter(subSub => subSub !== subSubcategoryValue)
          : [...prev.subSubcategories, subSubcategoryValue],
      };
    });
  }, []);

  const clearFilters = () => {
    setFilters({
      categories: [],
      subcategories: [],
      subSubcategories: [],
      country: null,
      state: null,
      city: null,
    });
    setExpanded({ categories: {}, subcategories: {} });
    setSearchQuery("");
    setSelectedAddons([]);
    setTotalCount(0);
    setStates([]);
    setCities([]);
    setError(null);
  };

  const handleSaveSelection = async () => {
    if (!user) {
      navigate("/login", { state: { from: "/count", action: "save" } });
    } else {
      try {
        await axios.post(
          `${API_BASE_URL}/api/users/${user.id}/save-filters`,
          { filters },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
      } catch (err) {
        setError("Failed to save selection: " + err.message);
      }
    }
  };

  const handleBuyList = () => {
    if (!user) {
      navigate("/login", { state: { from: "/count", action: "buy" } });
    } else {
      navigate("/transaction", { state: { filters, totalCount, selectedAddons } });
    }
  };

  const customStyles = useMemo(() => ({
    control: (base) => ({
      ...base,
      border: "1px solid #ccc",
      boxShadow: "none",
      "&:hover": { border: "1px solid #ccc" },
      padding: "2px 5px",
      backgroundColor: "#fff",
      minHeight: "34px",
      fontSize: "14px",
    }),
    valueContainer: (base) => ({ ...base, padding: "0 6px" }),
    input: (base) => ({ ...base, margin: 0, padding: 0 }),
    menu: (base) => ({
      ...base,
      borderRadius: "4px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      marginTop: "2px",
      zIndex: 1000,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#e0e0e0" : state.isFocused ? "#f0f0f0" : "#fff",
      color: "#333",
      padding: "6px 12px",
      fontSize: "14px",
    }),
  }), []);

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categoriesData;
    const query = searchQuery.toLowerCase();
    return categoriesData.filter((cat) => formatString(cat.category).toLowerCase().includes(query));
  }, [categoriesData, searchQuery, formatString]);

  const activeFilters = useMemo(() => {
    const filtersList = [];

    if (filters.country?.value) filtersList.push(`Country: ${filters.country.value}`);
    if (filters.state?.value) filtersList.push(`State: ${filters.state.value}`);
    if (filters.city?.value) filtersList.push(`City: ${filters.city.value}`);

    const categories = Array.isArray(filters.categories) ? filters.categories : [];
    const subcategories = Array.isArray(filters.subcategories) ? filters.subcategories : [];
    const subSubcategories = Array.isArray(filters.subSubcategories) ? filters.subSubcategories : [];

    if (categories.length > 0) {
      filtersList.push(
        <div key="categories">
          <strong>Categories:</strong>
          <ul>
            {categories.map((cat) => (
              <li key={cat}>{formatString(cat)}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (subcategories.length > 0) {
      filtersList.push(
        <div key="subcategories">
          <strong>Subcategories:</strong>
          <ul>
            {subcategories.map((sub) => (
              <li key={sub}>{formatString(sub.split(":")[1])}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (subSubcategories.length > 0) {
      filtersList.push(
        <div key="subSubcategories">
          <strong>Sub-subcategories:</strong>
          <ul>
            {subSubcategories.map((subSub) => (
              <li key={subSub}>{formatString(subSub.split(":")[2])}</li>
            ))}
          </ul>
        </div>
      );
    }

    if (selectedAddons.length > 0) {
      filtersList.push(
        <div key="addons">
          <strong>Add-ons:</strong>
          <ul>
            {selectedAddons.map((addon) => (
              <li key={addon.value}>{addon.label}</li>
            ))}
          </ul>
        </div>
      );
    }

    return filtersList;
  }, [filters, selectedAddons, formatString]);

  const formatOrderCriteria = useCallback((orderFilters) => {
    const criteria = [];
  
    if (orderFilters.country?.value) criteria.push(`Country: ${orderFilters.country.value}`);
    if (orderFilters.state?.value) criteria.push(`State: ${orderFilters.state.value}`);
    if (orderFilters.city?.value) criteria.push(`City: ${orderFilters.city.value}`);
  
    const categories = Array.isArray(orderFilters.categories) ? orderFilters.categories : [];
    const subcategories = Array.isArray(orderFilters.subcategories) ? orderFilters.subcategories : [];
    const subSubcategories = Array.isArray(orderFilters.subSubcategories) ? orderFilters.subSubcategories : [];
  
    if (categories.length > 0) {
      criteria.push(`Categories: ${categories.map((cat) => formatString(cat)).join(", ")}`);
    }
  
    if (subcategories.length > 0) {
      criteria.push(`Subcategories: ${subcategories.map((sub) => formatString(sub.split(":")[1])).join(", ")}`);
    }
  
    if (subSubcategories.length > 0) {
      criteria.push(`Sub-subcategories: ${subSubcategories.map((subSub) => formatString(subSub.split(":")[2])).join(", ")}`);
    }
  
    // Add add-ons to the criteria
    if (orderFilters.addOns && orderFilters.addOns.length > 0) {
      criteria.push(`Add-ons: ${orderFilters.addOns.join(", ")}`);
    }
  
    return criteria.length > 0 ? criteria.join("; ") : "No criteria specified";
  }, [formatString]);

  const handleAdvancedFilterChange = (orderId, selectedOptions) => {
    setPendingAdvancedFilters((prev) => ({
      ...prev,
      [orderId]: selectedOptions || [],
    }));
  };

  const confirmAdvancedFilters = async (orderId) => {
    const selectedOptions = pendingAdvancedFilters[orderId] || [];
    if (selectedOptions.length > 0) {
      const order = orders.find((o) => o._id === orderId);
      try {
        const response = await api.post("/payment/create-payment-intent", {
          totalCount: order.totalCount,
          country: order.filters?.country?.value || "US",
          advancedFilters: selectedOptions.map((f) => f.value),
        });
        setClientSecret(response.data.clientSecret);
        setShowPaymentModal(orderId);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to initialize payment for advanced filters.");
      }
    } else {
      setShowPaymentModal(null);
      setClientSecret(null);
    }
  };

  const handlePaymentSuccess = async (orderId, paymentIntent) => {
    try {
      const selectedFilters = pendingAdvancedFilters[orderId] || [];
      const order = orders.find((o) => o._id === orderId);
      const totalCost = order.totalCount * selectedFilters.length;

      try {
        await api.post("/payment/submit-advanced-filters", {
          orderId,
          advancedFilters: selectedFilters.map((f) => f.value),
          totalCount: order.totalCount,
          price: totalCost,
          paymentIntentId: paymentIntent.id,
        });
      } catch (apiError) {
        console.error("API error (ignoring due to database limitation):", apiError.response?.data?.message || apiError.message);
      }

      setSuccessMessage(
        `Your purchase for the following advanced filters is submitted: ${selectedFilters
          .map((f) => f.label)
          .join(", ")}. We will further contact you via email...`
      );

      setAdvancedFilters((prev) => ({
        ...prev,
        [orderId]: pendingAdvancedFilters[orderId],
      }));
      setPendingAdvancedFilters((prev) => {
        const newPending = { ...prev };
        delete newPending[orderId];
        return newPending;
      });
      setShowPaymentModal(null);
      setClientSecret(null);
      fetchOrders();

      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (err) {
      setError(err.response?.data?.message || "An unexpected error occurred during payment processing.");
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(null);
    setClientSecret(null);
    setPendingAdvancedFilters((prev) => {
      const newPending = { ...prev };
      delete newPending[showPaymentModal];
      return newPending;
    });
  };

  useEffect(() => {
    if (showPaymentModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPaymentModal]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // Calculate dynamic progress based on number of selected categories, subcategories, and sub-subcategories
  const totalCategories = Object.keys(categoryIcons).length; // 18 categories
  const selectedCount = filters.categories.length + filters.subcategories.length + filters.subSubcategories.length;
  const dynamicProgress = selectedCount > 0 ? Math.min((selectedCount / totalCategories) * 100, 100) : 0;

  return (
    <div style={{ position: "relative", minHeight: "100vh", fontFamily: "Arial, sans-serif", background: "#f5f5f5", padding: 0 }}>
      <div style={{ backgroundColor: "#080093", color: "#fff", padding: "10px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Company Logo</span>
        <span>Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s</span>
      </div>
      <img
        src="/assets/world-map-background.png"
        alt="World Map"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 1,
          zIndex: -1,
        }}
      />
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#28a745",
            color: "#fff",
            padding: "15px 25px",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            zIndex: 2000,
            fontSize: "14px",
            maxWidth: "80%",
            textAlign: "center",
          }}
        >
          <FaCheckCircle style={{ marginRight: "10px" }} />
          {successMessage}
        </motion.div>
      )}

      <div style={{ maxWidth: "90%", margin: "0 auto", display: "flex", padding: "20px 0" }}>
        <div style={{ width: "250px", background: "#e6f0fa", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginTop: 0 }}>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <span style={{ fontSize: "14px", color: "#333" }}>April 17, 2025</span>
          </div>
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <img src="/assets/user-image.png" alt="User" style={{ width: "50px", height: "50px", borderRadius: "50%", marginBottom: "10px" }} />
            <span style={{ fontWeight: "bold", color: "#333", fontSize: "16px" }}>Welcome, {user.name}!</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handleLogout}
              style={{
                background: "#080093",
                color: "#fff",
                border: "none",
                padding: "8px 15px",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
                width: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
              }}
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
          <div style={{ marginTop: "20px", background: "#080093", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", color: "#fff", position: "relative" }}>
            <img
              src="/assets/world-map-background.png"
              alt="World Map"
              style={{
                position: "",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                opacity: 2,
                zIndex: -1,
              }}
            />
            <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "15px", textAlign: "center" }}>Selected Criteria</h3>
            {activeFilters.length > 0 || selectedAddons.length > 0 ? (
              <div style={{ textAlign: "center" }}>
                {activeFilters.map((filter, index) => (
                  <div key={index} style={{ marginBottom: "10px", fontSize: "14px", color: "#fff", textAlign: "left" }}>
                    {filter}
                  </div>
                ))}
                {selectedAddons.length > 0 && (
                  <div style={{ marginBottom: "10px", textAlign: "left" }}>
                    <strong style={{ fontSize: "14px", color: "#fff" }}>Add-Ons:</strong>
                    <ul style={{ paddingLeft: "20px", fontSize: "14px", color: "#fff" }}>
                      {selectedAddons.map((addon) => (
                        <li key={addon.value}>{addon.label}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <button
                  onClick={clearFilters}
                  style={{
                    padding: "8px 15px",
                    background: "#ff0000",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "14px",
                    width: "100%",
                    marginTop: "10px",
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <p style={{ fontSize: "14px", color: "#fff", textAlign: "center" }}>No selected criteria!</p>
            )}
          </div>
        </div>

        <div style={{ flex: 1, background: "#fff", padding: "20px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.1)", marginLeft: "20px", marginTop: 0 }}>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "10px" }}>Search Count</h2>
          <p style={{ fontSize: "14px", color: "#666", marginBottom: "20px" }}>
            Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s.
          </p>
          {error ? (
            <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
          ) : (
            <p style={{ color: "#28a745", fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>
              {loading ? "Loading..." : totalCount.toLocaleString()} targeted companies
            </p>
          )}
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
            <button
              onClick={handleBuyList}
              style={{
                padding: "10px 20px",
                background: "#080093",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <span role="img" aria-label="cart">🛒</span> Buy the list
            </button>
            <button
              onClick={handleSaveSelection}
              style={{
                padding: "10px 20px",
                background: "#080093",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "14px",
              }}
            >
              <span role="img" aria-label="cart">💾</span> Save my selection
              </button>
              <button
  onClick={() => navigate("/demo")}
  style={{
    padding: "10px 20px",
    background: "#080093",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    marginLeft: "auto",
  }}
>
  <span role="img" aria-label="cart">💻</span> Book A Demo
</button>
          </div>
          <div style={{ background: "#e0e0e0", borderRadius: "10px", overflow: "hidden", height: "20px" }}>
            <div
              style={{
                width: `${dynamicProgress}%`,
                background: "#080093",
                height: "100%",
                borderRadius: "10px",
                textAlign: "center",
                color: "#fff",
                fontSize: "12px",
                lineHeight: "20px",
              }}
            >
              {Math.round(dynamicProgress)}%
            </div>
          </div>

          <div style={{ marginTop: "20px", borderBottom: "2px solid #080093", display: "flex", gap: "20px" }}>
            {["activity", "location", "history", "addons"].map((tab) => (
              <div
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "10px 20px",
                  cursor: "pointer",
                  color: activeTab === tab ? "#080093" : "#666",
                  fontWeight: activeTab === tab ? "bold" : "normal",
                  borderBottom: activeTab === tab ? "2px solid #080093" : "none",
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </div>
            ))}
          </div>

          {activeTab === "activity" && (
            <div>
              {categoriesLoading ? (
                <div style={{ textAlign: "center", padding: "20px" }}>
                  <FaSpinner size={24} style={{ animation: "spin 1s linear infinite", color: "#28a745" }} />
                  <p style={{ marginTop: "10px", color: "#666" }}>Loading Categories...</p>
                </div>
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Search for a category"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px",
                      margin: "15px 0",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                      fontSize: "14px",
                    }}
                  />
                  {filteredCategories.map((cat) => {
                    const isSelected = filters.categories.includes(cat.category);
                    const iconData = categoryIcons[cat.category] || { icon: <FaChevronCircleDown />, color: "#000" };
                    return (
                      <div key={cat.category} style={{ marginBottom: "5px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "10px",
                            background: isSelected ? "#e6f7fa" : "#fff",
                            borderBottom: "1px solid #e0e0e0",
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCategorySelect(cat.category)}
                            style={{ marginRight: "10px" }}
                          />
                          <span
                            onClick={() => toggleCategoryExpand(cat.category)}
                            style={{ marginRight: "10px", cursor: "pointer", color: "#080093" }}
                          >
                            {expanded.categories[cat.category] ? <FaChevronCircleUp size={14} /> : <FaChevronCircleDown size={14} />}
                          </span>
                          <span style={{ marginRight: "10px", color: iconData.color }}>{iconData.icon}</span>
                          <span style={{ flex: 1, fontSize: "14px" }}>{formatString(cat.category)}</span>
                          <span style={{ color: "#666", fontSize: "14px" }}>{cat.count.toLocaleString()}</span>
                        </div>
                        {expanded.categories[cat.category] && (
                          <div>
                            {cat.subcategories.map((sub) => {
                              const isSubSelected = filters.subcategories.includes(sub.value);
                              return (
                                <div key={sub.value}>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      padding: "10px 20px",
                                      background: isSubSelected ? "#f0f0f0" : "#fff",
                                      borderBottom: "1px solid #e0e0e0",
                                    }}
                                  >
                                    <input
                                      type="checkbox"
                                      checked={isSubSelected}
                                      onChange={() => handleSubcategorySelect(sub.value)}
                                      style={{ marginRight: "10px" }}
                                    />
                                    <span
                                      onClick={() => toggleSubcategoryExpand(cat.category, sub.value)}
                                      style={{ marginRight: "10px", cursor: "pointer", color: "#080093" }}
                                    >
                                      {expanded.subcategories[sub.value] ? <FaChevronCircleUp size={14} /> : <FaChevronCircleDown size={14} />}
                                    </span>
                                    <span style={{ flex: 1, fontSize: "14px" }}>{sub.label}</span>
                                    <span style={{ color: "#666", fontSize: "14px" }}>{sub.count.toLocaleString()}</span>
                                  </div>
                                  {expanded.subcategories[sub.value] && (
                                    <div>
                                      {sub.subSubcategories.map((subSub) => (
                                        <div
                                          key={subSub.value}
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            padding: "10px 40px",
                                            background: filters.subSubcategories.includes(subSub.value) ? "#e6f7fa" : "#fff",
                                            borderBottom: "1px solid #e0e0e0",
                                          }}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={filters.subSubcategories.includes(subSub.value)}
                                            onChange={() => handleSubSubcategorySelect(subSub.value)}
                                            style={{ marginRight: "10px" }}
                                          />
                                          <span style={{ flex: 1, fontSize: "14px" }}>{subSub.label}</span>
                                          <span style={{ color: "#666", fontSize: "14px" }}>{subSub.count.toLocaleString()}</span>
                                        </div>
                                      ))}
                                      {sub.skip < sub.totalSubSubcategories && (
                                        <div style={{ padding: "10px 40px", textAlign: "center" }}>
                                          <button
                                            onClick={() => loadMoreSubSubcategories(cat.category, sub.value)}
                                            style={{
                                              padding: "5px 10px",
                                              background: "#080093",
                                              color: "#fff",
                                              border: "none",
                                              borderRadius: "4px",
                                              cursor: "pointer",
                                              fontSize: "12px",
                                            }}
                                          >
                                            Load More Sub-Subcategories
                                          </button>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                            {cat.subcategories.length < cat.total && (
                              <div style={{ padding: "10px 20px", textAlign: "center" }}>
                                <button
                                  onClick={() => loadMoreSubcategories(cat.category)}
                                  style={{
                                    padding: "5px 10px",
                                    background: "#080093",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
                                    fontSize: "12px",
                                  }}
                                >
                                  Load More Subcategories
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {filteredCategories.length < (categoriesData[0]?.total || 0) && (
                    <div style={{ padding: "10px", textAlign: "center" }}>
                      <button
                        onClick={loadMoreCategories}
                        style={{
                          padding: "5px 10px",
                          background: "#080093",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
                          fontSize: "12px",
                        }}
                      >
                        Load More Categories
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === "location" && (
            <div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>Country:</label>
                <Select
                  options={countries}
                  value={filters.country}
                  onChange={(selected) => setFilters((prev) => ({ ...prev, country: selected }))}
                  placeholder="Select Country"
                  isClearable
                  styles={customStyles}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>State:</label>
                <Select
                  options={states}
                  value={filters.state}
                  onChange={(selected) => setFilters((prev) => ({ ...prev, state: selected }))}
                  placeholder="Select State"
                  isClearable
                  isDisabled={!filters.country}
                  styles={customStyles}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px", fontSize: "18px" }}>City:</label>
                <Select
                  options={cities}
                  value={filters.city}
                  onChange={(selected) => setFilters((prev) => ({ ...prev, city: selected }))}
                  placeholder="Select City"
                  isClearable
                  isDisabled={!filters.state}
                  styles={customStyles}
                />
              </div>
            </div>
          )}

{activeTab === "history" && (
  <div>
    <h3 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "10px" }}>Order History</h3>
    {!user ? (
      <p style={{ fontSize: "14px", color: "#666" }}>Please log in to view your order history.</p>
    ) : orders.length === 0 ? (
      <p style={{ fontSize: "14px", color: "#666" }}>No orders found.</p>
    ) : (
      <>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
          <thead>
            <tr style={{ background: "#f5f5f5" }}>
              <th style={{ border: "1px solid #e0e0e0", padding: "10px", textAlign: "left" }}>Sr. No.</th>
              <th style={{ border: "1px solid #e0e0e0", padding: "10px", textAlign: "left" }}>Order Date</th>
              <th style={{ border: "1px solid #e0e0e0", padding: "10px", textAlign: "left" }}>Total Companies</th>
              <th style={{ border: "1px solid #e0e0e0", padding: "10px", textAlign: "left" }}>Price</th>
              <th style={{ border: "1px solid #e0e0e0", padding: "10px", textAlign: "left" }}>Status</th>
              <th style={{ border: "1px solid #e0e0e0", padding: "10px", textAlign: "left" }}>Selected Criteria</th>
              <th style={{ border: "1px solid #e0e0e0", padding: "10px", textAlign: "left" }}>Add-ons</th>
            </tr>
          </thead>
          <tbody>
            {orders.slice(0, visibleOrders).map((order, index) => (
              <tr key={order._id} style={{ background: index % 2 === 0 ? "#fff" : "#f9f9f9" }}>
                <td style={{ border: "1px solid #e0e0e0", padding: "10px" }}>{index + 1}</td>
                <td style={{ border: "1px solid #e0e0e0", padding: "10px" }}>{new Date(order.createdAt).toLocaleString()}</td>
                <td style={{ border: "1px solid #e0e0e0", padding: "10px" }}>{order.totalCount?.toLocaleString() || "0"}</td>
                <td style={{ border: "1px solid #e0e0e0", padding: "10px" }}>${order.price || "0"}</td>
                <td style={{ border: "1px solid #e0e0e0", padding: "10px" }}>{formatString(order.status) || "Pending"}</td>
                <td style={{ border: "1px solid #e0e0e0", padding: "10px" }}>{formatOrderCriteria(order.filters)}</td>
                <td style={{ border: "1px solid #e0e0e0", padding: "10px" }}>
                  {order.addOns && order.addOns.length > 0
                    ? order.addOns.map(addOn => formatString(addOn)).join(", ")
                    : "None"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {visibleOrders < orders.length && (
          <div style={{ padding: "10px", textAlign: "center" }}>
            <button
              onClick={() => setVisibleOrders((prev) => prev + 10)}
              style={{
                padding: "5px 10px",
                background: "#080093",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Show More Orders
            </button>
          </div>
        )}
      </>
    )}
  </div>
)}

          {activeTab === "addons" && (
            <AddonFilters selectedAddons={selectedAddons} setSelectedAddons={setSelectedAddons} />
          )}
        </div>
      </div>

      {showPaymentModal && clientSecret && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 999,
            }}
            onClick={closePaymentModal}
          />
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <AdvancedFilterPaymentForm
              order={orders.find((o) => o._id === showPaymentModal)}
              advancedFilters={pendingAdvancedFilters[showPaymentModal] || []}
              onSubmit={(paymentIntent) => handlePaymentSuccess(showPaymentModal, paymentIntent)}
              onClose={closePaymentModal}
            />
          </Elements>
        </>
      )}
      <Footer />
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default CountDashboard;
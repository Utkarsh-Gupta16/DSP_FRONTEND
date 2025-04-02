import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  FaPlus, FaMinus, FaTractor, FaBriefcase, FaUsers, FaHardHat, FaGraduationCap, 
  FaDollarSign, FaBuilding, FaHeartbeat, FaIndustry, FaCar, FaHome, FaUtensils, 
  FaShoppingCart, FaTruck, FaPlane, FaUser, FaSpinner 
} from "react-icons/fa";
import Select from "react-select";
import debounce from "lodash/debounce";
import Header from "../Header/header";

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

const CountDashboard = () => {
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
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const formatString = useCallback((str) => {
    if (!str || str === "N/A") return str;
    return str
      .replace(/-/g, " ")
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
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchSavedFilters(storedUser.id);
    }
  }, []);

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

      // Categories: Each category as a separate condition
      if (filters.categories?.length > 0) {
        filters.categories.forEach(cat => {
          orConditions.push({ category: cat });
        });
      }

      // Subcategories: Each subcategory as a separate condition
      if (filters.subcategories?.length > 0) {
        filters.subcategories.forEach(sub => {
          const [category, subcategory] = sub.split(":");
          orConditions.push({ category, subcategory });
        });
      }

      // Sub-subcategories: Group by category and subcategory, then list subSubcategories
      if (filters.subSubcategories?.length > 0) {
        const groupedSubSubcategories = {};

        // Group sub-subcategories by category and subcategory
        filters.subSubcategories.forEach(subSub => {
          const [category, subcategory, subSubcategory] = subSub.split(":");
          const key = `${category}:${subcategory}`;
          if (!groupedSubSubcategories[key]) {
            groupedSubSubcategories[key] = { category, subcategory, subSubcategories: [] };
          }
          groupedSubSubcategories[key].subSubcategories.push(subSubcategory);
        });

        // Add grouped conditions to orConditions
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
      navigate("/transaction", { state: { filters, totalCount } });
    }
  };

  const customStyles = useMemo(() => ({
    control: base => ({
      ...base,
      border: "1px solid #ccc",
      boxShadow: "none",
      "&:hover": { border: "1px solid #ccc" },
      padding: "2px 5px",
      backgroundColor: "#fff",
      minHeight: "34px",
      fontSize: "14px",
    }),
    valueContainer: base => ({ ...base, padding: "0 6px" }),
    input: base => ({ ...base, margin: 0, padding: 0 }),
    menu: base => ({
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
    return categoriesData.filter(cat => formatString(cat.category).toLowerCase().includes(query));
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
            {categories.map(cat => (
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
            {subcategories.map(sub => (
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
            {subSubcategories.map(subSub => (
              <li key={subSub}>{formatString(subSub.split(":")[2])}</li>
            ))}
          </ul>
        </div>
      );
    }

    return filtersList;
  }, [filters, formatString]);

  // Function to format the order criteria for display in the table
  const formatOrderCriteria = useCallback((orderFilters) => {
    const criteria = [];

    if (orderFilters.country?.value) criteria.push(`Country: ${orderFilters.country.value}`);
    if (orderFilters.state?.value) criteria.push(`State: ${orderFilters.state.value}`);
    if (orderFilters.city?.value) criteria.push(`City: ${orderFilters.city.value}`);

    const categories = Array.isArray(orderFilters.categories) ? orderFilters.categories : [];
    const subcategories = Array.isArray(orderFilters.subcategories) ? orderFilters.subcategories : [];
    const subSubcategories = Array.isArray(orderFilters.subSubcategories) ? orderFilters.subSubcategories : [];

    if (categories.length > 0) {
      criteria.push(`Categories: ${categories.map(cat => formatString(cat)).join(", ")}`);
    }

    if (subcategories.length > 0) {
      criteria.push(`Subcategories: ${subcategories.map(sub => formatString(sub.split(":")[1])).join(", ")}`);
    }

    if (subSubcategories.length > 0) {
      criteria.push(`Sub-subcategories: ${subSubcategories.map(subSub => formatString(subSub.split(":")[2])).join(", ")}`);
    }

    return criteria.length > 0 ? criteria.join("; ") : "No criteria specified";
  }, [formatString]);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <Header user={user} setUser={setUser} onLogout={clearFilters} />

      <div style={{ marginBottom: "20px", border: "1px solid #e0e0e0", padding: "10px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "bold" }}>Search Counts</h2>
        {error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <p style={{ color: "#28a745", fontWeight: "bold" }}>
            {loading ? "Loading..." : totalCount.toLocaleString()} targeted companies
          </p>
        )}
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleBuyList}
            style={{ 
              padding: "8px 15px", 
              backgroundColor: "#28a745", 
              color: "#fff", 
              border: "none", 
              borderRadius: "4px", 
              cursor: "pointer" // Added cursor style
            }}
          >
            Buy the list
          </button>
          <button
            onClick={handleSaveSelection}
            style={{ 
              padding: "8px 15px", 
              backgroundColor: "transparent", 
              color: "#007bff", 
              border: "1px solid #007bff", 
              borderRadius: "4px", 
              cursor: "pointer" // Added cursor style
            }}
          >
            Save my selection
          </button>
        </div>
      </div>

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", gap: "10px", marginBottom: "20px", borderBottom: "1px solid #e0e0e0" }}>
            <div
              onClick={() => setActiveTab("activity")}
              style={{
                padding: "10px 15px",
                borderBottom: activeTab === "activity" ? "2px solid #28a745" : "none",
                cursor: "pointer",
              }}
            >
              Categories
            </div>
            <div
              onClick={() => setActiveTab("location")}
              style={{
                padding: "10px 15px",
                borderBottom: activeTab === "location" ? "2px solid #28a745" : "none",
                cursor: "pointer",
              }}
            >
              Location
            </div>
            <div
              onClick={() => setActiveTab("history")}
              style={{
                padding: "10px 15px",
                borderBottom: activeTab === "history" ? "2px solid #28a745" : "none",
                cursor: "pointer",
              }}
            >
              History
            </div>
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
                    onChange={e => setSearchQuery(e.target.value)}
                    style={{ width: "100%", padding: "8px", marginBottom: "15px", border: "1px solid #ccc", borderRadius: "4px" }}
                  />
                  {filteredCategories.map(cat => {
                    const isSelected = filters.categories.includes(cat.category);
                    const iconData = categoryIcons[cat.category] || { icon: <FaPlus />, color: "#000" };
                    return (
                      <div key={cat.category} style={{ marginBottom: "5px" }}>
                        <div style={{ display: "flex", alignItems: "center", padding: "6px 12px", borderBottom: "1px dashed #e0e0e0" }}>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleCategorySelect(cat.category)}
                            style={{ marginRight: "8px" }}
                          />
                          <span
                            onClick={() => toggleCategoryExpand(cat.category)}
                            style={{ marginRight: "8px", cursor: "pointer" }}
                          >
                            {expanded.categories[cat.category] ? <FaMinus size={12} /> : <FaPlus size={12} />}
                          </span>
                          <span style={{ marginRight: "8px", color: iconData.color }}>
                            {iconData.icon}
                          </span>
                          <span style={{ flex: 1 }}>{formatString(cat.category)}</span>
                          <span style={{ color: "#666" }}>{cat.count.toLocaleString()}</span>
                        </div>
                        {expanded.categories[cat.category] && (
                          <div style={{ backgroundColor: "#e6f7fa" }}>
                            {cat.subcategories.map(sub => {
                              const isSubSelected = filters.subcategories.includes(sub.value);
                              return (
                                <div key={sub.value}>
                                  <div style={{ display: "flex", alignItems: "center", padding: "6px 40px", borderBottom: "1px dashed #e0e0e0" }}>
                                    <input
                                      type="checkbox"
                                      checked={isSubSelected}
                                      onChange={() => handleSubcategorySelect(sub.value)}
                                      style={{ marginRight: "8px" }}
                                    />
                                    <span
                                      onClick={() => toggleSubcategoryExpand(cat.category, sub.value)}
                                      style={{ marginRight: "8px", cursor: "pointer" }}
                                    >
                                      {expanded.subcategories[sub.value] ? <FaMinus size={12} /> : <FaPlus size={12} />}
                                    </span>
                                    <span style={{ flex: 1 }}>{sub.label}</span>
                                    <span style={{ color: "#666" }}>{sub.count.toLocaleString()}</span>
                                  </div>
                                  {expanded.subcategories[sub.value] && (
                                    <div style={{ backgroundColor: "#f0f0f0" }}>
                                      {sub.subSubcategories.map(subSub => (
                                        <div
                                          key={subSub.value}
                                          style={{ display: "flex", alignItems: "center", padding: "6px 60px", borderBottom: "1px dashed #e0e0e0" }}
                                        >
                                          <input
                                            type="checkbox"
                                            checked={filters.subSubcategories.includes(subSub.value)}
                                            onChange={() => handleSubSubcategorySelect(subSub.value)}
                                            style={{ marginRight: "8px" }}
                                          />
                                          <span style={{ flex: 1 }}>{subSub.label}</span>
                                          <span style={{ color: "#666" }}>{subSub.count.toLocaleString()}</span>
                                        </div>
                                      ))}
                                      {sub.skip < sub.totalSubSubcategories && (
                                        <div style={{ padding: "10px 60px", textAlign: "center" }}>
                                          <button
                                            onClick={() => loadMoreSubSubcategories(cat.category, sub.value)}
                                            style={{
                                              padding: "5px 10px",
                                              backgroundColor: "#007bff",
                                              color: "#fff",
                                              border: "none",
                                              borderRadius: "4px",
                                              cursor: "pointer",
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
                              <div style={{ padding: "10px 40px", textAlign: "center" }}>
                                <button
                                  onClick={() => loadMoreSubcategories(cat.category)}
                                  style={{
                                    padding: "5px 10px",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "4px",
                                    cursor: "pointer",
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
                          backgroundColor: "#007bff",
                          color: "#fff",
                          border: "none",
                          borderRadius: "4px",
                          cursor: "pointer",
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
                <label style={{ display: "block", marginBottom: "5px" }}>Country:</label>
                <Select
                  options={countries}
                  value={filters.country}
                  onChange={selected => setFilters(prev => ({ ...prev, country: selected }))}
                  placeholder="Select Country"
                  isClearable
                  styles={customStyles}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>State:</label>
                <Select
                  options={states}
                  value={filters.state}
                  onChange={selected => setFilters(prev => ({ ...prev, state: selected }))}
                  placeholder="Select State"
                  isClearable
                  isDisabled={!filters.country}
                  styles={customStyles}
                />
              </div>
              <div style={{ marginBottom: "15px" }}>
                <label style={{ display: "block", marginBottom: "5px" }}>City:</label>
                <Select
                  options={cities}
                  value={filters.city}
                  onChange={selected => setFilters(prev => ({ ...prev, city: selected }))}
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
              <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>Order History</h3>
              {!user ? (
                <p>Please log in to view your order history.</p>
              ) : orders.length === 0 ? (
                <p>No orders found.</p>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Order Date</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Total Companies</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Price</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Status</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Selected Criteria</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          {new Date(order.createdAt).toLocaleString()}
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          {order.totalCount?.toLocaleString() || "0"}
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          ${order.price || "0"}
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          {formatString(order.status) || "Pending"}
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          {formatOrderCriteria(order.filters)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>

        <div style={{ width: "250px", borderLeft: "1px solid #e0e0e0", padding: "10px" }}>
          <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>SELECTED CRITERIA</h3>
          {activeFilters.length > 0 ? (
            <div>
              {activeFilters.map((filter, index) => (
                <div key={index} style={{ marginBottom: "10px", fontSize: "12px" }}>{filter}</div>
              ))}
              <button
                onClick={clearFilters}
                style={{ 
                  padding: "5px 10px", 
                  backgroundColor: "#ff0000", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "4px", 
                  cursor: "pointer" // Added cursor style
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <p style={{ fontSize: "12px", color: "#666" }}>No criteria selected.</p>
          )}
        </div>
      </div>

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

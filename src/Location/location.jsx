// Location.jsx
import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";

const Location = ({ onLocationChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    country: null,
    state: null,
    city: null,
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [error, setError] = useState(null);

  const fetchCountries = async () => {
    try {
      const countryRes = await axios.get("https://dsp-backend.onrender.com/api/companies/filters?field=Country");
      setCountries(countryRes.data.map((country) => ({ value: country, label: country })));
    } catch (err) {
      setError("Error loading countries.");
      console.error("Fetch Countries Error:", err.response?.data || err.message);
    }
  };

  const fetchDependentFilters = async () => {
    try {
      if (selectedFilters.country?.value) {
        const stateRes = await axios.get("https://dsp-backend.onrender.com/api/companies/filters?field=State", {
          params: { country: selectedFilters.country.value },
        });
        setStates(stateRes.data.map((state) => ({ value: state, label: state })));
      }
      if (selectedFilters.state?.value) {
        const cityRes = await axios.get("https://dsp-backend.onrender.com/api/companies/filters?field=City", {
          params: { country: selectedFilters.country.value, state: selectedFilters.state.value },
        });
        setCities(cityRes.data.map((city) => ({ value: city, label: city })));
      }
    } catch (err) {
      setError("Error loading dependent filters.");
      console.error("Fetch Dependent Filters Error:", err.response?.data || err.message);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  useEffect(() => {
    fetchDependentFilters();
    setSelectedFilters(prev => ({
      ...prev,
      state: null,
      city: null,
    }));
    onLocationChange({
      country: selectedFilters.country?.value || "",
      state: "",
      city: "",
    });
  }, [selectedFilters.country]);

  useEffect(() => {
    fetchDependentFilters();
    setSelectedFilters(prev => ({
      ...prev,
      city: null,
    }));
    onLocationChange({
      country: selectedFilters.country?.value || "",
      state: selectedFilters.state?.value || "",
      city: "",
    });
  }, [selectedFilters.state]);

  useEffect(() => {
    onLocationChange({
      country: selectedFilters.country?.value || "",
      state: selectedFilters.state?.value || "",
      city: selectedFilters.city?.value || "",
    });
  }, [selectedFilters.city]);

  const clearFilters = () => {
    setSelectedFilters({
      country: null,
      state: null,
      city: null,
    });
    onLocationChange({
      country: "",
      state: "",
      city: "",
    });
  };

  const customStyles = {
    control: (base) => ({
      ...base,
      border: "1px solid #ccc",
      boxShadow: "none",
      "&:hover": {
        border: "1px solid #ccc",
      },
      padding: "2px 5px",
      backgroundColor: "#fff",
      minHeight: "34px",
      fontSize: "14px",
    }),
    valueContainer: (base) => ({
      ...base,
      padding: "0 6px",
    }),
    input: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    menu: (base) => ({
      ...base,
      borderRadius: "4px",
      boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
      marginTop: "2px",
      zIndex: 1000,
    }),
    menuList: (base) => ({
      ...base,
      maxHeight: "250px",
      padding: 0,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected ? "#e0e0e0" : state.isFocused ? "#f0f0f0" : "#fff",
      color: "#333",
      padding: "6px 12px",
      fontSize: "14px",
      display: "flex",
      alignItems: "center",
    }),
    placeholder: (base) => ({
      ...base,
      color: "#999",
    }),
  };

  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ fontSize: "24px", marginBottom: "20px" }}>Location Filter</h1>
      <div style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
            Country:
          </label>
          <Select
            options={countries}
            onChange={(selected) => setSelectedFilters(prev => ({ ...prev, country: selected }))}
            placeholder="Select Country"
            isClearable
            value={selectedFilters.country}
            styles={customStyles}
            onMenuOpen={() => {
              setTimeout(() => {
                const menu = document.querySelector('.react-select__menu');
                if (menu) menu.scrollTop = 0;
              }, 0);
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
            State:
          </label>
          <Select
            options={states}
            onChange={(selected) => setSelectedFilters(prev => ({ ...prev, state: selected }))}
            placeholder="Select State"
            isClearable
            value={selectedFilters.state}
            isDisabled={!selectedFilters.country}
            styles={customStyles}
            onMenuOpen={() => {
              setTimeout(() => {
                const menu = document.querySelector('.react-select__menu');
                if (menu) menu.scrollTop = 0;
              }, 0);
            }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px", fontSize: "14px" }}>
            City:
          </label>
          <Select
            options={cities}
            onChange={(selected) => setSelectedFilters(prev => ({ ...prev, city: selected }))}
            placeholder="Select City"
            isClearable
            value={selectedFilters.city}
            isDisabled={!selectedFilters.state}
            styles={customStyles}
            onMenuOpen={() => {
              setTimeout(() => {
                const menu = document.querySelector('.react-select__menu');
                if (menu) menu.scrollTop = 0;
              }, 0);
            }}
          />
        </div>

        <button
          onClick={clearFilters}
          style={{
            padding: "8px 15px",
            backgroundColor: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default Location;
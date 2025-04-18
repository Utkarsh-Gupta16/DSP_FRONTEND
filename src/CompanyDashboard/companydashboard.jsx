import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "axios";
import ReactPaginate from "react-paginate";
import "../styles/companydashboard.css";

const CompanyDashboard = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: "",
    subCategory: "",
    state: "",
    country: "",
  });

  const [companyData, setCompanyData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 20;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);

  const formatString = (str) => {
    if (!str || str === "N/A") return str;
    return str
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const fetchFilterOptions = async () => {
    try {
      const [catRes, subCatRes, countryRes, stateRes] = await Promise.all([
        axios.get("https://dsp-backend.onrender.com/api/companies/filters?field=category"),
        axios.get("https://dsp-backend.onrender.com/api/companies/filters?field=subCategory"),
        axios.get("https://dsp-backend.onrender.com/api/companies/filters?field=Country"),
        axios.get("https://dsp-backend.onrender.com/api/companies/filters?field=State"),
      ]);
      setCategories(catRes.data.map((cat) => ({ value: cat, label: formatString(cat) })));
      setSubCategories(subCatRes.data.map((subCat) => ({ value: subCat, label: formatString(subCat) })));
      setCountries(countryRes.data.map((country) => ({ value: country, label: country })));
      setStates(stateRes.data.map((state) => ({ value: state, label: state })));
    } catch (err) {
      console.error("Error fetching filter options:", err.message);
      setError("Error loading filter options.");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log("Fetching company data from /api/companies/");
      const response = await axios.get("https://dsp-backend.onrender.com/api/companies/", {
        params: {
          category: selectedFilters.category,
          subCategory: selectedFilters.subCategory,
          country: selectedFilters.country,
          state: selectedFilters.state,
          limit: itemsPerPage,
          page: currentPage + 1, // API expects 1-based indexing
        },
      });
      console.log("Fetched data:", response.data);
      setCompanyData(response.data.companies || []);
      setTotalCount(response.data.totalCount || 0);
    } catch (err) {
      console.error("Fetch error:", err.message, err.response?.status, err.response?.data);
      setError("Error fetching company data. Please ensure the backend server is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  useEffect(() => {
    fetchData();
  }, [currentPage, selectedFilters]);

  const handlePageChange = (selectedPage) => {
    setCurrentPage(selectedPage.selected);
  };

  const handleFilterSelection = (field, value) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [field]: value || "",
      ...(field === "category" && { subCategory: "" }),
      ...(field === "country" && { state: "" }),
    }));
    setCurrentPage(0); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setSelectedFilters({
      category: "",
      subCategory: "",
      state: "",
      country: "",
    });
    setCurrentPage(0);
  };

  if (loading) {
    return (
      <div className="loading-spinner" style={{ textAlign: "center", marginTop: "50px" }}>
        <div className="spinner"></div>
        <p style={{ marginTop: "10px", marginLeft: "10px", fontSize: "20px", color: "#555" }}>Fetching data, please wait...</p>
      </div>
    );
  }

  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <h1 style={{ textAlign: "center" }}>Company Dashboard</h1>
      <div className="filters">
        <label style={{ marginRight: "10px" }}>
          Category:
          <Select
            options={categories}
            onChange={(selected) => handleFilterSelection("category", selected?.value)}
            placeholder="Select Category"
            isClearable
            value={selectedFilters.category ? { value: selectedFilters.category, label: formatString(selectedFilters.category) } : null}
          />
        </label>

        <label style={{ marginRight: "10px" }}>
          Sub Category:
          <Select
            options={subCategories}
            onChange={(selected) => handleFilterSelection("subCategory", selected?.value)}
            placeholder="Select Sub Category"
            isClearable
            value={selectedFilters.subCategory ? { value: selectedFilters.subCategory, label: formatString(selectedFilters.subCategory) } : null}
          />
        </label>

        <label style={{ marginRight: "10px" }}>
          Country:
          <Select
            options={countries}
            onChange={(selected) => handleFilterSelection("country", selected?.value)}
            placeholder="Select Country"
            isClearable
            value={selectedFilters.country ? { value: selectedFilters.country, label: selectedFilters.country } : null}
          />
        </label>

        <label style={{ marginRight: "10px" }}>
          State:
          <Select
            options={states}
            onChange={(selected) => handleFilterSelection("state", selected?.value)}
            placeholder="Select State"
            isClearable
            value={selectedFilters.state ? { value: selectedFilters.state, label: selectedFilters.state } : null}
          />
        </label>

        <button onClick={clearFilters} style={{ marginTop: "10px", padding: "5px 10px", marginLeft: "10px" }}>
          Clear Filters
        </button>
        <button onClick={fetchData} style={{ marginTop: "10px", padding: "5px 10px", marginLeft: "10px" }}>
          Refresh Data
        </button>
      </div>

      <table className="company-table">
        <thead>
          <tr>
            <th>Business Name</th>
            <th>Address</th>
            <th>State</th>
            <th>Country</th>
            <th>Category</th>
            <th>Subcategory</th>
          </tr>
        </thead>
        <tbody>
          {companyData.length > 0 ? (
            companyData.map((company) => (
              <tr key={company._id}>
                <td>{company["Business Name"] || "N/A"}</td>
                <td>{company["Address"] || "N/A"}</td>
                <td>{company["State"] || "N/A"}</td>
                <td>{company["Country"] || "N/A"}</td>
                <td>{formatString(company["category"]) || "N/A"}</td>
                <td>{formatString(company["subcategory"]) || "N/A"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" align="center">
                No data found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"Previous"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={Math.ceil(totalCount / itemsPerPage)}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageChange}
        containerClassName={"pagination"}
        activeClassName={"active"}
        previousClassName={"page-item"}
        nextClassName={"page-item"}
        pageClassName={"page-item"}
        pageLinkClassName={"page-link"}
        previousLinkClassName={"page-link"}
        nextLinkClassName={"page-link"}
      />
    </div>
  );
};

export default CompanyDashboard;
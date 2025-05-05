import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DemoRequestsTab from "./DemoRequestsTab";
import { FaHome, FaChartBar, FaTasks, FaPrint, FaBell, FaCog, FaSortDown, FaSignOutAlt } from "react-icons/fa";
import "./adminDashboard.css";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [assignedCompanies, setAssignedCompanies] = useState([]);
  const [individualTasks, setIndividualTasks] = useState({});
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [distributionAlert, setDistributionAlert] = useState(null);
  const navigate = useNavigate();

  const generalAddonOptions = [
    { value: "website", label: "Website" },
    { value: "mailIds", label: "Mail IDs" },
    { value: "linkedinProfile", label: "LinkedIn Profile" },
    { value: "headquarterAddress", label: "Headquarter Address" },
    { value: "foundationYear", label: "Foundation Year" },
    { value: "presentInCountries", label: "Present in Countries" },
    { value: "locationOfEachCountryOffice", label: "Location of Each Country's Office" },
    { value: "contactNumber", label: "Contact Number" },
    { value: "subsidiaries", label: "Subsidiaries" },
    { value: "employeeGrowth", label: "Employee Growth" },
  ];

  const decisionMakerOptions = [
    { value: "businessDevelopmentManager", label: "Business Development Manager" },
    { value: "cco", label: "CCO (Chief Commercial Officer / Chief Customer Officer)" },
    { value: "cdo", label: "CDO (Chief Digital Officer / Chief Data Officer)" },
    { value: "ceo", label: "CEO (Chief Executive Officer)" },
    { value: "cfo", label: "CFO (Chief Financial Officer)" },
    { value: "chro", label: "CHRO (Chief Human Resources Officer)" },
    { value: "cio", label: "CIO (Chief Information Officer)" },
    { value: "ciso", label: "CISO (Chief Information Security Officer)" },
    { value: "cmo", label: "CMO (Chief Marketing Officer)" },
    { value: "coFounder", label: "Co-Founder" },
    { value: "coo", label: "COO (Chief Operating Officer)" },
    { value: "cpo", label: "CPO (Chief Product Officer / Chief Procurement Officer)" },
    { value: "cro", label: "CRO (Chief Revenue Officer)" },
    { value: "cso", label: "CSO (Chief Strategy Officer)" },
    { value: "cto", label: "CTO (Chief Technology Officer)" },
    { value: "customerSuccessManager", label: "Customer Success Manager" },
    { value: "cxo", label: "CXO (Chief Experience Officer)" },
    { value: "cybersecurityDirector", label: "Cybersecurity Director" },
    { value: "cybersecurityManager", label: "Cybersecurity Manager" },
    { value: "devOpsManager", label: "DevOps Manager" },
    { value: "directorOfBusinessDevelopment", label: "Director of Business Development" },
    { value: "directorOfDigitalMarketing", label: "Director of Digital Marketing" },
    { value: "directorOfFinance", label: "Director of Finance" },
    { value: "directorOfHr", label: "Director of HR / Talent Acquisition" },
    { value: "directorOfIt", label: "Director of IT / Technology" },
    { value: "directorOfMarketing", label: "Director of Marketing" },
    { value: "directorOfOperations", label: "Director of Operations" },
    { value: "directorOfProcurement", label: "Director of Procurement" },
    { value: "directorOfProductManagement", label: "Director of Product Management" },
    { value: "directorOfSales", label: "Director of Sales" },
    { value: "directorOfStrategy", label: "Director of Strategy" },
    { value: "directorOfSupplyChain", label: "Director of Supply Chain & Procurement" },
    { value: "directorOfTalentAcquisition", label: "Director of Talent Acquisition" },
    { value: "ecommerceDirector", label: "E-commerce Director" },
    { value: "ecommerceManager", label: "E-commerce Manager" },
    { value: "evp", label: "EVP / Executive Vice President" },
    { value: "financeAccounting", label: "Finance & Accounting" },
    { value: "financeDirector", label: "Finance Director" },
    { value: "financialController", label: "Financial Controller" },
    { value: "founder", label: "Founder" },
    { value: "founderCoFounder", label: "Founder / Co-Founder" },
    { value: "gm", label: "GM / General Manager" },
    { value: "headOfBusinessDevelopment", label: "Head of Business Development" },
    { value: "headOfCloudInfrastructure", label: "Head of Cloud & Infrastructure" },
    { value: "headOfCustomerSuccess", label: "Head of Customer Success" },
    { value: "headOfDigitalTransformation", label: "Head of Digital Transformation" },
    { value: "headOfGrowthStrategy", label: "Head of Growth & Strategy" },
    { value: "headOfHr", label: "Head of HR / People Operations" },
    { value: "headOfIt", label: "Head of IT / Technology" },
    { value: "headOfItInfrastructure", label: "Head of IT Infrastructure" },
    { value: "headOfManufacturing", label: "Head of Manufacturing / Production" },
    { value: "headOfMarketing", label: "Head of Marketing / Digital Marketing" },
    { value: "headOfMarketplaceManagement", label: "Head of Marketplace Management" },
    { value: "headOfPartnerships", label: "Head of Partnerships" },
    { value: "headOfPerformanceMarketing", label: "Head of Performance Marketing" },
    { value: "headOfPropertyManagement", label: "Head of Property Management" },
    { value: "headOfSales", label: "Head of Sales" },
    { value: "headOfSeoPpcSocialMedia", label: "Head of SEO / PPC / Social Media" },
    { value: "headOfSoftwareDevelopment", label: "Head of Software Development" },
    { value: "headOfStrategy", label: "Head of Strategy" },
    { value: "hrBusinessPartner", label: "HR Business Partner" },
    { value: "investmentManager", label: "Investment Manager" },
    { value: "itDirector", label: "IT Director" },
    { value: "itManager", label: "IT Manager" },
    { value: "technologyManager", label: "Technology Manager" },
    { value: "managingBroker", label: "Managing Broker" },
    { value: "md", label: "MD / Managing Director" },
    { value: "marketingManager", label: "Marketing Manager" },
    { value: "operationsManager", label: "Operations Manager" },
    { value: "owner", label: "Owner" },
    { value: "partner", label: "Partner" },
    { value: "performanceMarketingManager", label: "Performance Marketing Manager" },
    { value: "president", label: "President" },
    { value: "principal", label: "Principal" },
    { value: "procurementManager", label: "Procurement Manager" },
    { value: "productManager", label: "Product Manager" },
    { value: "realEstateDeveloper", label: "Real Estate Developer" },
    { value: "riskComplianceOfficer", label: "Risk & Compliance Officer" },
    { value: "salesManager", label: "Sales Manager" },
    { value: "securityManager", label: "Security Manager" },
    { value: "seniorBusinessDevelopmentManager", label: "Senior Business Development Manager" },
    { value: "seniorItManager", label: "Senior IT Manager" },
    { value: "seniorMarketingManager", label: "Senior Marketing Manager" },
    { value: "seniorProcurementManager", label: "Senior Procurement Manager" },
    { value: "seniorVicePresident", label: "Senior Vice President (SVP)" },
    { value: "supplyChainManager", label: "Supply Chain Manager" },
    { value: "vpBusinessDevelopment", label: "Vice President / VP of Business Development" },
    { value: "vpCustomerSuccess", label: "Vice President / VP of Customer Success" },
    { value: "vpEngineering", label: "Vice President / VP of Engineering" },
    { value: "vpFinance", label: "Vice President / VP of Finance" },
    { value: "vpIt", label: "Vice President / VP of IT / Technology" },
    { value: "vpMarketing", label: "Vice President / VP of Marketing" },
    { value: "vpOperations", label: "Vice President / VP of Operations" },
    { value: "vpSales", label: "Vice President / VP of Sales / Online Sales" },
    { value: "vpStrategy", label: "Vice President / VP of Strategy" },
    { value: "vpTechnology", label: "Vice President / VP of Technology" },
    { value: "vpHr", label: "Vice President / VP of HR" },
    { value: "vpProduct", label: "Vice President / VP of Product" },
  ];

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in again.");
      navigate("/admin-login");
      return;
    }
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.role !== "admin") {
        setError("You are not authorized to access this page.");
        navigate("/count");
      } else {
        fetchData(token);
      }
    } else {
      navigate("/admin-login");
    }
  }, [navigate]);

  const fetchData = async (token) => {
    try {
      const [
        ordersResponse,
        assignedCompaniesResponse,
        tasksResponse,
        employeesResponse,
        pendingApprovalsResponse,
      ] = await Promise.all([
        axios.get("https://dsp-backend.onrender.com/api/payment/orders", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://dsp-backend.onrender.com/api/payment/admin/assigned-companies", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://dsp-backend.onrender.com/api/payment/admin/tasks", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://dsp-backend.onrender.com/api/users/employee", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("https://dsp-backend.onrender.com/api/company-details/pending-approvals", { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      setOrders(ordersResponse.data || []);
      const newAssignedCompaniesPerOrder = assignedCompaniesResponse.data.reduce((acc, assignment) => {
        acc[assignment._id] = assignment.totalCompaniesAssigned || 0;
        return acc;
      }, {});
      setOrders((prevOrders) =>
        prevOrders.map((order) => ({
          ...order,
          assignedCompanies: newAssignedCompaniesPerOrder[order._id] || 0,
          remainingCompanies: (order.totalCount || 0) - (newAssignedCompaniesPerOrder[order._id] || 0),
          approvedCompanies: order.approvedCompanies || 0,
        }))
      );

      setAssignedCompanies(assignedCompaniesResponse.data || []);
      const tasksByEmployee = tasksResponse.data.reduce((acc, task) => {
        if (!acc[task.employeeId]) acc[task.employeeId] = [];
        acc[task.employeeId].push(task);
        return acc;
      }, {});
      setIndividualTasks(tasksByEmployee);
      setEmployees(employeesResponse.data || []);
      setPendingApprovals(pendingApprovalsResponse.data || []);
    } catch (err) {
      console.error("Fetch data error:", err.response?.data || err.message);
      setError(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/admin-login");
  };

  const distributeCompanies = async (orderId, totalCompanies) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate("/login");
        return;
      }
      if (employees.length === 0) {
        setError("No employees available to distribute companies.");
        return;
      }
      const orderResponse = await axios.get(`https://dsp-backend.onrender.com/api/payment/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const order = orderResponse.data;
      const normalizedSubcategories = order.filters.subcategories.map(subcat => subcat.split(':').pop().trim());
      const query = {
        ...(order.filters.categories.length > 0 && { category: { $in: order.filters.categories } }),
        ...(normalizedSubcategories.length > 0 && { subcategory: { $in: normalizedSubcategories } }),
        ...(order.filters.subSubcategories.length > 0 && { Categories: { $in: order.filters.subSubcategories } }),
        ...(order.filters.country?.value && { Country: order.filters.country.value }),
        ...(order.filters.state?.value && { State: order.filters.state.value }),
        ...(order.filters.city?.value && { City: order.filters.city.value }),
      };
      const companyCountResponse = await axios.post(
        "https://dsp-backend.onrender.com/api/payment/count-companies",
        { query },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const availableCompanies = parseInt(companyCountResponse.data.count) || 0;
      if (availableCompanies === 0) {
        setError("No companies match the filters.");
        return;
      }
      let remainingCompanies = Math.min(totalCompanies, availableCompanies);
      const batchSize = Math.min(100, Math.ceil(remainingCompanies / employees.length));
      const tasks = [];
      let startIndex = 0;

      for (const employee of employees) {
        if (remainingCompanies <= 0) break;
        const companyCount = Math.min(batchSize, remainingCompanies);
        const endIndex = startIndex + companyCount - 1;
        tasks.push(
          axios.post(
            "https://dsp-backend.onrender.com/api/payment/admin/assign-task",
            { orderId, employeeId: employee._id, companyCount, startIndex, endIndex },
            { headers: { Authorization: `Bearer ${token}` } }
          )
        );
        remainingCompanies -= companyCount;
        startIndex = endIndex + 1;
      }

      const results = await Promise.all(tasks);
      const totalAssigned = results.reduce((sum, res) => sum + res.data.task.companyCount, 0);
      setDistributionAlert(`Total ${totalAssigned} companies assigned. ${remainingCompanies} remaining.`);
      setTimeout(() => setDistributionAlert(null), 5000);
      alert("Companies distributed successfully! Remaining companies can be assigned later.");
      fetchData(token);
    } catch (err) {
      console.error("Distribute Companies Error:", err.response?.data || err.message);
      setError(`Failed to distribute companies: ${err.response?.data?.message || err.message}`);
    }
  };

  const getApprovedCompanies = (orderId) => {
    const order = orders.find((o) => o._id === orderId);
    return order ? order.approvedCompanies || 0 : 0;
  };

  const sendEmailWithCSV = async (order) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate("/login");
        return;
      }

      const orderId = order._id || "";
      const email = order.email || "default@example.com";
      const userName = order.userName || "Unknown User";
      const totalCount = order.totalCount || 0;
      const approvedCount = getApprovedCompanies(orderId) || 0;

      const addOns = order.addOns || [];
      const response = await axios.post(
        "https://dsp-backend.onrender.com/api/admin/email/send-order-email",
        {
          orderId,
          email,
          userName,
          totalCount,
          approvedCount,
          addOns,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Email with CSV sent successfully!");
    } catch (err) {
      console.error("Send email error:", err.response?.data || err.message);
      setError(`Failed to send email: ${err.response?.data?.message || err.message}`);
    }
  };

  const assignTaskToEmployee = async (e) => {
    e.preventDefault();
    if (!selectedOrder) {
      setError("Please select an order first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate("/login");
        return;
      }
      const { employeeId, companyCount } = e.target.elements;
      const companyCountValue = parseInt(companyCount.value, 10);
      if (isNaN(companyCountValue) || companyCountValue <= 0 || companyCountValue > 100) {
        setError("Please enter a valid number of companies between 1 and 100.");
        return;
      }

      const payload = {
        orderId: selectedOrder._id,
        employeeId: employeeId.value,
        companyCount: companyCountValue,
      };
      const response = await axios.post(
        "https://dsp-backend.onrender.com/api/payment/admin/assign-task",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert(`Task assigned to ${employees.find((emp) => emp._id === employeeId.value)?.name || employeeId.value} successfully!`);
      setSelectedOrder(null);
      fetchData(token);
    } catch (err) {
      console.error("Assign task error:", err.response?.data || err.message);
      setError(`Failed to assign task: ${err.response?.data?.message || err.message}`);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate("/login");
        return;
      }
      await axios.put(
        `https://dsp-backend.onrender.com/api/payment/admin/update-order-status/${orderId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Order status updated to ${newStatus} successfully!`);
      fetchData(token);
    } catch (err) {
      console.error("Update status error:", err.response?.data || err.message);
      setError(`Failed to update status: ${err.response?.data?.message || err.message}`);
    }
  };

  const deleteEmployeeTasks = async (employeeId) => {
    if (window.confirm(`Are you sure you want to delete all tasks for ${employees.find((emp) => emp._id === employeeId)?.name || employeeId}?`)) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in again.");
          navigate("/login");
          return;
        }
        await axios.delete(`https://dsp-backend.onrender.com/api/payment/admin/delete-tasks/${employeeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(`Tasks deleted successfully for ${employees.find((emp) => emp._id === employeeId)?.name || employeeId}`);
        fetchData(token);
      } catch (err) {
        console.error("Delete tasks error:", err.response?.data || err.message);
        setError(`Failed to delete tasks: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const deleteSpecificTask = async (taskId) => {
    if (window.confirm(`Are you sure you want to delete this task with ID ${taskId}?`)) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in again.");
          navigate("/login");
          return;
        }
        await axios.delete(`https://dsp-backend.onrender.com/api/payment/admin/delete-task/${taskId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert(`Task with ID ${taskId} deleted successfully`);
        fetchData(token);
      } catch (err) {
        console.error("Delete task error:", err.response?.data || err.message);
        setError(`Failed to delete task: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  const clearAllTasks = async () => {
    if (window.confirm("Are you sure you want to clear all tasks for all employees? This action cannot be undone!")) {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in again.");
          navigate("/login");
          return;
        }
        await axios.delete(`https://dsp-backend.onrender.com/api/payment/admin/clear-all-tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("All tasks cleared successfully!");
        fetchData(token);
      } catch (err) {
        console.error("Clear all tasks error:", err.response?.data || err.message);
        setError(`Failed to clear all tasks: ${err.response?.data?.message || err.message}`);
      }
    }
  };

  if (error) {
    return (
      <div style={{ padding: "20px", color: "#EF4444", textAlign: "center", fontSize: "16px", fontFamily: "'Poppins', sans-serif" }}>
        {error}
      </div>
    );
  }

  const pendingOrders = orders.filter((order) => order.status === "pending_delivery");
  const completedOrders = orders.filter((order) => order.status === "completed");
  const failedOrders = orders.filter((order) => order.status === "failed");

  return (
    <div className="admin-dashboard" style={{ display: "flex", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      {/* Sidebar */}
      <div
        style={{
          width: "80px",
          backgroundColor: "#F9FAFB",
          padding: "20px 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRight: "1px solid #E5E7EB",
        }}
      >
        <div style={{ marginBottom: "40px" }}>
          <FaHome style={{ fontSize: "24px", color: "#3B82F6" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <FaChartBar style={{ fontSize: "24px", color: "#6B7280" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <FaTasks style={{ fontSize: "24px", color: "#6B7280" }} />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <FaPrint style={{ fontSize: "24px", color: "#6B7280" }} />
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "#F9FAFB" }}>
        {/* Top Navigation Bar */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #E5E7EB",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "24px", fontSize: "20px", fontWeight: "600", color: "#1F2937" }}>
              COMPANY LOGO
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {user && (
              <span style={{ fontSize: "14px", color: "#1F2937" }}>
                Welcome, Admin {user.name || "User"}!
              </span>
            )}
            <img src="assets/user-image.png" alt="" style={{ width: "32px", height: "32px", borderRadius: "50%", backgroundColor: "#D1D5DB" }} />
            <FaSignOutAlt style={{ fontSize: "20px", color: "#6B7280", cursor: "pointer" }} onClick={handleLogout} />
          </div>
        </div>

        {/* Main Content Area */}
        <div style={{ padding: "24px", flex: 1 }}>
          <h2 className="dashboard-title">Admin Dashboard</h2>

          {/* Tabs */}
          <div className="dashboard-tabs">
            {[
              { key: "pending", label: "Pending Orders" },
              { key: "completed", label: "Complete Orders" },
              { key: "failed", label: "Failed Orders" },
              { key: "assigned", label: "Assigned Companies" },
              { key: "approvals", label: "Request for Approval" },
              { key: "demo-requests", label: "Demo Approval" },
            ].map((tab) => (
              <div
                key={tab.key}
                className={`dashboard-tab${activeTab === tab.key ? " active" : ""}`}
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </div>
            ))}
          </div>

          {/* Distribution Alert */}
          {distributionAlert && (
            <div
              style={{
                backgroundColor: "#ECFDF5",
                color: "#059669",
                padding: "12px 16px",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
              }}
            >
              {distributionAlert}
            </div>
          )}

          {/* Pending Orders */}
          {activeTab === "pending" && (
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>
                      Order ID <span className="sort-arrow">↓</span>
                    </th>
                    <th>Total Companies</th>
                    <th>Assigned Companies</th>
                    <th>Remaining Companies</th>
                    <th>Approved Companies</th>
                    <th>Action</th>
                    <th>Send Email</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.totalCount}</td>
                      <td>{order.assignedCompanies || 0}</td>
                      <td>{order.remainingCompanies || order.totalCount}</td>
                      <td>{getApprovedCompanies(order._id)}</td>
                      <td>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                          <button className="btn alice" onClick={() => distributeCompanies(order._id, order.remainingCompanies)}>
                            Distribute
                          </button>
                          <button className="btn blue" onClick={() => setSelectedOrder(order)}>
                            Assigned Task
                          </button>
                          <button className="btn green" onClick={() => updateOrderStatus(order._id, "completed")}>
                            Mark Complete
                          </button>
                          <button className="btn red" onClick={() => updateOrderStatus(order._id, "failed")}>
                            Mark Failed
                          </button>
                        </div>
                      </td>
                      <td>
                        <button className="btn navy" onClick={() => sendEmailWithCSV(order)}>
                          Send Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Task Assignment Form */}
              {selectedOrder && (
                <div
                  style={{
                    marginTop: "24px",
                    padding: "16px",
                    backgroundColor: "#FFFFFF",
                    borderRadius: "8px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                    maxWidth: "400px",
                    margin: "24px auto",
                  }}
                >
                  <h4
                    style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#1F2937",
                      marginBottom: "16px",
                    }}
                  >
                    Assign Task for Order {selectedOrder._id}
                  </h4>
                  <form onSubmit={assignTaskToEmployee}>
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        htmlFor="employeeId"
                        style={{ display: "block", fontSize: "14px", color: "#1F2937", marginBottom: "8px" }}
                      >
                        Select Employee
                      </label>
                      <select
                        id="employeeId"
                        name="employeeId"
                        required
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "4px",
                          fontSize: "14px",
                          color: "#1F2937",
                        }}
                      >
                        <option value="">Select an employee</option>
                        {employees.map((emp) => (
                          <option key={emp._id} value={emp._id}>
                            {emp.name} ({emp.email})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div style={{ marginBottom: "16px" }}>
                      <label
                        htmlFor="companyCount"
                        style={{ display: "block", fontSize: "14px", color: "#1F2937", marginBottom: "8px" }}
                      >
                        Number of Companies (1-100)
                      </label>
                      <input
                        type="number"
                        id="companyCount"
                        name="companyCount"
                        min="1"
                        max="100"
                        required
                        style={{
                          width: "100%",
                          padding: "8px",
                          border: "1px solid #E5E7EB",
                          borderRadius: "4px",
                          fontSize: "14px",
                          color: "#1F2937",
                        }}
                      />
                    </div>
                    <div style={{ display: "flex", gap: "12px" }}>
                      <button
                        type="submit"
                        className="btn green"
                        style={{ flex: 1 }}
                      >
                        Assign Task
                      </button>
                      <button
                        type="button"
                        className="btn"
                        style={{ flex: 1, backgroundColor: "#6B7280" }}
                        onClick={() => setSelectedOrder(null)}
                        onMouseOver={(e) => (e.target.style.backgroundColor = "#4B5563")}
                        onMouseOut={(e) => (e.target.style.backgroundColor = "#6B7280")}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Completed Orders */}
          {activeTab === "completed" && (
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>
                      Order ID <span className="sort-arrow">↓</span>
                    </th>
                    <th>Total Companies</th>
                    <th>Assigned Companies</th>
                  </tr>
                </thead>
                <tbody>
                  {completedOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.totalCount}</td>
                      <td>{order.assignedCompanies || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Failed Orders */}
          {activeTab === "failed" && (
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>
                      Order ID <span className="sort-arrow">↓</span>
                    </th>
                    <th>Total Companies</th>
                    <th>Assigned Companies</th>
                  </tr>
                </thead>
                <tbody>
                  {failedOrders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id}</td>
                      <td>{order.totalCount}</td>
                      <td>{order.assignedCompanies || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Assigned Companies */}
          {activeTab === "assigned" && (
            <div className="dashboard-table-container">
              <div style={{ padding: "16px" }}>
                <button className="btn red" onClick={clearAllTasks}>
                  Clear All Tasks
                </button>
              </div>
              {Object.keys(individualTasks).map((employeeId) => {
                const employeeTasks = individualTasks[employeeId];
                const employee = employees.find((emp) => emp._id === employeeId);
                return (
                  <div key={employeeId} style={{ marginBottom: "24px", padding: "0 16px" }}>
                    <h4
                      style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#1F2937",
                        marginBottom: "16px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {employee
                        ? `${employee.name} (${employee.email})`
                        : `Employee ID: ${employeeId}`}
                      <button
                        className="btn red"
                        style={{ marginLeft: "12px" }}
                        onClick={() => deleteEmployeeTasks(employeeId)}
                      >
                        Delete All Tasks
                      </button>
                    </h4>
                    <table className="dashboard-table">
                      <thead>
                        <tr>
                          {[
                            "Task ID",
                            "Order ID",
                            "Company Count",
                            "Range",
                            "Assigned Date",
                            "Submit Till Date",
                            "Status",
                            "Action",
                          ].map((header) => (
                            <th key={header}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {employeeTasks.map((task) => (
                          <tr key={task._id}>
                            <td>{task._id}</td>
                            <td>{task.orderId}</td>
                            <td>{task.companyCount}</td>
                            <td>{task.startIndex + 1} to {task.endIndex + 1}</td>
                            <td>{new Date(task.assignedDate).toLocaleDateString()}</td>
                            <td>
                              {task.submitTillDate
                                ? new Date(task.submitTillDate).toLocaleDateString()
                                : "N/A"}
                            </td>
                            <td>{task.status}</td>
                            <td>
                              <button
                                className="btn red"
                                style={{ width: "80px" }}
                                onClick={() => deleteSpecificTask(task._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}

          {/* Pending Approvals */}
          {activeTab === "approvals" && (
            <div className="dashboard-table-container">
              <table className="dashboard-table">
                <thead>
                  <tr>
                    <th>Company Name</th>
                    <th>Employee</th>
                    <th>Submitted Date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingApprovals.map((approval) => (
                    <tr key={approval._id}>
                      <td>{approval.companyId.businessName || `Unknown (ID: ${approval.companyId._id})`}</td>
                      <td>{approval.employeeId.name} ({approval.employeeId.email})</td>
                      <td>{new Date(approval.submittedDate).toLocaleDateString()}</td>
                      <td>
                        <button
                          className="btn blue"
                          style={{ width: "100px" }}
                          onClick={() => navigate(`/company-details/${approval._id}`)}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Demo Requests */}
          {activeTab === "demo-requests" && <DemoRequestsTab />}
        </div>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            .admin-dashboard {
              flex-direction: column;
            }

            /* Sidebar adjustments */
            .admin-dashboard > div:first-child {
              width: 100%;
              flex-direction: row;
              justify-content: space-around;
              padding: 10px;
              position: fixed;
              bottom: 0;
              left: 0;
              z-index: 1000;
              border-right: none;
              border-top: 1px solid #E5E7EB;
              background-color: #F9FAFB;
            }

            .admin-dashboard > div:first-child > div {
              margin: 0;
            }

            .admin-dashboard > div:first-child > div svg {
              font-size: 20px;
            }

            /* Top navigation bar */
            .admin-dashboard > div:nth-child(2) > div:first-child {
              padding: 10px 15px;
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }

            .admin-dashboard > div:nth-child(2) > div:first-child > div:first-child {
              margin-right: 0;
              font-size: 16px;
            }

            .admin-dashboard > div:nth-child(2) > div:first-child > div:last-child {
              flex-direction: row;
              gap: 10px;
              width: 100%;
              justify-content: flex-end;
            }

            .admin-dashboard > div:nth-child(2) > div:first-child > div:last-child span {
              font-size: 12px;
            }

            .admin-dashboard > div:nth-child(2) > div:first-child > div:last-child img {
              width: 24px;
              height: 24px;
            }

            .admin-dashboard > div:nth-child(2) > div:first-child > div:last-child svg {
              font-size: 16px;
            }

            /* Main content area */
            .admin-dashboard > div:nth-child(2) > div:last-child {
              padding: 15px;
              padding-bottom: 80px; /* Account for fixed sidebar */
            }

            .dashboard-title {
              font-size: 20px !important;
            }

            /* Tabs */
            .dashboard-tabs {
              flex-wrap: wrap;
              gap: 8px;
            }

            .dashboard-tab {
              padding: 8px 12px !important;
              font-size: 12px !important;
            }

            /* Distribution alert */
            .admin-dashboard > div:nth-child(2) > div:last-child > div[style*="backgroundColor: #ECFDF5"] {
              font-size: 12px;
              padding: 10px;
            }

            /* Tables */
            .dashboard-table-container {
              overflow-x: auto;
            }

            .dashboard-table {
              display: block;
              width: 100%;
              overflow-x: auto;
              white-space: nowrap;
            }

            .dashboard-table thead,
            .dashboard-table tbody,
            .dashboard-table tr {
              display: table;
              width: 100%;
              table-layout: fixed;
            }

            .dashboard-table th,
            .dashboard-table td {
              padding: 8px;
              font-size: 12px;
              min-width: 100px;
            }

            .dashboard-table th:first-child,
            .dashboard-table td:first-child {
              min-width: 80px;
            }

            /* Buttons in tables */
            .dashboard-table td div[style*="display: flex"] {
              flex-direction: column;
              gap: 5px;
            }

            .dashboard-table button {
              padding: 6px 10px !important;
              font-size: 11px !important;
              width: 100%;
            }

            /* Task assignment form */
            .dashboard-table-container > div[style*="maxWidth: 400px"] {
              max-width: 100%;
              padding: 12px;
              margin: 15px 0;
            }

            .dashboard-table-container > div[style*="maxWidth: 400px"] h4 {
              font-size: 14px;
            }

            .dashboard-table-container > div[style*="maxWidth: 400px"] label {
              font-size: 12px;
            }

            .dashboard-table-container > div[style*="maxWidth: 400px"] select,
            .dashboard-table-container > div[style*="maxWidth: 400px"] input {
              padding: 6px;
              font-size: 12px;
            }

            .dashboard-table-container > div[style*="maxWidth: 400px"] div[style*="display: flex"] {
              flex-direction: column;
              gap: 8px;
            }

            .dashboard-table-container > div[style*="maxWidth: 400px"] button {
              padding: 8px;
              font-size: 12px;
            }

            /* Assigned companies section */
            .dashboard-table-container > div[style*="padding: 16px"] {
              padding: 10px;
            }

            .dashboard-table-container > div[style*="marginBottom: 24px"] {
              margin-bottom: 15px;
              padding: 0 10px;
            }

            .dashboard-table-container > div[style*="marginBottom: 24px"] h4 {
              font-size: 14px;
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }

            .dashboard-table-container > div[style*="marginBottom: 24px"] button {
              margin-left: 0;
              width: 100%;
              padding: 6px;
              font-size: 11px;
            }
          }
        `}
      </style>
    </div>
  );
};

export default AdminDashboard;
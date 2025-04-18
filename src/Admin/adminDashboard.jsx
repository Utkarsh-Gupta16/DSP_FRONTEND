import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DemoRequestsTab from "./DemoRequestsTab";

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
  const [selectedApproval, setSelectedApproval] = useState(null);
  const navigate = useNavigate();

  const generalAddonOptions = [
    { value: "website", label: "Website" },
    { value: "mailIds", label: "Mail IDs" },
    { value: "linkedinProfile", label: "LinkedIn Profile" },
    { value: "headquarterAddress", label: "Headquarter Address" },
    { value: "foundationYear", label: "Foundation Year" },
    { value: "presentInCountries", label: "Present in Countries" },
    { value: "locationOfEachCountryOffice", label: "Location of Each Country's Office" },
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
      navigate("/login");
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
      navigate("/login");
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
    navigate("/login");
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

  const updateApprovalStatus = async (companyDetailId, status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate("/login");
        return;
      }
      const response = await axios.put(
        `https://dsp-backend.onrender.com/api/company-details/approve-company-details/${companyDetailId}`,
        { status, returnToEmployee: status === "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Approval status updated to ${status} successfully!`);
      fetchData(token);
      setSelectedApproval(null);
    } catch (err) {
      console.error("Update approval status error:", err.response?.data || err.message);
      setError(`Failed to update approval status: ${err.response?.data?.message || err.message}`);
    }
  };

  if (error) return <div style={{ padding: "20px", color: "red" }}>{error}</div>;

  const pendingOrders = orders.filter((order) => order.status === "pending_delivery");
  const completedOrders = orders.filter((order) => order.status === "completed");
  const failedOrders = orders.filter((order) => order.status === "failed");

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {user && (
        <div style={{ marginBottom: "20px", textAlign: "right" }}>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#28a745" }}>
            Welcome, Admin {user.name || "User"}
          </span>
          <button
            onClick={handleLogout}
            style={{
              marginLeft: "10px",
              padding: "5px 10px",
              backgroundColor: "#ff0000",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      )}

      <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Admin Dashboard</h2>

      <div style={{ marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("pending")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "pending" ? "#28a745" : "#e0e0e0",
            color: activeTab === "pending" ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Pending Orders
        </button>
        <button
          onClick={() => setActiveTab("completed")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "completed" ? "#28a745" : "#e0e0e0",
            color: activeTab === "completed" ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Completed Orders
        </button>
        <button
          onClick={() => setActiveTab("failed")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "failed" ? "#28a745" : "#e0e0e0",
            color: activeTab === "failed" ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Failed Orders
        </button>
        <button
          onClick={() => setActiveTab("assigned")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "assigned" ? "#28a745" : "#e0e0e0",
            color: activeTab === "assigned" ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Assigned Companies
        </button>
        <button
          onClick={() => setActiveTab("approvals")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "approvals" ? "#28a745" : "#e0e0e0",
            color: activeTab === "approvals" ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Request for Approval
        </button>
        <button
          onClick={() => setActiveTab("demo-requests")}
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            backgroundColor: activeTab === "demo-requests" ? "#28a745" : "#e0e0e0",
            color: activeTab === "demo-requests" ? "#fff" : "#333",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Demo Requests
        </button>
      </div>

      {distributionAlert && (
        <div style={{ color: "green", marginBottom: "10px" }}>{distributionAlert}</div>
      )}

      {activeTab === "pending" && (
        <div style={{ overflowX: "auto" }}>
          <h3>Pending Orders</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Order ID</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Total Companies</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Assigned Companies</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Remaining Companies</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Approved Companies</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Actions</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Send Email</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order._id}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order.totalCount}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order.assignedCompanies || 0}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order.remainingCompanies || order.totalCount}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{getApprovedCompanies(order._id)}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    <button
                      onClick={() => distributeCompanies(order._id, order.remainingCompanies)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Distribute
                    </button>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#17a2b8",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Assign Task
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "completed")}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order._id, "failed")}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#dc3545",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Mark Failed
                    </button>
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    <button
                      onClick={() => sendEmailWithCSV(order)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#28a745",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      Send Email
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedOrder && (
            <div style={{ marginTop: "20px", border: "1px solid #e0e0e0", padding: "15px", borderRadius: "4px" }}>
              <h4>Assign Task for Order {selectedOrder._id}</h4>
              <form onSubmit={assignTaskToEmployee}>
                <div style={{ marginBottom: "10px" }}>
                  <label htmlFor="employeeId">Select Employee:</label>
                  <select
                    id="employeeId"
                    name="employeeId"
                    required
                    style={{ marginLeft: "10px", padding: "5px" }}
                  >
                    <option value="">Select an employee</option>
                    {employees.map((emp) => (
                      <option key={emp._id} value={emp._id}>
                        {emp.name} ({emp.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: "10px" }}>
                  <label htmlFor="companyCount">Number of Companies (1-100):</label>
                  <input
                    type="number"
                    id="companyCount"
                    name="companyCount"
                    min="1"
                    max="100"
                    required
                    style={{ marginLeft: "10px", padding: "5px" }}
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#28a745",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Assign Task
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedOrder(null)}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#6c757d",
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
          )}
        </div>
      )}

      {activeTab === "completed" && (
        <div style={{ overflowX: "auto" }}>
          <h3>Completed Orders</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Order ID</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Total Companies</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Assigned Companies</th>
              </tr>
            </thead>
            <tbody>
              {completedOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order._id}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order.totalCount}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order.assignedCompanies || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "failed" && (
        <div style={{ overflowX: "auto" }}>
          <h3>Failed Orders</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Order ID</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Total Companies</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Assigned Companies</th>
              </tr>
            </thead>
            <tbody>
              {failedOrders.map((order) => (
                <tr key={order._id}>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order._id}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order.totalCount}</td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{order.assignedCompanies || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "assigned" && (
        <div style={{ overflowX: "auto" }}>
          <h3>Assigned Companies</h3>
          <button
            onClick={clearAllTasks}
            style={{
              padding: "10px 20px",
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginBottom: "10px",
            }}
          >
            Clear All Tasks
          </button>
          {Object.keys(individualTasks).map((employeeId) => {
            const employeeTasks = individualTasks[employeeId];
            const employee = employees.find((emp) => emp._id === employeeId);
            return (
              <div key={employeeId} style={{ marginBottom: "20px" }}>
                <h4>
                  {employee ? `${employee.name} (${employee.email})` : `Employee ID: ${employeeId}`}
                  <button
                    onClick={() => deleteEmployeeTasks(employeeId)}
                    style={{
                      marginLeft: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#dc3545",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete All Tasks
                  </button>
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Task ID</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Order ID</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Company Count</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Range</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Assigned Date</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Submit Till Date</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Status</th>
                      <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeTasks.map((task) => (
                      <tr key={task._id}>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{task._id}</td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{task.orderId}</td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{task.companyCount}</td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          {task.startIndex + 1} to {task.endIndex + 1}
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          {new Date(task.assignedDate).toLocaleDateString()}
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          {task.submitTillDate ? new Date(task.submitTillDate).toLocaleDateString() : "N/A"}
                        </td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{task.status}</td>
                        <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                          <button
                            onClick={() => deleteSpecificTask(task._id)}
                            style={{
                              padding: "5px 10px",
                              backgroundColor: "#dc3545",
                              color: "#fff",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
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

      {activeTab === "approvals" && (
        <div style={{ overflowX: "auto" }}>
          <h3>Pending Approvals</h3>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
            <thead>
              <tr>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Company Name</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Employee</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Submitted Date</th>
                <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingApprovals.map((approval) => (
                <tr key={approval._id}>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {approval.companyId.businessName || `Unknown (ID: ${approval.companyId._id})`}
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {approval.employeeId.name} ({approval.employeeId.email})
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    {new Date(approval.submittedDate).toLocaleDateString()}
                  </td>
                  <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                    <button
                      onClick={() => setSelectedApproval(approval)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#007bff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        marginRight: "5px",
                      }}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selectedApproval && (
            <div style={{ marginTop: "20px", border: "1px solid #e0e0e0", padding: "15px", borderRadius: "4px" }}>
              <h4>Details for {selectedApproval.companyId.businessName || `Unknown (ID: ${selectedApproval.companyId._id})`}</h4>
              <p>
                <strong>Employee:</strong> {selectedApproval.employeeId.name} ({selectedApproval.employeeId.email})
              </p>
              <p>
                <strong>Submitted Date:</strong> {new Date(selectedApproval.submittedDate).toLocaleDateString()}
              </p>
              <h5>General Information:</h5>
              {generalAddonOptions.map((option) => (
                <p key={option.value}>
                  <strong>{option.label}:</strong>{" "}
                  {Array.isArray(selectedApproval.formData?.[option.value])
                    ? selectedApproval.formData[option.value].join(", ")
                    : selectedApproval.formData?.[option.value] || "N/A"}
                </p>
              ))}
              <h5>Decision Makers:</h5>
              {decisionMakerOptions.map((option) => (
                <p key={option.value}>
                  <strong>{option.label}:</strong> {selectedApproval.formData?.[option.value] || "N/A"}
                </p>
              ))}
              <div style={{ marginTop: "15px" }}>
                <button
                  onClick={() => updateApprovalStatus(selectedApproval._id, "approved")}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#28a745",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Approve
                </button>
                <button
                  onClick={() => updateApprovalStatus(selectedApproval._id, "rejected")}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#dc3545",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedApproval(null)}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "#6c757d",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "demo-requests" && <DemoRequestsTab />}
    </div>
  );
};

export default AdminDashboard;
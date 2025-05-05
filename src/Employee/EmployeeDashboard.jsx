import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import Modal from "react-modal";
import { useNavigate, Link } from "react-router-dom";

const generalAddonOptions = [
  { value: "website", label: "Website" },
  { value: "mailIds", label: "Mail IDs" },
  { value: "linkedinProfile", label: "LinkedIn Profile" },
  { value: "headquarterAddress", label: "Headquarter Address" },
  { value: "foundationYear", label: "Foundation Year" },
  { value: "presentInCountries", label: "Present in Countries" },
  { value: "locationOfEachCountryOffice", label: "Location of Each Country's Office" },
];

// Employee Growth options
const employeeGrowthOptions = [
  { value: "employeeGrowth6Months", label: "Employee Growth in last 6 months" },
  { value: "employeeGrowth1Year", label: "Employee Number Growth in last 1 year" },
  { value: "employeeGrowth2Years", label: "Employee Number Growth in last 2 years" },
];

// Decision maker options
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

Modal.setAppElement("#root");

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyForms, setCompanyForms] = useState({});
  const [submittedCompanies, setSubmittedCompanies] = useState(() => {
    const saved = localStorage.getItem("submittedCompanies");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [activeTab, setActiveTab] = useState("tasks");
  const [selectedHistoryRecord, setSelectedHistoryRecord] = useState(null);
  const [demoRequests, setDemoRequests] = useState([]);
  const [selectedDemoRequest, setSelectedDemoRequest] = useState(null);
  const [meetingLink, setMeetingLink] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("submittedCompanies", JSON.stringify(Array.from(submittedCompanies)));
  }, [submittedCompanies]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const profileResponse = await axios.get("https://dsp-backend.onrender.com/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = profileResponse.data;
        setUser(userData);

        const tasksResponse = await axios.get("https://dsp-backend.onrender.com/api/payment/employee/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasksData = tasksResponse.data;

        const taskPromises = tasksData.map(async (task) => {
          const companiesResponse = await axios.get("https://dsp-backend.onrender.com/api/payment/employee/companies", {
            headers: { Authorization: `Bearer ${token}` },
            params: { taskId: task._id },
          });
          const taskCompaniesData = companiesResponse.data;
          const taskCompanies = taskCompaniesData.find((c) => c.taskId.toString() === task._id.toString()) || { companies: [], range: [] };
          const rejectedResponse = await axios.get("https://dsp-backend.onrender.com/api/company-details/rejected-companies", {
            headers: { Authorization: `Bearer ${token}` },
            params: { employeeId: userId, taskId: task._id },
          });
          const rejectedCompanies = rejectedResponse.data || [];

          const submittedCount = taskCompanies.companies.filter((company) =>
            submittedCompanies.has(company._id.$oid || company._id)
          ).length;

          return {
            ...task,
            companies: taskCompanies.companies || [],
            range: taskCompanies.range || [task.startIndex + 1, task.endIndex + 1],
            assignedDate: task.assignedDate || null,
            submitTillDate: task.submitTillDate || null,
            rejectedCompanies: rejectedCompanies,
            submittedCount: submittedCount,
          };
        });

        const updatedTasks = await Promise.all(taskPromises);
        setTasks(updatedTasks);

        const historyResponse = await axios.get("https://dsp-backend.onrender.com/api/company-details/employee-history-with-companies", {
          headers: { Authorization: `Bearer ${token}` },
          params: { employeeId: userId },
        });
        setHistory(historyResponse.data || []);

        const submittedResponse = await axios.get("https://dsp-backend.onrender.com/api/company-details/submitted-companies", {
          headers: { Authorization: `Bearer ${token}` },
          params: { employeeId: userId },
        });
        setSubmittedCompanies(new Set(submittedResponse.data.map((c) => c.companyId.toString())));

        const demoResponse = await axios.get("https://dsp-backend.onrender.com/api/demo/employee", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDemoRequests(demoResponse.data || []);
      } catch (err) {
        console.error("Fetch data error:", err.response?.data || err.message);
        setError(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/employee-login";
  };

  const handleResubmit = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
      }

      await axios.patch(`https://dsp-backend.onrender.com/api/company-details/rejected-companies/${companyId}/resubmit`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Company resubmitted for approval!");
      const fetchTasksAndCompanies = async () => {
        const token = localStorage.getItem("token");
        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;
        const tasksResponse = await axios.get("https://dsp-backend.onrender.com/api/payment/employee/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasksData = tasksResponse.data;
        const taskPromises = tasksData.map(async (task) => {
          const companiesResponse = await axios.get("https://dsp-backend.onrender.com/api/payment/employee/companies", {
            headers: { Authorization: `Bearer ${token}` },
            params: { taskId: task._id },
          });
          const taskCompaniesData = companiesResponse.data;
          const taskCompanies = taskCompaniesData.find((c) => c.taskId.toString() === task._id.toString()) || { companies: [], range: [] };
          const rejectedResponse = await axios.get("https://dsp-backend.onrender.com/api/company-details/rejected-companies", {
            headers: { Authorization: `Bearer ${token}` },
            params: { employeeId: userId, taskId: task._id },
          });
          const rejectedCompanies = rejectedResponse.data || [];
          const submittedCount = taskCompanies.companies.filter((company) =>
            submittedCompanies.has(company._id.$oid || company._id)
          ).length;
          return {
            ...task,
            companies: taskCompanies.companies || [],
            range: taskCompanies.range || [task.startIndex + 1, task.endIndex + 1],
            assignedDate: task.assignedDate || null,
            submitTillDate: task.submitTillDate || null,
            rejectedCompanies: rejectedCompanies,
            submittedCount: submittedCount,
          };
        });
        const updatedTasks = await Promise.all(taskPromises);
        setTasks(updatedTasks);
      };
      fetchTasksAndCompanies();
      closeModal();
    } catch (err) {
      console.error("Resubmit Error:", err.response ? err.response.data : err.message);
      alert(`Failed to resubmit: ${err.response ? err.response.data.message : err.message}`);
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedCompany(null);
    setSelectedHistoryRecord(null);
    setSelectedDemoRequest(null);
    setMeetingLink("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (selectedCompany) {
      setCompanyForms((prev) => ({
        ...prev,
        [selectedCompany._id]: {
          ...prev[selectedCompany._id],
          [name]: value,
        },
      }));
    }
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
      }

      const formData = companyForms[selectedCompany._id];
      const filledFields = Object.values(formData).filter((value) => value && value.trim() !== "").length;
      if (filledFields < 2) {
        alert(`At least 2 fields are required for ${selectedCompany["Business Name"]}.`);
        return;
      }

      if (!selectedCompany._id || !/^[0-9a-fA-F]{24}$/.test(selectedCompany._id)) {
        alert("Invalid company ID format. Please contact support.");
        return;
      }

      const task = tasks.find((t) => t.companies.some((c) => c._id === selectedCompany._id));
      if (!task) {
        throw new Error("Task not found for the selected company.");
      }
      const orderId = task.orderId._id;

      console.log("Submitting companyId from client:", selectedCompany._id);
      await axios.post("https://dsp-backend.onrender.com/api/company-details/submit-company-details", {
        companyId: selectedCompany._id,
        orderId: orderId,
        ...formData,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubmittedCompanies((prev) => {
        const newSet = new Set(prev).add(selectedCompany._id);
        localStorage.setItem("submittedCompanies", JSON.stringify(Array.from(newSet)));
        return newSet;
      });
      alert(`Company details for ${selectedCompany["Business Name"]} submitted for admin approval!`);
      setCompanyForms((prev) => {
        const newForms = { ...prev };
        delete newForms[selectedCompany._id];
        return newForms;
      });
      closeModal();
    } catch (err) {
      console.error("Submission Error:", err.response ? err.response.data : err.message);
      alert(`Failed to submit company details: ${err.response ? err.response.data.message : err.message}`);
    }
  };

  const handleSubmitAll = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
      }

      const submissions = Object.entries(companyForms).map(([companyId, formData]) => {
        const filledFields = Object.values(formData).filter((value) => value && value.trim() !== "").length;
        if (filledFields < 2) {
          throw new Error(`At least 2 fields are required for company with ID ${companyId}.`);
        }
        const task = tasks.find((t) => t.companies.some((c) => c._id === companyId));
        if (!task) {
          throw new Error(`Task not found for company with ID ${companyId}.`);
        }
        const orderId = task.orderId._id;
        return { companyId, orderId, ...formData };
      });

      await Promise.all(submissions.map(submission =>
        axios.post("https://dsp-backend.onrender.com/api/company-details/submit-company-details", submission, {
          headers: { Authorization: `Bearer ${token}` },
        })
      ));

      const newSubmittedCompanies = new Set(submittedCompanies);
      submissions.forEach(({ companyId }) => newSubmittedCompanies.add(companyId));
      setSubmittedCompanies(newSubmittedCompanies);
      alert("Details for all companies submitted for admin approval!");
      setCompanyForms({});
      closeModal();
    } catch (err) {
      console.error("Submission All Error:", err.message);
      alert(`Failed to submit company details: ${err.message}`);
    }
  };

  const openHistoryModal = (record) => {
    setSelectedHistoryRecord(record);
    setModalIsOpen(true);
  };

  const sendMeetingLink = async (requestId) => {
    if (!meetingLink) {
      setError("Please enter a meeting link.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        return;
      }
      await axios.post(
        `https://dsp-backend.onrender.com/api/demo/send-meeting-link/${requestId}`,
        { meetingLink },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Meeting link sent and saved successfully!");
      setMeetingLink("");
      setSelectedDemoRequest(null);
      const demoResponse = await axios.get("https://dsp-backend.onrender.com/api/demo/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDemoRequests(demoResponse.data || []);
    } catch (err) {
      console.error("Send meeting link error:", err.response?.data || err.message);
      setError(`Failed to send meeting link: ${err.response?.data?.message || err.message}`);
    }
  };

  const cancelDemoRequest = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this demo request?")) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        return;
      }
      await axios.put(
        `https://dsp-backend.onrender.com/api/demo/cancel/${requestId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Demo request cancelled successfully!");
      const demoResponse = await axios.get("https://dsp-backend.onrender.com/api/demo/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDemoRequests(demoResponse.data || []);
    } catch (err) {
      console.error("Cancel demo request error:", err.response?.data || err.message);
      setError(`Failed to cancel demo request: ${err.response?.data?.message || err.message}`);
    }
  };

  const openMeetingLinkModal = (request) => {
    setSelectedDemoRequest(request);
    setMeetingLink(request.meetingLink || "");
    setModalIsOpen(true);
  };

  return (
    <div style={{ display: "flex", height: "100vh", fontFamily: "Arial, sans-serif", backgroundColor: "#fff" }}>
      {/* Sidebar */}
      <div style={{
        width: "250px",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}>
        {/* Profile Section with White Background */}
        <div style={{
          backgroundColor: "#fff",
          color: "#080093",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}>
          <div style={{
            width: "50px",
            height: "50px", // Half the height of the image to show only the top half
            overflow: "hidden",
            borderRadius: "50%",
            position: "relative",
            marginBottom: "10px",
          }}>
            <img
              src={user?.profileImage || "assets/user-image.png"}
              alt="Profile"
              style={{
                width: "50px",
                height: "50px", // Full image height
                position: "absolute",
                top: "0",
                left: "0",
                objectFit: "cover",
              }}
            />
          </div>
          <h3 style={{ margin: "10px 0", fontSize: "18px", textAlign: "center" }}>
            Welcome, {user?.name || "Abc"}!
          </h3>
        </div>

        {/* Menu Section with Blue Background and Rounded Top-Right Corner */}
        <div style={{
          backgroundColor: "#080093",
          color: "#fff",
          padding: "20px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          borderTopRightRadius: "30px", // Rounded top-right corner
        }}>
          <ul style={{ listStyle: "none", padding: "0", width: "100%", marginTop: "20px" }}>
            {["Tasks", "History"].map((item, index) => (
              <li
                key={index}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "#fff",
                }}
              >
                <span style={{ marginRight: "10px" }}>📋</span> {item}
              </li>
            ))}
          </ul>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#fff",
              color: "#080093",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              width: "80%",
              fontSize: "16px",
              alignSelf: "center",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: "20px", backgroundColor: "#f5f6fa" }}>
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "10px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <h1 style={{ fontSize: "24px", margin: "0", flex: 1, fontWeight: "bold" }}>Employee Dashboard</h1>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <select style={{ padding: "8px", borderRadius: "5px", border: "1px solid #ddd" }}>
                  <option>Date</option>
                </select>
                <button style={{ padding: "8px 15px", backgroundColor: "#080093", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>Filter</button>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", borderBottom: "2px solid #080093"}}>
              <button
                onClick={() => setActiveTab("tasks")}
                style={{
                  padding: "10px 20px",
                  marginRight: "10px",
                  backgroundColor: "transparent",
                  color: activeTab === "tasks" ? "#080093" : "#333",
                  border: "none",
                  borderBottom: activeTab === "tasks" ? "2px solid #080093" : "none",
                  cursor: "pointer",
                  fontWeight: activeTab === "tasks" ? "bold" : "normal",
                }}
              >
                Tasks
              </button>
              <button
                onClick={() => setActiveTab("history")}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "transparent",
                  color: activeTab === "history" ? "#080093" : "#333",
                  border: "none",
                  borderBottom: activeTab === "history" ? "2px solid #080093" : "none",
                  cursor: "pointer",
                  fontWeight: activeTab === "history" ? "bold" : "normal",
                }}
              >
                History
              </button>
            </div>
          </div>
          {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}

          {/* Tasks Tab Content */}
          {activeTab === "tasks" && (
            tasks.length === 0 ? (
              <p>No tasks assigned.</p>
            ) : (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <h3 style={{ margin: "0" }}>205 Tasks for you</h3>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                  <thead>
                    <tr style={{ backgroundColor: "#f1f3f5" }}>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>No.</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Companies Assigned</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Assigned Date</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Submission Date</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Company Details Filled</th>
                      <th style={{ border: "1px solid #ddd", padding: "8px", textAlign: "left" }}>Company Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tasks.map((task, index) => {
                      const progress = task.companyCount > 0 ? (task.submittedCount / task.companyCount) * 100 : 0;
                      return (
                        <tr key={task._id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>{index + 1}</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>{task.companyCount}</td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {task.assignedDate ? new Date(task.assignedDate).toLocaleDateString() : "N/A"}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            {task.submitTillDate ? new Date(task.submitTillDate).toLocaleDateString() : "N/A"}
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <div>{task.submittedCount} of {task.companyCount}</div>
                            <div style={{ width: "100%", backgroundColor: "#ddd", borderRadius: "5px", overflow: "hidden" }}>
                              <div
                                style={{
                                  width: `${progress}%`,
                                  height: "10px",
                                  backgroundColor: "#3b82f6",
                                  borderRadius: "5px",
                                }}
                              />
                            </div>
                          </td>
                          <td style={{ border: "1px solid #ddd", padding: "8px" }}>
                            <Link to={`/fill-details/${task._id}`}>
                              <button
                                style={{
                                  padding: "5px 10px",
                                  backgroundColor: "#1e40af",
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                              >
                                View Details
                              </button>
                            </Link>
                            {task.rejectedCompanies.map((company, idx) => (
                              <div key={idx} style={{ marginTop: "5px" }}>
                                <span>{company["Business Name"]} (ID: {company._id.$oid || company._id})</span>
                                <button
                                  onClick={() => handleResubmit(company._id.$oid || company._id)}
                                  style={{
                                    marginLeft: "10px",
                                    padding: "5px 10px",
                                    backgroundColor: "#1e40af",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer",
                                  }}
                                >
                                  Resubmit Form
                                </button>
                              </div>
                            ))}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )
          )}

          {/* History Tab Content */}
          {activeTab === "history" && (
            history.length === 0 ? (
              <p>No history available.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff", fontSize: "14px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f1f3f5" }}>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Company Name</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Submitted Date</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Status</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Approved/Rejected Date</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record, index) => (
                    <tr key={record._id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
  {record.company.businessName || "N/A"} (ID: {record.company._id.$oid || record.company._id})
</td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                        {new Date(record.submittedDate).toLocaleDateString()}
                      </td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                        {record.status}
                      </td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                        {record.approvedAt ? new Date(record.approvedAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                        <button
                          onClick={() => openHistoryModal(record)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#1e40af",
                            color: "#fff",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          {/* Demos Tab Content */}
          {activeTab === "demos" && (
            demoRequests.length === 0 ? (
              <p>No demo requests assigned.</p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
                <thead>
                  <tr style={{ backgroundColor: "#f1f3f5" }}>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Name</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Email</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Date & Time</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Message</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Status</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Meeting Link</th>
                    <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {demoRequests.map((request, index) => (
                    <tr key={request._id} style={{ backgroundColor: index % 2 === 0 ? "#fff" : "#f9fafb" }}>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{request.name}</td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{request.email}</td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                        {new Date(request.date).toLocaleString("en-US", {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZoneName: "short",
                        })}
                      </td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                        {request.message || "N/A"}
                      </td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{request.status}</td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                        {request.meetingLink ? (
                          <a href={request.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: "#3498db", textDecoration: "underline" }}>
                            Click to Join
                          </a>
                        ) : (
                          "Not sent"
                        )}
                      </td>
                      <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                        {request.status !== "completed" && request.status !== "cancelled" && (
                          <>
                            <button
                              onClick={() => openMeetingLinkModal(request)}
                              style={{
                                padding: "5px 10px",
                                backgroundColor: "#1e40af",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                                marginRight: "5px",
                              }}
                            >
                              Send Meeting Link
                            </button>
                            <button
                              onClick={() => cancelDemoRequest(request._id)}
                              style={{
                                padding: "5px 10px",
                                backgroundColor: "#e74c3c",
                                color: "#fff",
                                border: "none",
                                borderRadius: "5px",
                                cursor: "pointer",
                              }}
                            >
                              Cancel Demo
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          )}

          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                width: selectedDemoRequest ? "400px" : "600px",
                padding: "20px",
                maxHeight: "80vh",
                overflowY: "auto",
              },
            }}
          >
            {selectedCompany ? (
              <div>
                <h3>Fill Details for {selectedCompany["Business Name"]} (ID: {selectedCompany._id.$oid || selectedCompany._id})</h3>
                <form>
                  {Object.keys(companyForms[selectedCompany._id] || {})
                    .filter(field => !decisionMakerOptions.some(option => option.value === field))
                    .map((field) => (
                      <div key={field} style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>
                          {field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, " $1")}:
                        </label>
                        <input
                          type="text"
                          name={field}
                          value={companyForms[selectedCompany._id]?.[field] || ""}
                          onChange={handleChange}
                          style={{ width: "100%", padding: "5px" }}
                        />
                      </div>
                    ))}
                  <div style={{ marginTop: "20px" }}>
                    <h4>Decision Makers</h4>
                    {decisionMakerOptions.map((option) => (
                      <div key={option.value} style={{ marginBottom: "15px" }}>
                        <label style={{ display: "block", marginBottom: "5px" }}>
                          {option.label}:
                        </label>
                        <input
                          type="text"
                          name={option.value}
                          value={companyForms[selectedCompany._id]?.[option.value] || ""}
                          onChange={handleChange}
                          style={{ width: "100%", padding: "5px" }}
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#1e40af",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Submit
                  </button>
                </form>
                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={handleSubmitAll}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#1e40af",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    disabled={Object.keys(companyForms).length === 0}
                  >
                    Submit All
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      marginLeft: "10px",
                      padding: "5px 10px",
                      backgroundColor: "#e74c3c",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : selectedHistoryRecord ? (
              <div>
<h3>View Details for {selectedHistoryRecord.company.businessName || "N/A"} (ID: {selectedHistoryRecord.company._id.$oid || selectedHistoryRecord.company._id})</h3>                <div>
                  <p><strong>Submitted Date:</strong> {new Date(selectedHistoryRecord.submittedDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {selectedHistoryRecord.status}</p>
                  <p><strong>Approved/Rejected Date:</strong> {selectedHistoryRecord.approvedAt ? new Date(selectedHistoryRecord.approvedAt).toLocaleDateString() : "N/A"}</p>

                  {/* General Information */}
                  <h4 style={{ marginTop: "20px", borderBottom: "1px solid #e0e0e0", paddingBottom: "5px" }}>General Information</h4>
                  {generalAddonOptions.map((option) => (
                    <div key={option.value} style={{ marginBottom: "10px" }}>
                      <strong>{option.label}:</strong>
                      <p style={{ marginLeft: "10px" }}>
                        {Array.isArray(selectedHistoryRecord.formData?.[option.value])
                          ? selectedHistoryRecord.formData[option.value].length > 0
                            ? selectedHistoryRecord.formData[option.value].join(", ")
                            : "N/A"
                          : selectedHistoryRecord.formData?.[option.value] || "N/A"}
                      </p>
                    </div>
                  ))}

                  {/* Employee Growth */}
                  <h4 style={{ marginTop: "20px", borderBottom: "1px solid #e0e0e0", paddingBottom: "5px" }}>Employee Growth</h4>
                  {employeeGrowthOptions.map((option) => (
                    <div key={option.value} style={{ marginBottom: "10px" }}>
                      <strong>{option.label}:</strong>
                      <p style={{ marginLeft: "10px" }}>
                        {selectedHistoryRecord.formData?.[option.value] || "N/A"}
                      </p>
                    </div>
                  ))}

                  {/* Decision Makers */}
                  <h4 style={{ marginTop: "20px", borderBottom: "1px solid #e0e0e0", paddingBottom: "5px" }}>Decision Makers</h4>
                  {decisionMakerOptions.map((option) => (
                    <div key={option.value} style={{ marginBottom: "15px" }}>
                      <strong>{option.label}:</strong>
                      {selectedHistoryRecord.formData?.[option.value]?.length > 0 ? (
                        selectedHistoryRecord.formData[option.value].map((person, index) => (
                          <div key={index} style={{ marginLeft: "10px", marginTop: "10px", borderLeft: "2px solid #e0e0e0", paddingLeft: "10px" }}>
                            <p><strong>Decision Maker {index + 1}</strong></p>
                            <p><strong>Name:</strong> {person.name || "N/A"}</p>
                            <p><strong>Emails:</strong> {person.emails?.length > 0 ? person.emails.join(", ") : "N/A"}</p>
                            <p><strong>Phone Numbers:</strong> {person.phoneNumbers?.length > 0 ? person.phoneNumbers.join(", ") : "N/A"}</p>
                            <p><strong>LinkedIn Profile:</strong> {person.linkedinProfile || "N/A"}</p>
                          </div>
                        ))
                      ) : (
                        <p style={{ marginLeft: "10px" }}>N/A</p>
                      )}
                    </div>
                  ))}

                  <button
                    onClick={closeModal}
                    style={{
                      marginTop: "20px",
                      padding: "8px 15px",
                      backgroundColor: "#95a5a6",
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
            ) : selectedDemoRequest ? (
              <div>
                <h3>Send Meeting Link for {selectedDemoRequest.name}</h3>
                <p><strong>Email:</strong> {selectedDemoRequest.email}</p>
                <p>
                  <strong>Date & Time:</strong>{" "}
                  {new Date(selectedDemoRequest.date).toLocaleString("en-US", {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </p>
                <div style={{ marginBottom: "10px", marginTop: "10px" }}>
                  <label htmlFor="meetingLink">Meeting Link:</label>
                  <input
                    type="text"
                    id="meetingLink"
                    value={meetingLink}
                    onChange={(e) => setMeetingLink(e.target.value)}
                    style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                    placeholder="e.g., https://zoom.us/j/123456789"
                  />
                </div>
                <div style={{ marginTop: "20px" }}>
                  <button
                    onClick={() => sendMeetingLink(selectedDemoRequest._id)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#1e40af",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                    disabled={!meetingLink}
                  >
                    Save & Send
                  </button>
                  <button
                    onClick={closeModal}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#95a5a6",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : null}
          </Modal>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            /* Main container */
            .employee-dashboard {
              flex-direction: column;
              height: auto;
            }

            /* Sidebar */
            .employee-dashboard > div:first-child {
              width: 100%;
              height: auto;
              flex-direction: row;
              position: fixed;
              bottom: 0;
              left: 0;
              z-index: 1000;
              background-color: #080093;
              border-top: 1px solid #e0e0e0;
              border-top-right-radius: 0;
              padding: 10px;
              justify-content: space-around;
              align-items: center;
            }

            .employee-dashboard > div:first-child > div:first-child {
              display: none; /* Hide profile section on mobile */
            }

            .employee-dashboard > div:first-child > div:last-child {
              flex-direction: row;
              padding: 0;
              justify-content: space-between;
              width: 100%;
            }

            .employee-dashboard > div:first-child > div:last-child > ul {
              display: flex;
              margin: 0;
              width: auto;
            }

            .employee-dashboard > div:first-child > div:last-child > ul > li {
              padding: 8px;
              font-size: 12px;
            }

            .employee-dashboard > div:first-child > div:last-child > ul > li > span {
              display: none; /* Hide icons for menu items */
            }

            .employee-dashboard > div:first-child > div:last-child > button {
              padding: 6px 10px;
              font-size: 12px;
              width: auto;
              margin-left: 10px;
            }

            /* Main content */
            .employee-dashboard > div:last-child {
              padding: 15px;
              padding-bottom: 80px; /* Account for fixed sidebar */
            }

            .employee-dashboard > div:last-child > div {
              padding: 15px;
            }

            /* Header section */
            .employee-dashboard > div:last-child > div > div:first-child {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
            }

            .employee-dashboard > div:last-child > div > div:first-child > h1 {
              font-size: 20px;
            }

            .employee-dashboard > div:last-child > div > div:first-child > div:last-child {
              flex-direction: column;
              align-items: flex-start;
              width: 100%;
              gap: 8px;
            }

            .employee-dashboard > div:last-child > div > div:first-child > div:last-child > select {
              padding: 6px;
              font-size: 12px;
              width: 100%;
            }

            .employee-dashboard > div:last-child > div > div:first-child > div:last-child > button {
              padding: 6px 12px;
              font-size: 12px;
              width: 100%;
            }

            /* Tabs */
            .employee-dashboard > div:last-child > div > div:first-child > div:last-child {
              flex-wrap: wrap;
            }

            .employee-dashboard > div:last-child > div > div:first-child > div:last-child > button {
              padding: 8px 15px;
              font-size: 12px;
            }

            /* Error message */
            .employee-dashboard > div:last-child > div > div[style*="color: red"] {
              font-size: 12px;
            }

            /* Tasks section */
            .employee-dashboard > div:last-child > div > div > h3 {
              font-size: 16px;
            }

            /* Tables */
            .employee-dashboard > div:last-child > div > table {
              display: block;
              overflow-x: auto;
              white-space: nowrap;
            }

            .employee-dashboard > div:last-child > div > table thead,
            .employee-dashboard > div:last-child > div > table tbody,
            .employee-dashboard > div:last-child > div > table tr {
              display: table;
              width: 100%;
              table-layout: fixed;
            }

            .employee-dashboard > div:last-child > div > table th,
            .employee-dashboard > div:last-child > div > table td {
              padding: 6px;
              font-size: 12px;
              min-width: 80px;
            }

            .employee-dashboard > div:last-child > div > table th:first-child,
            .employee-dashboard > div:last-child > div > table td:first-child {
              min-width: 50px;
            }

            .employee-dashboard > div:last-child > div > table td > div[style*="width: 100%"] {
              height: 8px;
            }

            .employee-dashboard > div:last-child > div > table td > button {
              padding: 4px 8px;
              font-size: 11px;
            }

            .employee-dashboard > div:last-child > div > table td > div > button {
              margin-left: 5px;
              padding: 4px 8px;
              font-size: 11px;
            }

            /* Modal */
            .modal-content {
              width: 90% !important;
              padding: 15px !important;
            }

            .modal-content h3 {
              font-size: 16px;
            }

            .modal-content h4 {
              font-size: 14px;
            }

            .modal-content p,
            .modal-content label {
              font-size: 12px;
            }

            .modal-content input {
              padding: 6px;
              font-size: 12px;
            }

            .modal-content button {
              padding: 6px 10px;
              font-size: 12px;
            }

            .modal-content div[style*="marginBottom: 15px"] {
              margin-bottom: 10px;
            }

            .modal-content div[style*="marginTop: 20px"] {
              margin-top: 15px;
            }

            .modal-content div[style*="marginLeft: 10px"] {
              margin-left: 5px;
            }History
          }
        `}
      </style>
    </div>
    </div>
  );
};

export default EmployeeDashboard;
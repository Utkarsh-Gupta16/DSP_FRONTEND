import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./companyDetailsForm.css";

const generalAddonOptions = [
  { value: "website", label: "Website", singleField: true },
  { value: "mailIds", label: "Mail IDs", singleField: true },
  { value: "linkedinProfile", label: "LinkedIn Profile", singleField: true },
  { value: "headquarterAddress", label: "Headquarter Address", singleField: true },
  { value: "foundationYear", label: "Foundation Year", singleField: true },
  { value: "presentInCountries", label: "Present in Countries", singleField: false },
  { value: "locationOfEachCountryOffice", label: "Location of Each Country's Office", singleField: false },
  { value: "companySize", label: "Company Size", singleField: true },
  { value: "revenue", label: "Revenue", singleField: true },
  { value: "currentActiveMembers", label: "Current Active Members", singleField: true },
  { value: "contactNumber", label: "Contact Number", singleField: false },
  { value: "subsidiaries", label: "Subsidiaries", singleField: false },
];

const employeeGrowthOptions = [
  { value: "employeeGrowth6Months", label: "Employee Growth in last 6 months" },
  { value: "employeeGrowth1Year", label: "Employee Number Growth in last 1 year" },
  { value: "employeeGrowth2Years", label: "Employee Number Growth in last 2 years" },
];

const companySizeOptions = [
  "2-10",
  "11-50",
  "50-200",
  "200-500",
  "500-1000",
  "1000-5000",
  "5000-10000",
  "10000+",
];

const initialDecisionMakerOptions = [
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

const STORAGE_VERSION = "1.0";

const CompanyDetailsForm = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [submittedCompanies, setSubmittedCompanies] = useState(new Set());
  const [decisionMakerOptions, setDecisionMakerOptions] = useState(initialDecisionMakerOptions);
  const [customRole, setCustomRole] = useState("");

  const localStorageKey = `companyFormData_${taskId}`;

  const getCompanyId = (company) => company._id.$oid || company._id;

  const loadFormDataFromLocalStorage = () => {
    const savedData = localStorage.getItem(localStorageKey);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      const savedTimestamp = parsedData.timestamp;
      const currentTimestamp = Date.now();
      const oneDayInMs = 24 * 60 * 60 * 1000;

      if (parsedData.version !== STORAGE_VERSION) {
        localStorage.removeItem(localStorageKey);
        return null;
      }

      if (currentTimestamp - savedTimestamp < oneDayInMs) {
        const updatedFormData = { ...parsedData.formData };
        Object.keys(updatedFormData).forEach((companyId) => {
          const companyData = updatedFormData[companyId];
          if (!companyData || !companyData.general || !companyData.decisionMakers || !companyData.employeeGrowth) {
            delete updatedFormData[companyId];
            return;
          }
          generalAddonOptions.forEach((option) => {
            if (option.singleField) {
              if (Array.isArray(companyData.general[option.value])) {
                companyData.general[option.value] = companyData.general[option.value][0] || "";
              } else if (companyData.general[option.value] === undefined) {
                companyData.general[option.value] = "";
              }
            } else {
              if (!Array.isArray(companyData.general[option.value])) {
                companyData.general[option.value] = [];
              }
            }
          });
          decisionMakerOptions.forEach((option) => {
            if (!companyData.decisionMakers[option.value]) {
              companyData.decisionMakers[option.value] = [];
            } else {
              companyData.decisionMakers[option.value] = companyData.decisionMakers[option.value].map(person => ({
                ...person,
                emails: Array.isArray(person.emails) ? person.emails : [""],
                phoneNumbers: Array.isArray(person.phoneNumbers) ? person.phoneNumbers : [""],
              }));
            }
          });
          if (!companyData.employeeGrowth || !companyData.employeeGrowth.period) {
            companyData.employeeGrowth = { period: employeeGrowthOptions[0].value, value: "" };
          }
        });
        return updatedFormData;
      } else {
        localStorage.removeItem(localStorageKey);
      }
    }
    return null;
  };

  const saveFormDataToLocalStorage = (data) => {
    const dataToSave = {
      timestamp: Date.now(),
      version: STORAGE_VERSION,
      formData: data,
    };
    localStorage.setItem(localStorageKey, JSON.stringify(dataToSave));
  };

  useEffect(() => {
    const fetchTaskAndCompanies = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found.");
          return;
        }

        const decodedToken = jwtDecode(token);
        const userId = decodedToken.id;

        const taskResponse = await axios.get(`https://dsp-backend.onrender.com/api/payment/employee/tasks`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const taskData = taskResponse.data.find((t) => t._id === taskId);
        if (!taskData) {
          setError("Task not found.");
          return;
        }

        const companiesResponse = await axios.get("https://dsp-backend.onrender.com/api/payment/employee/companies", {
          headers: { Authorization: `Bearer ${token}` },
          params: { taskId },
        });
        const taskCompaniesData = companiesResponse.data;
        const taskCompanies = taskCompaniesData.find((c) => c.taskId.toString() === taskId.toString()) || { companies: [] };

        setTask(taskData);
        setCompanies(taskCompanies.companies || []);

        const submittedResponse = await axios.get("https://dsp-backend.onrender.com/api/company-details/submitted-companies", {
          headers: { Authorization: `Bearer ${token}` },
          params: { employeeId: userId },
        });
        const submittedSet = new Set(submittedResponse.data.map((c) => c.companyId.toString()));
        setSubmittedCompanies(submittedSet);

        let initialFormData = loadFormDataFromLocalStorage();
        if (!initialFormData) {
          initialFormData = {};
          taskCompanies.companies.forEach((company) => {
            initialFormData[getCompanyId(company)] = {
              general: generalAddonOptions.reduce(
                (acc, option) => ({
                  ...acc,
                  [option.value]: option.singleField ? "" : [],
                }),
                {}
              ),
              decisionMakers: decisionMakerOptions.reduce(
                (acc, option) => ({
                  ...acc,
                  [option.value]: [],
                }),
                {}
              ),
              employeeGrowth: { period: employeeGrowthOptions[0].value, value: "" },
            };
          });
        }

        taskCompanies.companies.forEach((company) => {
          if (!initialFormData[getCompanyId(company)]) {
            initialFormData[getCompanyId(company)] = {
              general: generalAddonOptions.reduce(
                (acc, option) => ({
                  ...acc,
                  [option.value]: option.singleField ? "" : [],
                }),
                {}
              ),
              decisionMakers: decisionMakerOptions.reduce(
                (acc, option) => ({
                  ...acc,
                  [option.value]: [],
                }),
                {}
              ),
              employeeGrowth: { period: employeeGrowthOptions[0].value, value: "" },
            };
          }
        });

        setFormData(initialFormData);

        const firstUnsubmittedIndex = taskCompanies.companies.findIndex(
          (company) => !submittedSet.has(getCompanyId(company).toString())
        );
        if (firstUnsubmittedIndex !== -1) {
          setCurrentCompanyIndex(firstUnsubmittedIndex);
        }
      } catch (err) {
        console.error("Fetch error:", err.response?.data || err.message);
        setError(`Failed to fetch data: ${err.response?.data?.message || err.message}`);
      }
    };
    fetchTaskAndCompanies();
  }, [taskId, decisionMakerOptions]);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveFormDataToLocalStorage(formData);
    }
  }, [formData]);

  const handleGeneralChange = (field, value, index = null) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => {
      const currentFormData = prev[companyId];
      if (generalAddonOptions.find(opt => opt.value === field)?.singleField) {
        return {
          ...prev,
          [companyId]: {
            ...currentFormData,
            general: {
              ...currentFormData.general,
              [field]: value,
            },
          },
        };
      } else {
        return {
          ...prev,
          [companyId]: {
            ...currentFormData,
            general: {
              ...currentFormData.general,
              [field]: currentFormData.general[field].map((item, i) =>
                i === index ? value : item
              ),
            },
          },
        };
      }
    });
  };

  const handleEmployeeGrowthChange = (field, value) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        employeeGrowth: {
          ...prev[companyId].employeeGrowth,
          [field]: value,
        },
      },
    }));
  };

  const handleDecisionMakerChange = (role, personIndex, field, value, subIndex = null) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        decisionMakers: {
          ...prev[companyId].decisionMakers,
          [role]: prev[companyId].decisionMakers[role].map((person, i) =>
            i === personIndex
              ? {
                  ...person,
                  [field]: subIndex !== null
                    ? person[field].map((val, j) => (j === subIndex ? value : val))
                    : value,
                }
              : person
          ),
        },
      },
    }));
  };

  const addGeneralField = (field) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        general: {
          ...prev[companyId].general,
          [field]: [...prev[companyId].general[field], ""],
        },
      },
    }));
  };

  const removeGeneralField = (field, index) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        general: {
          ...prev[companyId].general,
          [field]: prev[companyId].general[field].filter((_, i) => i !== index),
        },
      },
    }));
  };

  const addDecisionMaker = (role) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        decisionMakers: {
          ...prev[companyId].decisionMakers,
          [role]: [
            ...prev[companyId].decisionMakers[role],
            { name: "", emails: [""], phoneNumbers: [""], linkedinProfile: "" },
          ],
        },
      },
    }));
  };

  const removeDecisionMaker = (role, index) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        decisionMakers: {
          ...prev[companyId].decisionMakers,
          [role]: prev[companyId].decisionMakers[role].filter((_, i) => i !== index),
        },
      },
    }));
  };

  const addEmail = (role, personIndex) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        decisionMakers: {
          ...prev[companyId].decisionMakers,
          [role]: prev[companyId].decisionMakers[role].map((person, i) =>
            i === personIndex ? { ...person, emails: [...person.emails, ""] } : person
          ),
        },
      },
    }));
  };

  const removeEmail = (role, personIndex, emailIndex) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        decisionMakers: {
          ...prev[companyId].decisionMakers,
          [role]: prev[companyId].decisionMakers[role].map((person, i) =>
            i === personIndex
              ? { ...person, emails: person.emails.filter((_, j) => j !== emailIndex) }
              : person
          ),
        },
      },
    }));
  };

  const addPhoneNumber = (role, personIndex) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        decisionMakers: {
          ...prev[companyId].decisionMakers,
          [role]: prev[companyId].decisionMakers[role].map((person, i) =>
            i === personIndex ? { ...person, phoneNumbers: [...person.phoneNumbers, ""] } : person
          ),
        },
      },
    }));
  };

  const removePhoneNumber = (role, personIndex, phoneIndex) => {
    const currentCompany = companies[currentCompanyIndex];
    const companyId = getCompanyId(currentCompany);
    if (!formData[companyId]) {
      console.error(`Form data for company ${companyId} is not initialized.`);
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [companyId]: {
        ...prev[companyId],
        decisionMakers: {
          ...prev[companyId].decisionMakers,
          [role]: prev[companyId].decisionMakers[role].map((person, i) =>
            i === personIndex
              ? { ...person, phoneNumbers: person.phoneNumbers.filter((_, j) => j !== phoneIndex) }
              : person
          ),
        },
      },
    }));
  };

  const addCustomDecisionMaker = () => {
    if (customRole.trim() === "") {
      alert("Please enter a custom role name.");
      return;
    }

    const roleValue = customRole.toLowerCase().replace(/\s+/g, "_");
    const newOption = { value: roleValue, label: customRole.trim() };

    setDecisionMakerOptions((prev) => [...prev, newOption]);

    setFormData((prev) => {
      const updatedFormData = { ...prev };
      Object.keys(updatedFormData).forEach((companyId) => {
        updatedFormData[companyId].decisionMakers[roleValue] = [];
      });
      return updatedFormData;
    });

    setCustomRole("");
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No authentication token found. Please log in again.");
        return;
      }
  
      const currentCompany = companies[currentCompanyIndex];
      const companyId = getCompanyId(currentCompany);
      const companyFormData = formData[companyId];
  
      if (!companyId || !/^[0-9a-fA-F]{24}$/.test(companyId)) {
        alert("Invalid company ID format. Please contact support.");
        return;
      }
  
      const orderId = task.orderId._id;
      await axios.post(
        "https://dsp-backend.onrender.com/api/company-details/submit-company-details",
        {
          companyId: companyId,
          orderId: orderId,
          formData: {
            ...companyFormData.general,
            employeeGrowth: companyFormData.employeeGrowth,
            ...companyFormData.decisionMakers,
          },
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
  
      setSubmittedCompanies((prev) => new Set(prev).add(companyId));
  
      setFormData((prev) => {
        const updatedFormData = { ...prev };
        delete updatedFormData[companyId];
        saveFormDataToLocalStorage(updatedFormData);
        return updatedFormData;
      });
  
      alert(`Company details for ${currentCompany["Business Name"]} submitted for admin approval!`);
  
      const nextUnsubmittedIndex = companies.findIndex(
        (company, index) => index > currentCompanyIndex && !submittedCompanies.has(getCompanyId(company).toString())
      );
  
      if (nextUnsubmittedIndex !== -1) {
        setCurrentCompanyIndex(nextUnsubmittedIndex);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        navigate("/employee");
      }
    } catch (err) {
      console.error("Submission Error:", err.response ? err.response.data : err.message);
      alert(`Failed to submit company details: ${err.response ? err.response.data.message : err.message}`);
    }
  };

  const handleNext = () => {
    if (currentCompanyIndex < companies.length - 1) {
      setCurrentCompanyIndex(currentCompanyIndex + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevious = () => {
    if (currentCompanyIndex > 0) {
      setCurrentCompanyIndex(currentCompanyIndex - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!task || companies.length === 0 || Object.keys(formData).length === 0) {
    return <div className="loading-message">Loading...</div>;
  }

  const currentCompany = companies[currentCompanyIndex];
  const companyId = getCompanyId(currentCompany);
  const isSubmitted = submittedCompanies.has(companyId);

  return (
    <div className="company-form-container">
      <h2 className="company-form-title">Fill Company Details</h2>
      <h3 className="company-form-subtitle">
        {currentCompany["Business Name"]} (ID: {companyId})
      </h3>
      <p className="company-form-progress">
        Company {currentCompanyIndex + 1} of {companies.length}
      </p>

      {isSubmitted ? (
        <div className="submitted-message">
          This company's details have already been submitted.
        </div>
      ) : (
        <div className="form-section">
          <h4 className="form-section-title">General Information</h4>
          {generalAddonOptions.map((option) => (
            <div key={option.value} className="form-group">
              {option.singleField ? (
                <div className="single-field-group">
                  <label className="form-label">{option.label}:</label>
                  {option.value === "companySize" ? (
                    <select
                      value={formData[companyId]?.general[option.value] || ""}
                      onChange={(e) => handleGeneralChange(option.value, e.target.value)}
                      className="form-input"
                      disabled={isSubmitted}
                    >
                      <option value="">Select Size</option>
                      {companySizeOptions.map((size) => (
                        <option key={size} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={option.value === "mailIds" ? "email" : "text"}
                      value={formData[companyId]?.general[option.value] || ""}
                      onChange={(e) => handleGeneralChange(option.value, e.target.value)}
                      className="form-input"
                      placeholder={
                        option.value === "revenue"
                          ? "e.g., $10M"
                          : option.value === "currentActiveMembers"
                          ? "e.g., 150"
                          : ""
                      }
                      disabled={isSubmitted}
                    />
                  )}
                </div>
              ) : (
                <div className="multi-field-group">
                  <div className="field-header">
                    <label className="form-label">{option.label}:</label>
                    <button
                      onClick={() => addGeneralField(option.value)}
                      className="btn green"
                      disabled={isSubmitted}
                    >
                      Add
                    </button>
                  </div>
                  {formData[companyId]?.general[option.value]?.map((value, index) => (
                    <div key={index} className="input-group">
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleGeneralChange(option.value, e.target.value, index)}
                        className="form-input"
                        disabled={isSubmitted}
                      />
                      <button
                        onClick={() => removeGeneralField(option.value, index)}
                        className="btn red"
                        disabled={isSubmitted}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <h4 className="form-section-title">Employee Growth</h4>
          <div className="form-group">
            <label className="form-label">Select Growth Period:</label>
            <select
              value={formData[companyId]?.employeeGrowth?.period || employeeGrowthOptions[0].value}
              onChange={(e) => handleEmployeeGrowthChange("period", e.target.value)}
              className="form-input"
              disabled={isSubmitted}
            >
              {employeeGrowthOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <label className="form-label">Growth Value:</label>
            <input
              type="text"
              value={formData[companyId]?.employeeGrowth?.value || ""}
              onChange={(e) => handleEmployeeGrowthChange("value", e.target.value)}
              className="form-input"
              placeholder="e.g., 10% or 50 employees"
              disabled={isSubmitted}
            />
          </div>

          <h4 className="form-section-title">Decision Makers</h4>
          <div className="form-group">
            <label className="form-label">Add Custom Decision Maker Role:</label>
            <div className="input-group">
              <input
                type="text"
                value={customRole}
                onChange={(e) => setCustomRole(e.target.value)}
                className="form-input"
                placeholder="Enter custom role (e.g., Chief Innovation Officer)"
                disabled={isSubmitted}
              />
              <button
                onClick={addCustomDecisionMaker}
                className="btn blue"
                disabled={isSubmitted}
              >
                Add Role
              </button>
            </div>
          </div>
          {decisionMakerOptions.map((option) => (
            <div key={option.value} className="form-group">
              <div className="field-header">
                <label className="form-label">{option.label}:</label>
                <button
                  onClick={() => addDecisionMaker(option.value)}
                  className="btn green"
                  disabled={isSubmitted}
                >
                  Add
                </button>
              </div>
              {formData[companyId]?.decisionMakers[option.value]?.map((person, personIndex) => (
                <div key={personIndex} className="decision-maker-card">
                  <div className="card-header">
                    <span className="card-title">Decision Maker {personIndex + 1}</span>
                    <button
                      onClick={() => removeDecisionMaker(option.value, personIndex)}
                      className="btn red"
                      disabled={isSubmitted}
                    >
                      Remove
                    </button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name:</label>
                    <input
                      type="text"
                      value={person.name}
                      onChange={(e) => handleDecisionMakerChange(option.value, personIndex, "name", e.target.value)}
                      className="form-input"
                      disabled={isSubmitted}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Emails:</label>
                    {person.emails.map((email, emailIndex) => (
                      <div key={emailIndex} className="input-group">
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => handleDecisionMakerChange(option.value, personIndex, "emails", e.target.value, emailIndex)}
                          className="form-input"
                          disabled={isSubmitted}
                        />
                        <button
                          onClick={() => removeEmail(option.value, personIndex, emailIndex)}
                          className="btn red"
                          disabled={isSubmitted}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addEmail(option.value, personIndex)}
                      className="btn green"
                      disabled={isSubmitted}
                    >
                      Add Email
                    </button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Numbers:</label>
                    {person.phoneNumbers.map((phone, phoneIndex) => (
                      <div key={phoneIndex} className="input-group">
                        <input
                          type="text"
                          value={phone}
                          onChange={(e) => handleDecisionMakerChange(option.value, personIndex, "phoneNumbers", e.target.value, phoneIndex)}
                          className="form-input"
                          disabled={isSubmitted}
                        />
                        <button
                          onClick={() => removePhoneNumber(option.value, personIndex, phoneIndex)}
                          className="btn red"
                          disabled={isSubmitted}
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => addPhoneNumber(option.value, personIndex)}
                      className="btn green"
                      disabled={isSubmitted}
                    >
                      Add Phone Number
                    </button>
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile:</label>
                    <input
                      type="text"
                      value={person.linkedinProfile}
                      onChange={(e) => handleDecisionMakerChange(option.value, personIndex, "linkedinProfile", e.target.value)}
                      className="form-input"
                      disabled={isSubmitted}
                    />
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="form-navigation">
        <button
          onClick={handlePrevious}
          className={`btn ${currentCompanyIndex === 0 ? "disabled" : "blue"}`}
          disabled={currentCompanyIndex === 0}
        >
          Previous
        </button>

        {!isSubmitted && (
          <button
            onClick={handleSubmit}
            className="btn green"
          >
            Submit
          </button>
        )}

        <button
          onClick={handleNext}
          className={`btn ${currentCompanyIndex === companies.length - 1 ? "disabled" : "blue"}`}
          disabled={currentCompanyIndex === companies.length - 1}
        >
          Next
        </button>
      </div>

      <div className="form-back">
        <button
          onClick={() => navigate("/employee")}
          className="btn purple"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsForm;
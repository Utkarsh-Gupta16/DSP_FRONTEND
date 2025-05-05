import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./companyDetailsForm.css"; // Ensure this CSS file is in the same directory

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

const CompanyDetailsPage = () => {
  const { id } = useParams(); // Get the company details ID from the URL
  const navigate = useNavigate();
  const [companyDetails, setCompanyDetails] = useState(null);
  const [error, setError] = useState(null);

  const generalAddonOptions = [
    { value: "website", label: "Website" },
    { value: "mailIds", label: "Mail IDs" },
    { value: "linkedinProfile", label: "LinkedIn Profile" },
    { value: "headquarterAddress", label: "Headquarter Address" },
    { value: "foundationYear", label: "Foundation Year" },
    { value: "presentInCountries", label: "Present in Countries", singleField: false },
    { value: "locationOfEachCountryOffice", label: "Location of Each Country's Office", singleField: false },
    { value: "companySize", label: "Company Size" },
    { value: "revenue", label: "Revenue" },
    { value: "currentActiveMembers", label: "Current Active Members" },
    { value: "contactNumber", label: "Contact Number", singleField: false },
    { value: "employeeGrowth", label: "Employee Growth" }, // Added employeeGrowth
    { value: "subsidiaries", label: "Subsidiaries", singleField: false },
  ];

  const employeeGrowthOptions = [
    { value: "employeeGrowth6Months", label: "Employee Growth in last 6 months" },
    { value: "employeeGrowth1Year", label: "Employee Number Growth in last 1 year" },
    { value: "employeeGrowth2Years", label: "Employee Number Growth in last 2 years" },
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
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found. Please log in again.");
          navigate("/login");
          return;
        }

        const response = await axios.get(
          `https://dsp-backend.onrender.com/api/company-details/pending-approvals/${id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setCompanyDetails(response.data);
      } catch (err) {
        console.error("Fetch company details error:", err.response?.data || err.message);
        setError(`Failed to fetch company details: ${err.response?.data?.message || err.message}`);
      }
    };

    fetchCompanyDetails();
  }, [id, navigate]);

  const updateApprovalStatus = async (status) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        navigate("/login");
        return;
      }
      const response = await axios.put(
        `https://dsp-backend.onrender.com/api/company-details/approve-company-details/${id}`,
        { status, returnToEmployee: status === "rejected" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Approval status updated to ${status} successfully!`);
      navigate("/admin");
    } catch (err) {
      console.error("Update approval status error:", err.response?.data || err.message);
      setError(`Failed to update approval status: ${err.response?.data?.message || err.message}`);
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!companyDetails) return <div className="loading-message">Loading...</div>;

  return (
    <div className="company-form-container">
      <h2 className="company-form-title">
        Company Details: {companyDetails.companyId.businessName || `Unknown (ID: ${companyDetails.companyId._id})`}
      </h2>

      <p className="company-form-subtitle">
        <strong>Employee:</strong> {companyDetails.employeeId.name} ({companyDetails.employeeId.email})
      </p>
      <p className="company-form-subtitle">
        <strong>Submitted Date:</strong> {new Date(companyDetails.submittedDate).toLocaleDateString()}
      </p>

      <div className="form-section">
        <h4 className="form-section-title">General Information</h4>
        {generalAddonOptions.map((option) => (
          <div key={option.value} className="form-group">
            <label className="form-label">{option.label}:</label>
            {option.value === "companySize" ? (
              <p className="form-input">
                {companySizeOptions.includes(companyDetails.formData?.[option.value])
                  ? companyDetails.formData[option.value]
                  : "N/A"}
              </p>
            ) : option.value === "employeeGrowth" ? (
              <p className="form-input">
                {companyDetails.formData?.employeeGrowth?.value
                  ? `${companyDetails.formData.employeeGrowth.value} (${
                      employeeGrowthOptions.find(opt => opt.value === companyDetails.formData.employeeGrowth.period)?.label || "N/A"
                    })`
                  : "N/A"}
              </p>
            ) : option.singleField === false ? (
              <p className="form-input">
                {Array.isArray(companyDetails.formData?.[option.value])
                  ? companyDetails.formData[option.value].join(", ") || "N/A"
                  : "N/A"}
              </p>
            ) : (
              <p className="form-input">
                {companyDetails.formData?.[option.value] || "N/A"}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="form-section">
        <h4 className="form-section-title">Decision Makers</h4>
        {decisionMakerOptions.map((option) => {
          const decisionMakerData = companyDetails.formData?.[option.value];
          let decisionMakers = [];

          if (Array.isArray(decisionMakerData)) {
            decisionMakers = decisionMakerData;
          } else if (decisionMakerData && typeof decisionMakerData === "object") {
            decisionMakers = [decisionMakerData];
          }

          return decisionMakers.length > 0 ? (
            <div key={option.value} className="form-group">
              <label className="form-label">{option.label}:</label>
              {decisionMakers.map((dm, index) => (
                <div key={index} className="decision-maker-card">
                  <div className="card-header">
                    <span className="card-title">Decision Maker {index + 1}</span>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Name:</label>
                    <p className="form-input">{dm.name || "N/A"}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email:</label>
                    <p className="form-input">{dm.email || "N/A"}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number:</label>
                    <p className="form-input">{dm.phoneNumber || "N/A"}</p>
                  </div>
                  <div className="form-group">
                    <label className="form-label">LinkedIn Profile:</label>
                    <p className="form-input">{dm.linkedinProfile || "N/A"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null;
        })}
      </div>

      <div className="form-navigation">
        <button
          onClick={() => updateApprovalStatus("approved")}
          className="btn green"
        >
          Approve
        </button>
        <button
          onClick={() => updateApprovalStatus("rejected")}
          className="btn red"
        >
          Reject
        </button>
        <button
          onClick={() => navigate("/admin")}
          className="btn purple"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
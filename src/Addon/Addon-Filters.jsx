// Addon-Filters.jsx
import React from "react";
import Select from "react-select";

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

const customStyles = {
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
};

const AddonFilters = ({ selectedAddons, setSelectedAddons }) => {
  const handleGeneralAddonChange = (selectedOptions) => {
    const generalAddons = selectedOptions || [];
    const decisionMakerAddons = selectedAddons.filter(opt => decisionMakerOptions.some(dm => dm.value === opt.value));
    setSelectedAddons([...generalAddons, ...decisionMakerAddons]);
  };

  const handleDecisionMakerChange = (selectedOptions) => {
    const decisionMakerAddons = selectedOptions || [];
    const generalAddons = selectedAddons.filter(opt => generalAddonOptions.some(ga => ga.value === opt.value));
    setSelectedAddons([...generalAddons, ...decisionMakerAddons]);
  };

  const selectedGeneralAddons = selectedAddons.filter(opt => generalAddonOptions.some(ga => ga.value === opt.value));
  const selectedDecisionMakerAddons = selectedAddons.filter(opt => decisionMakerOptions.some(dm => dm.value === opt.value));

  return (
    <div>
      <h3 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>
        Select Add-Ons
      </h3>
      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>General Add-Ons</label>
        <Select
          isMulti
          options={generalAddonOptions}
          value={selectedGeneralAddons}
          onChange={handleGeneralAddonChange}
          placeholder="Select general add-ons..."
          styles={customStyles}
        />
      </div>

      <div style={{ marginBottom: "15px" }}>
        <label style={{ display: "block", marginBottom: "5px", fontSize: "12px" }}>
          Decision Makers (Add-On)
        </label>
        <Select
          isMulti
          options={decisionMakerOptions}
          value={selectedDecisionMakerAddons}
          onChange={handleDecisionMakerChange}
          placeholder="Select decision makers..."
          styles={customStyles}
        />
      </div>

      <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
        Choose additional data points to include in your list, such as website, email addresses, or decision-maker roles.
      </p>

      {/* Add the "What is EasyList?" section */}
      <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #e0e0e0", borderRadius: "4px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "bold", marginBottom: "10px" }}>What is EasyList?</h3>
        <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
          <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ color: "#28a745", marginRight: "8px" }}>✔</span>
            EasyList is our straightforward on demand tool designed to help you build personalised company lists from a global database of more than 17+ million companies.
          </li>
          <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ color: "#28a745", marginRight: "8px" }}>✔</span>
            With access to millions of companies in your local market and worldwide you can refine your searches using 6 different search criteria. These include location (country, region, city...), Category, Subcategory and Sub-Subcategory.
          </li>
          <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ color: "#28a745", marginRight: "8px" }}>✔</span>
            GDPR Compliance! Target potential prospects by creating your wish list, purchase and download your personalised prospect list in an excel format. Ready to use for your Sales & Marketing campaigns.
          </li>
          <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ color: "#28a745", marginRight: "8px" }}>✔</span>
            Create and customise your list using the filters below: Categories, Location (Country, State, City...).
          </li>
          <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px" }}>
            <span style={{ color: "#28a745", marginRight: "8px" }}>✔</span>
            Get your files on email immediately after secure payment (credit card or PayPal)
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AddonFilters;
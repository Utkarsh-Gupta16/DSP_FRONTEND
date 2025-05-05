import React, { useState } from "react";
import Select from "react-select";
import { motion, AnimatePresence } from "framer-motion";
import { FaInfoCircle, FaQuestionCircle, FaTimes, FaPlus } from "react-icons/fa";

const generalAddonOptions = [
  { value: "website", label: "Website" },
  { value: "mailIds", label: "Mail IDs" },
  { value: "linkedinProfile", label: "LinkedIn Profile" },
  { value: "headquarterAddress", label: "Headquarter Address" },
  { value: "foundationYear", label: "Foundation Year" },
  { value: "presentInCountries", label: "Present in Countries" },
  { value: "locationOfEachCountryOffice", label: "Location of Each Country's Office" },
  { value: "subsidaries", label: "Subsidaries" },
  { value: "employeeGrowth", label: "Employee Growth" },
  { value: "contactNumber", label: "Contact Number" },
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
  { value: "customDecisionMaker", label: "Custom Decision Maker" },
];

const customStyles = {
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
};

const AddonFilters = ({ selectedAddons, setSelectedAddons }) => {
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [customDecisionMakers, setCustomDecisionMakers] = useState([]);
  const [showCustomInput, setShowCustomInput] = useState(false);

  const handleGeneralAddonChange = (selectedOptions) => {
    const generalAddons = selectedOptions || [];
    const decisionMakerAddons = selectedAddons.filter((opt) =>
      decisionMakerOptions.some((dm) => dm.value === opt.value && dm.value !== "customDecisionMaker")
    );
    setSelectedAddons([...generalAddons, ...decisionMakerAddons]);
  };

  const handleDecisionMakerChange = (selectedOptions) => {
    const decisionMakerAddons = selectedOptions || [];
    const generalAddons = selectedAddons.filter((opt) =>
      generalAddonOptions.some((ga) => ga.value === opt.value)
    );
    const hasCustom = decisionMakerAddons.some((opt) => opt.value === "customDecisionMaker");
    if (hasCustom && !showCustomInput) setShowCustomInput(true);
    else if (!hasCustom && showCustomInput) setShowCustomInput(false);
    setSelectedAddons([...generalAddons, ...decisionMakerAddons]);
  };

  const handleAddCustomDecisionMaker = () => {
    setCustomDecisionMakers([...customDecisionMakers, ""]);
  };

  const handleCustomDecisionMakerChange = (index, value) => {
    const updatedCustoms = [...customDecisionMakers];
    updatedCustoms[index] = value;
    setCustomDecisionMakers(updatedCustoms);
  };

  const selectedGeneralAddons = selectedAddons.filter((opt) =>
    generalAddonOptions.some((ga) => ga.value === opt.value)
  );
  const selectedDecisionMakerAddons = selectedAddons.filter((opt) =>
    decisionMakerOptions.some((dm) => dm.value === opt.value && dm.value !== "customDecisionMaker")
  );

  return (
    <div style={{ position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold" }}>Select Add-Ons</h3>
        <div style={{ display: "flex", gap: "10px" }}>
          <motion.button
            onClick={() => setShowTermsModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              padding: "6px 12px",
              background: "#080093",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "12px",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <FaInfoCircle /> Information
          </motion.button>
          <motion.div
            style={{ position: "relative" }}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              style={{
                width: "24px",
                height: "24px",
                background: "#080093",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
              }}
            >
              <FaQuestionCircle />
            </motion.button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  style={{
                    position: "absolute",
                    top: "-50px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    background: "#333",
                    color: "#fff",
                    padding: "8px 12px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                    zIndex: 1000,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                  }}
                >
                  Lorem ipsum dolor sit amet
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

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
        {showCustomInput && (
          <div style={{ marginTop: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
            <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "10px" }}>Custom Decision Makers</h4>
            {customDecisionMakers.map((maker, index) => (
              <div key={index} style={{ marginBottom: "10px", display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="text"
                  value={maker}
                  onChange={(e) => handleCustomDecisionMakerChange(index, e.target.value)}
                  placeholder={`Custom Decision Maker ${index + 1}`}
                  style={{
                    padding: "5px",
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    flex: 1,
                  }}
                />
              </div>
            ))}
            <motion.button
              onClick={handleAddCustomDecisionMaker}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: "6px 12px",
                background: "#080093",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "5px",
                fontSize: "12px",
              }}
            >
              <FaPlus /> Add
            </motion.button>
          </div>
        )}
      </div>

      <p style={{ fontSize: "12px", color: "#666", marginTop: "10px" }}>
        Choose additional data points to include in your list, such as website, email addresses, or decision-maker roles.
      </p>

      <AnimatePresence>
        {showTermsModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                zIndex: 999,
              }}
              onClick={() => setShowTermsModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
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
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "15px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "bold" }}>Terms and Conditions</h3>
                <motion.button
                  onClick={() => setShowTermsModal(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "16px",
                    color: "#666",
                  }}
                >
                  <FaTimes />
                </motion.button>
              </div>
              <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
                <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ color: "#28a745", marginRight: "8px" }}>✔</span>
                  Add-on charges are non-refundable as they also include service and search-related costs, regardless of the results delivered.
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ color: "#28a745", marginRight: "8px" }}>✔</span>
                  In certain cases, specific add-ons requested by the user may not be available through any reliable sources. In such instances, while we regret our inability to fulfill the add-on request, we will proceed to deliver your order with all available and relevant details at our disposal. Please note that no refund will be issued for unavailable add-ons.
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", marginBottom: "10px" }}>
                  <span style={{ color: "#28a745", marginRight: "8px" }}>✔</span>
                  Once an order is placed, modifications or changes are not permitted. Refunds will only be issued if we are unable to deliver the basic data promised.
                </li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AddonFilters;
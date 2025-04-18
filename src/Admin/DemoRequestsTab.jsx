import React, { useState, useEffect } from "react";
import axios from "axios";

const DemoRequestsTab = () => {
  const [demoRequests, setDemoRequests] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [error, setError] = useState(null);
  const [assigningRequestId, setAssigningRequestId] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");

  useEffect(() => {
    fetchDemoRequests();
    fetchEmployees();
  }, []);

  const fetchDemoRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        return;
      }
      const response = await axios.get("https://dsp-backend.onrender.com/api/demo", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDemoRequests(response.data);
    } catch (err) {
      console.error("Fetch demo requests error:", err.response?.data || err.message);
      setError(`Failed to fetch demo requests: ${err.response?.data?.message || err.message}`);
    }
  };

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        return;
      }
      const response = await axios.get("https://dsp-backend.onrender.com/api/users/employee", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEmployees(response.data);
    } catch (err) {
      console.error("Fetch employees error:", err.response?.data || err.message);
      setError(`Failed to fetch employees: ${err.response?.data?.message || err.message}`);
    }
  };

  const assignDemoRequest = async (requestId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in again.");
        return;
      }
      if (!selectedEmployeeId) {
        setError("Please select an employee.");
        return;
      }
      await axios.put(
        `https://dsp-backend.onrender.com/api/demo/assign/${requestId}`,
        { assignedTo: selectedEmployeeId }, // Changed from employeeId to assignedTo
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Demo request assigned successfully!");
      fetchDemoRequests();
      setAssigningRequestId(null);
      setSelectedEmployeeId(""); // Reset selected employee
    } catch (err) {
      console.error("Assign demo request error:", err.response?.data || err.message);
      setError(`Failed to assign demo request: ${err.response?.data?.message || err.message}`);
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
      fetchDemoRequests();
    } catch (err) {
      console.error("Cancel demo request error:", err.response?.data || err.message);
      setError(`Failed to cancel demo request: ${err.response?.data?.message || err.message}`);
    }
  };

  if (error) {
    return <div style={{ padding: "20px", color: "red" }}>{error}</div>;
  }

  return (
    <div style={{ overflowX: "auto" }}>
      <h3>Demo Requests</h3>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Name</th>
            <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Date & Time</th>
            <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Message</th>
            <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Status</th>
            <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Assigned To</th>
            <th style={{ border: "1px solid #e0e0e0", padding: "8px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {demoRequests.map((request) => (
            <tr key={request._id}>
              <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{request.name}</td>
              <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{request.email}</td>
              <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                {new Date(request.date).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{request.message || "N/A"}</td>
              <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>{request.status}</td>
              <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                {request.assignedTo ? `${request.assignedTo.name} (${request.assignedTo.email})` : "Unassigned"}
              </td>
              <td style={{ border: "1px solid #e0e0e0", padding: "8px" }}>
                {assigningRequestId === request._id ? (
                  <div>
                    <select
                      id={`employee-${request._id}`}
                      value={selectedEmployeeId}
                      onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      style={{ marginRight: "10px", padding: "5px" }}
                    >
                      <option value="">Select an employee</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp._id}>
                          {emp.name} ({emp.email})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => assignDemoRequest(request._id)}
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
                      Confirm
                    </button>
                    <button
                      onClick={() => {
                        setAssigningRequestId(null);
                        setSelectedEmployeeId("");
                      }}
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
                ) : (
                  <>
                    {request.status !== "completed" && request.status !== "cancelled" && (
                      <>
                        <button
                          onClick={() => setAssigningRequestId(request._id)}
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
                          Assign
                        </button>
                        <button
                          onClick={() => cancelDemoRequest(request._id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#dc3545",
                            color: "#fff",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer",
                          }}
                        >
                          Cancel Demo
                        </button>
                      </>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DemoRequestsTab;
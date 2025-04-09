import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRole } from "../App";
import "../styles/Patients.css";

const Patients = ({ patients, setPatients }) => {
  const { role } = useRole();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("name"); // Default search by name
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermError, setSearchTermError] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patients);

  useEffect(() => {
    setSearchTermError("");
    let results = patients; // Default to showing all

    if (searchTerm) {
      if (searchType === "name") {
        results = patients.filter(patient =>
          patient.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
      } else if (searchType === "mobile") {
        results = patients.filter(patient =>
          patient.mobile.includes(searchTerm)
        );
      }
    }
    setFilteredPatients(results);
  }, [searchType, searchTerm, patients]);

  const handleSearchTypeChange = (event) => {
    setSearchType(event.target.value);
    setSearchTerm("");
    setSearchTermError("");
  };

  const handleSearchTermChange = (event) => {
    const value = event.target.value;

    if (searchType === "name") {
      if (value.length <= 30) {
        setSearchTerm(value);
        setSearchTermError("");
      }
    } else if (searchType === "mobile") {
      if (/^\d*$/.test(value)) { // Allow only digits
        if (value.length <= 11) {
          if (value.length === 1 && value !== '0') {
            return; // Prevent entering any digit other than '0' as the first digit
          }
          if (value.length === 2 && value[0] === '0' && value[1] !== '1') {
            return; // Prevent entering anything other than '1' as the second digit if the first was '0'
          }
          if (value.length === 3 && value.substring(0, 2) === '01' && !['0', '1', '2', '5'].includes(value[2])) {
            return; // Prevent entering anything other than 0, 1, 2, or 5 as the third digit after '01'
          }
        
        
          if (value.length >= 3 && !/^(010|011|012|015)/.test(value.substring(0, 3))) {
            setSearchTermError("Mobile number must start with 010, 011, 012, or 015.");
          } else if (value.length === 11 && !/^(010|011|012|015)\d{8}$/.test(value)) {
            setSearchTermError("Mobile number must start with 010, 011, 012, or 015 and be 11 digits.");
          } else {
            setSearchTermError(""); // Clear error if now valid
          }
          setSearchTerm(value);
        }
      }
    } else {
      setSearchTerm(value);
    }
  };

  // ✅ Delete Function
  const handleDelete = (id) => {
    setPatients((prevPatients) => prevPatients.filter(patient => patient.id !== id));
  };

  return (
    <div className="patients-container">
      <h1>Patients</h1>

      {/* ⚙️ Search Type Selector and 🔎 Search Bar */}
      <div className="filters">
        <select value={searchType} onChange={handleSearchTypeChange}>
          <option value="name">Search by Name</option>
          <option value="mobile">Search by Mobile</option>
        </select>
        <div className="search-input">
          <input
            type="text"
            placeholder={`Search by ${searchType === 'name' ? 'name' : 'mobile'}...`}
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          {searchTermError && <p className="error-message">{searchTermError}</p>}
        </div>
        <button className="btn add" onClick={() => navigate("/add-patient")}>
          <FaUser /> New Patient
        </button>
      </div>

      {/* 📋 Patients Table */}
      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.mobile}</td>
                <td className="actions">
                  {/* ✅ Navigate to Profile */}
                  <button className="btn profile" onClick={() => navigate(`/patients/${patient.id}`)}>
                    <FaUser /> Profile
                  </button>
                  {role === "admin" && (
                    <>
                      <button className="btn edit" onClick={() => navigate(`/add-patient/${patient.id}`)}>
                        Edit
                      </button>
                      <button className="btn delete" onClick={() => handleDelete(patient.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Patients;
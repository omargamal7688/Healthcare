import React, { useState, useEffect } from "react";
import { FaUser, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRole } from "../App";
import "../styles/Patients.css";
import "../styles/ConfirmationPopup.css"; // Import CSS for the popup

const Patients = ({ patients, setPatients }) => {
  const { role } = useRole();
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState("name"); // Default search by name
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermError, setSearchTermError] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [patientToDeleteId, setPatientToDeleteId] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

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
    setCurrentPage(1); // Reset page on search
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

  const handleDeleteClick = (id) => {
    setPatientToDeleteId(id);
    setShowConfirmation(true);
  };

  const confirmDelete = () => {
    if (patientToDeleteId !== null) {
      setPatients((prevPatients) => prevPatients.filter(patient => patient.id !== patientToDeleteId));
      setPatientToDeleteId(null);
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setPatientToDeleteId(null);
    setShowConfirmation(false);
  };

  // Pagination logic
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={currentPage === i ? "active" : ""}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
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
            {currentPatients.map((patient) => (
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
                      <button className="btn delete" onClick={() => handleDeleteClick(patient.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            {renderPageNumbers()}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        )}

        <div className="filters">  <button className="btn add" onClick={() => navigate("/add-patient")}>
          <FaUser /> New Patient
        </button></div>

      </div>

      {/* Confirmation Popup */}
      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <FaExclamationTriangle className="warning-icon" />
            <p>Are you sure you want to delete this patient?</p>
            <div className="confirmation-buttons">
              <button className="btn confirm-button" onClick={confirmDelete}>Yes, Delete</button>
              <button className="btn cancel-button" onClick={cancelDelete}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;
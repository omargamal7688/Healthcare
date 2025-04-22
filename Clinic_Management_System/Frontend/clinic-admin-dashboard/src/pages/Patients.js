import React, { useState, useEffect } from "react";
import { FaUser, FaExclamationTriangle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useRole } from "../App";
import "../styles/Patients.css";
import "../styles/ConfirmationPopup.css";

const Patients = ({ patients, setPatients }) => {
  const { t } = useTranslation();
  const { role } = useRole();
  const navigate = useNavigate();

  const [searchType, setSearchType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTermError, setSearchTermError] = useState("");
  const [filteredPatients, setFilteredPatients] = useState(patients);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [patientToDeleteId, setPatientToDeleteId] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 10;

  useEffect(() => {
    setSearchTermError("");
    let results = patients;

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
    setCurrentPage(1);
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
      if (/^\d*$/.test(value)) {
        if (value.length <= 11) {
          if (value.length === 1 && value !== '0') return;
          if (value.length === 2 && value[0] === '0' && value[1] !== '1') return;
          if (value.length === 3 && value.substring(0, 2) === '01' && !['0', '1', '2', '5'].includes(value[2])) return;

          if (value.length >= 3 && !/^(010|011|012|015)/.test(value.substring(0, 3))) {
            setSearchTermError(t("mobilePrefixError"));
          } else if (value.length === 11 && !/^(010|011|012|015)\d{8}$/.test(value)) {
            setSearchTermError(t("mobileLengthError"));
          } else {
            setSearchTermError("");
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
      setPatients((prev) => prev.filter(patient => patient.id !== patientToDeleteId));
      setPatientToDeleteId(null);
      setShowConfirmation(false);
    }
  };

  const cancelDelete = () => {
    setPatientToDeleteId(null);
    setShowConfirmation(false);
  };

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstPatient, indexOfLastPatient);

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const paginate = (page) => setCurrentPage(page);

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
      <h1>{t("patients")}</h1>

      <div className="filters">
        <select value={searchType} onChange={handleSearchTypeChange}>
          <option value="name">{t("searchByName")}</option>
          <option value="mobile">{t("searchByMobile")}</option>
        </select>
        <div className="search-input">
          <input
            type="text"
            placeholder={t("searchPlaceholder", { type: t(searchType) })}
            value={searchTerm}
            onChange={handleSearchTermChange}
          />
          {searchTermError && <p className="error-message">{searchTermError}</p>}
        </div>
      </div>

      <div className="table-container">
        <table className="patients-table">
          <thead>
            <tr>
              <th>{t("name")}</th>
              <th>{t("mobile")}</th>
              <th>{t("actions")}</th>
            </tr>
          </thead>
          <tbody>
            {currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.name}</td>
                <td>{patient.mobile}</td>
                <td className="actions">
                  <button className="btn profile" onClick={() => navigate(`/patients/${patient.id}`)}>
                    {t("profile")}
                  </button>
                  {role && (
                    <>
                      <button className="btn edit" onClick={() => navigate(`/add-patient/${patient.id}`)}>
                        {t("edit")}
                      </button>
                      <button className="btn delete" onClick={() => handleDeleteClick(patient.id)}>
                        {t("delete")}
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {totalPages > 1 && (
          <div className="pagination">
            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
              {t("previous")}
            </button>
            {renderPageNumbers()}
            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
              {t("next")}
            </button>
          </div>
        )}

        <div className="filters">
          <button className="btn add" onClick={() => navigate("/add-patient")}>
            <FaUser /> {t("addNewPatient")}
          </button>
        </div>
      </div>

      {showConfirmation && (
        <div className="confirmation-overlay">
          <div className="confirmation-popup">
            <FaExclamationTriangle className="warning-icon" />
            <p>{t("confirmDeleteMessage")}</p>
            <div className="confirmation-buttons">
              <button className="btn confirm-button" onClick={confirmDelete}>
                {t("confirmDelete")}
              </button>
              <button className="btn cancel-button" onClick={cancelDelete}>
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Patients;

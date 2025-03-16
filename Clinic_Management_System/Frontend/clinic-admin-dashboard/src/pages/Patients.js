import React, { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useRole } from "../App";
import "../styles/Patients.css";

const Patients = ({ patients, setPatients }) => {
  const { role } = useRole();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  // ✅ Delete Function
  const handleDelete = (id) => {
    setPatients((prevPatients) => prevPatients.filter(patient => patient.id !== id));
  };

  return (
    <div className="patients-container">
      <h1>Patients</h1>

      {/* 🔎 Search Bar */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by name or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            {patients.map((patient) => (
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
                      <button className="btn edit">Edit</button>
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

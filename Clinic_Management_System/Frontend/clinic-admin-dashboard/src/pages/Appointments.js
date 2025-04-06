import React, { useState } from "react";
import "../styles/Appointments.css";

const Appointments = ({ appointments, setAppointments }) => {
  const [search, setSearch] = useState("");
  const [clinicFilter, setClinicFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  // Mark as Completed
  const markAsCompleted = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? { ...appt, success: true, cancelled: false } : appt
      )
    );
  };

  // Cancel Appointment
  const cancelAppointment = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? { ...appt, cancelled: true, success: false } : appt
      )
    );
  };

  // Filter Appointments
  const filteredAppointments = appointments.filter(
    (appt) =>
      (appt.patientName.toLowerCase().includes(search.toLowerCase()) ||
        appt.date.includes(search)) &&
      (clinicFilter === "" || appt.clinicName === clinicFilter) &&
      (typeFilter === "" || appt.type === typeFilter) &&
      (dateFilter === "" || appt.date === dateFilter)
  );

  return (
    <div className="appointments-container">
      <h1>Appointments</h1>
      <p>Manage clinic appointments efficiently.</p>

      {/* Search and Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search by patient name or date..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
        <select value={clinicFilter} onChange={(e) => setClinicFilter(e.target.value)} className="filter-select">
          <option value="">All Clinics</option>
          <option value="المطرية">المطرية</option>
          <option value="مصر الجديدة">مصر الجديدة</option>
        </select>
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)} className="filter-select">
          <option value="">All Types</option>
          <option value="كشف">كشف</option>
          <option value="استشارة">استشارة</option>
        </select>
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="date-filter"
        />
      </div>

      {/* Appointments Table */}
      <table className="appointments-table">
        <thead>
          <tr>
            <th>Turn</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Day</th>
            <th>Clinic</th>
            <th>Type</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appt) => (
              <tr key={appt.id} className={appt.cancelled ? "cancelled" : appt.success ? "success" : ""}>
                <td>{appt.turn}</td>
                <td>{appt.patientName}</td>
                <td>{appt.date}</td>
                <td>{appt.dayOfWeek}</td>
                <td>{appt.clinicName}</td>
                <td>{appt.type}</td>
                <td>{appt.cancelled ? "Cancelled" : appt.success ? "Completed" : "Pending"}</td>
                <td>
                  {!appt.cancelled && !appt.success && (
                    <>
                      <button className="complete-btn" onClick={() => markAsCompleted(appt.id)}>Completed</button>
                      <button className="cancel-btn" onClick={() => cancelAppointment(appt.id)}>Cancel</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-results">No appointments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Appointments;

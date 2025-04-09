// Profile.js
import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaWhatsapp, FaPlusCircle } from "react-icons/fa";
import "../styles/Profile.css";

const Profile = ({ patients, appointments, setAppointments }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const patientId = Number(id);

  const patient = patients.find((p) => p.id === patientId);
  if (!patient) {
    return (
      <div className="profile-container">
        <h2>Patient Not Found</h2>
        <button className="back-button" onClick={() => navigate("/patients")}>
          Back to Patients
        </button>
      </div>
    );
  }

  // Filter Appointments for this Patient
  const patientAppointments = appointments.filter(
    (appointment) => appointment.patientId === patientId
  );

  // Update Appointment Status
  const markAsCompleted = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? { ...appt, success: true, cancelled: false } : appt
      )
    );
  };

  const cancelAppointment = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? { ...appt, cancelled: true, success: false } : appt
      )
    );
  };

  const handleMakeNewAppointment = () => {
    navigate(`/add-appointment?patientId=${patientId}`); // Pass patientId
  };

  // WhatsApp Web Click to Chat URL
  const whatsappMessage = encodeURIComponent(`Hello ${patient.name}, welcome to our clinic!`);
  const whatsappUrl = `https://web.whatsapp.com/send?phone=${patient.mobile.replace(/[^0-9]/g, "")}&text=${whatsappMessage}`;

  return (
    <div className="profile-container">
      <h2 className="profile-title">Patient Profile</h2>

      {/* Personal Information Table */}
      <h3>Personal Information</h3>
      <table className="personal-info-table">
        <tbody>
          <tr>
            <th>Name</th>
            <td>{patient.name}</td>
          </tr>
          <tr>
            <th>Mobile</th>
            <td>
              {patient.mobile}{" "}
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="whatsapp-icon">
                <FaWhatsapp />
              </a>
            </td>
          </tr>
        </tbody>
      </table>

      <h3>Appointments</h3>
      {patientAppointments.length > 0 ? (
        <table className="appointments-table">
          <thead>
            <tr>
              <th>Turn</th>
              <th>Date</th>
              <th>Clinic</th>
              <th>Type</th>
              <th>Day</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {patientAppointments.map((appointment) => {
              let status = "Pending";
              if (appointment.cancelled) {
                status = "Cancelled";
              } else if (appointment.success) {
                status = "Completed";
              }

              return (
                <tr key={appointment.id}>
                  <td>{appointment.turn}</td>
                  <td>{appointment.date}</td>
                  <td>{appointment.clinicName}</td>
                  <td>{appointment.type}</td>
                  <td>{appointment.dayOfWeek}</td>
                  <td className={`status-${status.toLowerCase()}`}>{status}</td>
                  <td>
                    {!appointment.cancelled && !appointment.success && (
                      <>
                        <button className="complete-btn" onClick={() => markAsCompleted(appointment.id)}>Completed</button>
                        <button className="cancel-btn" onClick={() => cancelAppointment(appointment.id)}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <p>No appointments found for this patient.</p>
      )}

      {/* Make New Appointment Button */}
      <button className="make-appointment-btn" onClick={handleMakeNewAppointment}>
        <FaPlusCircle className="plus-icon" /> Make New Appointment
      </button>

      <button className="back-button" onClick={() => navigate("/patients")}>
        Back to Patients
      </button>
    </div>
  );
};

export default Profile;
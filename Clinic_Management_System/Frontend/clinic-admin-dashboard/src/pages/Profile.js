import React from "react";
import { useParams, useNavigate } from "react-router-dom";

const Profile = ({ patients }) => {
  const { id } = useParams(); // Get patient ID from URL
  const navigate = useNavigate();

  // ✅ Convert `id` from URL to number (since `useParams` returns a string)
  const patient = patients.find((p) => p.id === Number(id));

  if (!patient) {
    return (
      <div className="profile-container">
        <h2>Patient Not Found</h2>
        <button className="btn" onClick={() => navigate("/patients")}>
          Back to Patients
        </button>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <h2>Patient Profile</h2>
      <p><strong>Name:</strong> {patient.name}</p>
      <p><strong>Mobile:</strong> {patient.mobile}</p>
      <button className="btn" onClick={() => navigate("/patients")}>
        Back to Patients
      </button>
    </div>
  );
};

export default Profile;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddPatient = ({ patients, setPatients }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !mobile) {
      alert("Please fill in all fields.");
      return;
    }

    // ✅ Create new patient object
    const newPatient = {
      id: patients.length + 1, // Simple ID generation
      name,
      mobile
    };

    // ✅ Add new patient to the list
    setPatients([...patients, newPatient]);

    // ✅ Navigate back to patients list
    navigate("/patients");
  };

  return (
    <div className="add-patient-container">
      <h1>Add New Patient</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Mobile:</label>
        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} required />

        <button type="submit">Add Patient</button>
      </form>
    </div>
  );
};

export default AddPatient;

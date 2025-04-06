import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const AddPatient = ({ patients, setPatients }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the patient ID from the URL
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    // If ID exists, we are in edit mode, so populate the form with the patient's data
    if (id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) {
        setName(patient.name);
        setMobile(patient.mobile);
      }
    }
  }, [id, patients]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !mobile) {
      alert("Please fill in all fields.");
      return;
    }

    if (id) {
      // ✅ Update existing patient
      setPatients((prev) =>
        prev.map((p) => (p.id === parseInt(id) ? { ...p, name, mobile } : p))
      );
    } else {
      // ✅ Add new patient
      const newPatient = {
        id: patients.length + 1,
        name,
        mobile,
      };
      setPatients([...patients, newPatient]);
    }

    navigate("/patients");
  };

  return (
    <div className="add-patient-container">
      <h1>{id ? "Edit Patient" : "Add New Patient"}</h1>
      <form onSubmit={handleSubmit}>
        <label>Name:</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />

        <label>Mobile:</label>
        <input type="text" value={mobile} onChange={(e) => setMobile(e.target.value)} required />

        <button type="submit">{id ? "Update Patient" : "Add Patient"}</button>
      </form>
    </div>
  );
};

export default AddPatient;

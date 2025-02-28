import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientForm = ({ editingPatient, setEditingPatient }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (editingPatient) {
      setName(editingPatient.name);
      setMobile(editingPatient.mobile);
    }
  }, [editingPatient]);

  const savePatient = () => {
    const patientData = { id: editingPatient?.id, name, mobile };

    axios.post("http://localhost:8080/api/patients", patientData)
      .then(() => {
        setEditingPatient(null);
        navigate("/");
      })
      .catch((error) => console.error("Error saving patient:", error));
  };

  return (
    <div className="container mt-4">
      <h2>{editingPatient ? "Edit Patient" : "Add Patient"}</h2>
      <input
        type="text"
        placeholder="Name"
        className="form-control mb-2"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Mobile"
        className="form-control mb-2"
        value={mobile}
        onChange={(e) => setMobile(e.target.value)}
      />
      <button className="btn btn-success me-2" onClick={savePatient}>
        {editingPatient ? "Update" : "Add"}
      </button>
      <button className="btn btn-secondary" onClick={() => navigate("/")}>
        Cancel
      </button>
      <footer class="footer">
    <p>© 2024 نظام العيادة. جميع الحقوق محفوظة.</p>
</footer>
    </div>
  );
};

export default PatientForm;

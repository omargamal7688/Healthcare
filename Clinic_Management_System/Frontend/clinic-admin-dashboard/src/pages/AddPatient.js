import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddPatient.css"; // Import CSS for styling

const AddPatient = ({ patients, setPatients }) => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the patient ID from the URL
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [mobileExistsError, setMobileExistsError] = useState("");

  useEffect(() => {
    if (id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) {
        setName(patient.name);
        setMobile(patient.mobile);
      }
    }
  }, [id, patients]);

  useEffect(() => {
    const validateForm = () => {
      const validateMobileUniqueness = (mobile) => {
        const existingPatient = patients.find((p) => p.mobile === mobile);
        if (existingPatient && (!id || existingPatient.id !== parseInt(id))) {
          return "This mobile number already exists.";
        }
        return "";
      };

      setNameError(validateName(name));
      const mobileValidationError = validateMobile(mobile);
      setMobileError(mobileValidationError);
      setMobileExistsError(
        mobileValidationError ? "" : validateMobileUniqueness(mobile)
      );
      setIsFormValid(
        !validateName(name) &&
        !mobileValidationError &&
        !validateMobileUniqueness(mobile)
      );
    };

    validateForm();
  }, [name, mobile, patients, id]);

  const validateName = (name) => {
    if (!name) return "Name is required.";
    if (name.length > 30) return "Name cannot be longer than 30 characters.";
    return "";
  };

  const validateMobile = (mobile) => {
    if (!mobile) return "Mobile number is required.";
    if (!/^\d*$/.test(mobile)) return "Mobile number must contain only digits.";
    if (mobile.length !== 11) return "Mobile number must be 11 digits long.";
    if (!/^(010|011|012|015)/.test(mobile.substring(0, 3))) {
      return "Mobile number must start with 010, 011, 012, or 015.";
    }
    return "";
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleMobileChange = (e) => {
    const value = e.target.value;

    if (/^\d*$/.test(value) && value.length <= 11) {
      if (value.length === 1 && value !== "0") return;
      if (value.length === 2 && value[0] === "0" && value[1] !== "1") return;
      if (
        value.length === 3 &&
        value.substring(0, 2) === "01" &&
        !["0", "1", "2", "5"].includes(value[2])
      ) {
        return;
      }
      setMobile(value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isFormValid) {
      if (id) {
        setPatients((prev) =>
          prev.map((p) => (p.id === parseInt(id) ? { ...p, name, mobile } : p))
        );
      } else {
        const newPatient = {
          id: patients.length + 1,
          name,
          mobile,
        };
        setPatients([...patients, newPatient]);
      }
      navigate("/patients");
    }
  };

  return (
    <div className="add-patient-container">
      <h1>{id ? "Edit Patient" : "Add New Patient"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            maxLength="30"
            required
          />
          {nameError && <p className="error-message">{nameError}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="mobile">Mobile:</label>
          <input
            type="text"
            id="mobile"
            value={mobile}
            onChange={handleMobileChange}
            required
          />
          {mobileError && <p className="error-message">{mobileError}</p>}
          {mobileExistsError && (
            <p className="error-message">{mobileExistsError}</p>
          )}
        </div>

        <button type="submit" disabled={!isFormValid}>
          {id ? "Update Patient" : "Add Patient"}
        </button>
      </form>
    </div>
  );
};

export default AddPatient;

import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddPatient.css";
import { useTranslation } from "react-i18next";

const AddPatient = ({ patients, setPatients }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [mobileExistsError, setMobileExistsError] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    if (id) {
      const patient = patients.find((p) => p.id === parseInt(id));
      if (patient) {
        setName(patient.name);
        setMobile(patient.mobile);
      }
    }
  }, [id, patients]);

  const validateName = useCallback(
    (name) => {
      if (!name) return t("nameRequired");
      if (name.length > 30) return t("nameTooLong");
      return "";
    },
    [t]
  );

  const validateMobile = useCallback(
    (mobile) => {
      if (!mobile) return t("mobileRequired");
      if (!/^\d*$/.test(mobile)) return t("mobileDigitsOnly");
      if (mobile.length !== 11) return t("mobileLengthError");
      if (!/^(010|011|012|015)/.test(mobile)) return t("mobilePrefixError");
      return "";
    },
    [t]
  );

  const validateMobileUniqueness = useCallback(
    (mobile) => {
      const existing = patients.find((p) => p.mobile === mobile);
      if (existing && (!id || existing.id !== parseInt(id))) {
        return t("mobileExists");
      }
      return "";
    },
    [patients, id, t]
  );

  useEffect(() => {
    const nameErr = validateName(name);
    const mobileErr = validateMobile(mobile);
    const existsErr = mobileErr ? "" : validateMobileUniqueness(mobile);

    setNameError(nameErr);
    setMobileError(mobileErr);
    setMobileExistsError(existsErr);
    setIsFormValid(!nameErr && !mobileErr && !existsErr);
  }, [name, mobile, validateName, validateMobile, validateMobileUniqueness]);

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
        value.startsWith("01") &&
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
          prev.map((p) =>
            p.id === parseInt(id) ? { ...p, name, mobile } : p
          )
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
      <h1>{id ? t("editPatient") : t("addNewPatient")}</h1>
      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-group">
          <label htmlFor="name">{t("patientName")}:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={handleNameChange}
            maxLength="30"
            required
            className="form-control"
          />
          {nameError && <p className="error-message">{nameError}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="mobile">{t("patientMobile")}:</label>
          <input
            type="text"
            id="mobile"
            value={mobile}
            onChange={handleMobileChange}
            required
            className="form-control"
          />
          {mobileError && <p className="error-message">{mobileError}</p>}
          {mobileExistsError && (
            <p className="error-message">{mobileExistsError}</p>
          )}
        </div>

        <button type="submit" disabled={!isFormValid} className="btn btn-primary">
          {id ? t("updatePatient") : t("addPatient")}
        </button>
      </form>
    </div>
  );
};

export default AddPatient;
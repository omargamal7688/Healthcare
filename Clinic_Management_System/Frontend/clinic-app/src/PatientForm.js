import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "./PatientForm.css";

const PatientForm = ({ fetchPatients }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const existingPatient = location.state?.patient || null;

  const [patient, setPatient] = useState({
    id: existingPatient?.id || null,
    name: existingPatient?.name || "",
    mobile: existingPatient?.mobile || "",
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (existingPatient) {
      setPatient(existingPatient);
    }
  }, [existingPatient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient({ ...patient, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!patient.name.trim() || !patient.mobile.trim()) {
      setErrorMessage("❌ يجب ملء جميع الحقول");
      showModal("errorModal");
      return;
    }

    axios
      .post("http://localhost:8080/api/patients/", patient)
      .then((response) => {
        if (response.status === 200) {
          setMessage(response.data.message);
          fetchPatients();
          showModal("successModal");
        }
      })
      .catch((error) => {
        setErrorMessage(error.response?.data?.message || "❌ حدث خطأ أثناء حفظ البيانات");
        showModal("errorModal");
      });
  };

  const showModal = (modalId) => {
    const modalElement = document.getElementById(modalId);
    const modal = new window.bootstrap.Modal(modalElement);

    if (modalId === "successModal") {
      modalElement.addEventListener("hidden.bs.modal", () => {
        navigate("/admin/patients");
      }, { once: true });
    }

    modal.show();
  };

  return (
    <div className="form-container" dir="rtl">
      <h2 className="form-title">{existingPatient ? "تعديل بيانات المريض" : "إضافة مريض جديد"}</h2>

      <form onSubmit={handleSubmit} className="patient-form">
        <div className="form-group">
          <label>الاسم:</label>
          <input type="text" name="name" value={patient.name} onChange={handleChange} className="form-input" required />
        </div>
        <div className="form-group">
          <label>رقم الهاتف:</label>
          <input type="text" name="mobile" value={patient.mobile} onChange={handleChange} className="form-input" required />
        </div>
        <button type="submit" className="submit-btn">{existingPatient ? "تحديث المريض" : "إضافة مريض"}</button>
      </form>

      {/* Success Modal */}
      <div className="modal fade" id="successModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">✅ نجاح</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">{message}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-success" data-bs-dismiss="modal">موافق</button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <div className="modal fade" id="errorModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">❌ خطأ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">{errorMessage}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default PatientForm;

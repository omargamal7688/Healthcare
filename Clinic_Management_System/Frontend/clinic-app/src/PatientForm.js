import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const PatientForm = ({ editingPatient, setEditingPatient }) => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Store validation or server error messages
  const navigate = useNavigate();

  useEffect(() => {
    if (editingPatient) {
      setName(editingPatient.name);
      setMobile(editingPatient.mobile);
    }
  }, [editingPatient]);

  const validateForm = () => {
    const nameParts = name.trim().split(" ");
    const mobilePattern = /^(010|011|012|015)\d{8}$/;

    if (nameParts.length < 2) {
      setErrorMessage("❌ الاسم يجب أن يحتوي على كلمتين على الأقل!");
      showModal();
      return false;
    }

    if (!mobilePattern.test(mobile)) {
      setErrorMessage("❌ رقم الهاتف يجب أن يبدأ بـ 010 أو 011 أو 012 أو 015 ويكون مكونًا من 11 رقمًا!");
      showModal();
      return false;
    }

    return true;
  };

  const savePatient = () => {
    if (!validateForm()) return;
  
    const patientData = { id: editingPatient?.id, name, mobile };
  
    axios.post("http://localhost:8080/api/patients", patientData)
      .then(() => {
        setEditingPatient(null);
        navigate("/admin/patients");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const serverMessage = error.response.data.message; // ✅ Get the message correctly
  
          if (serverMessage && serverMessage.includes("A patient with mobile")) {
            setErrorMessage("⚠️ رقم الهاتف مسجل بالفعل لمريض آخر!");
          } else {
            setErrorMessage("⚠️ حدث خطأ غير متوقع!");
          }
        } else { setErrorMessage("⚠️ فشل في إضافة المريض، تحقق من الاتصال بالخادم!");
          
        }
        showModal();
      });
  };
  

  // Function to show modal
  const showModal = () => {
    const modal = new window.bootstrap.Modal(document.getElementById("errorModal"));
    modal.show();
  };

  return (
    
    <div className="container mt-4">
    <br></br>
    <br></br>
      <h2>{editingPatient ? "تعديل بيانات المريض" : "إضافة مريض جديد"}</h2>

      <input
        type="text"
        placeholder="الاسم الثلاثي"
        className="form-control mb-2 w-50"
        value={name}
        onChange={(e) => setName(e.target.value)}
        maxLength="30" 
      />

<input
  type="text"
  placeholder="الموبايل"
  className="form-control mb-2 w-50"
  value={mobile}
  onChange={(e) => setMobile(e.target.value)}
  maxLength="11" // Ensures input length does not exceed 11 characters
/>


      <button className="btn btn-success me-2" onClick={savePatient}>
        {editingPatient ? "تحديث" : "إضافة"}
      </button>
      <button className="btn btn-secondary" onClick={() => navigate("/admin/patients")}>
        إلغاء
      </button>

      {/* Bootstrap Modal for Validation & Server Errors */}
      <div className="modal fade" id="errorModal" tabIndex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="errorModalLabel">خطأ</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {errorMessage}
            </div>
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

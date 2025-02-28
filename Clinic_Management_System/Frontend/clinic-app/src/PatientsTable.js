import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PatientsTable = ({ setEditingPatient }) => {
  const [patients, setPatients] = useState([]);
  const [searchMobile, setSearchMobile] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get("http://localhost:8080/api/patients")
      .then((response) => setPatients(response.data))
      .catch(() => setError("خطأ في جلب البيانات"));
  };

  const deletePatient = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المريض؟")) {
      axios.delete(`http://localhost:8080/api/patients/${id}`)
        .then(() => {
          setPatients(patients.filter((p) => p.id !== id));
          setMessage("تم حذف المريض بنجاح");
        })
        .catch(() => setError("فشل في حذف المريض"));
    }
  };

  const editPatient = (patient) => {
    setEditingPatient(patient);
    navigate("/patient-form");
  };

  const searchPatient = (e) => {
    e.preventDefault();
    axios.get(`http://localhost:8080/api/patients/search?mobile=${searchMobile}`)
      .then((response) => setPatients(response.data))
      .catch(() => setError("لم يتم العثور على المريض"));
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h1 className="mt-4 text-end">قائمة المرضى</h1>

      {/* Success & Error Messages */}
      {message && <div className="alert alert-success text-end">{message}</div>}
      {error && <div className="alert alert-danger text-end">{error}</div>}

      {/* Search Form - Moved to Right */}
      <form onSubmit={searchPatient} className="row g-3 mb-4 ">
        
        <div className="col-md-4">
          <input
            type="text"
            placeholder="ابحث برقم الهاتف"
            className="form-control text-end"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
          />
        </div><div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">بحث</button>
        </div>
      </form>

      {/* Patients Table - Fully RTL */}
      <div className="table-responsive">
        <table className="table table-striped mt-3 text-end">
          <thead className="table-dark">
            <tr>
              <th className="text-end">الرقم</th>
              <th className="text-end">الاسم</th>
              <th className="text-end">رقم الهاتف</th>
              <th className="text-end">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td className="text-end">{patient.id}</td>
                <td className="text-end">{patient.name}</td>
                <td className="text-end">{patient.mobile}</td>
                <td className="text-end">
                  <button className="btn btn-primary btn-sm ms-2" onClick={() => editPatient(patient)}>تعديل</button>
                  <button className="btn btn-danger btn-sm ms-2" onClick={() => deletePatient(patient.id)}>حذف</button>
                  <button className="btn btn-secondary btn-sm">الملف الشخصي</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    
<div className="d-flex justify-content-end mt-2">
  <button className="btn btn-primary" onClick={() => navigate("/patient-form")}>
    إضافة مريض جديد
  </button>
</div>


    </div>
  );
};

export default PatientsTable;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const PatientsTable = ({ setEditingPatient }) => {
  const [patients, setPatients] = useState([]);
  const [searchMobile, setSearchMobile] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Error message for modal
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get("http://localhost:8080/api/patients")
      .then((response) => setPatients(response.data))
      .catch(() => {
        setError("خطأ في جلب البيانات");
        showModal();
      });
  };

  const deletePatient = (id) => {
    if (window.confirm("هل أنت متأكد من حذف هذا المريض؟")) {
      axios.delete(`http://localhost:8080/api/patients/${id}`)
        .then(() => {
          setPatients(patients.filter((p) => p.id !== id));
          setMessage("تم حذف المريض بنجاح");
        })
        .catch(() => {
          setError("فشل في حذف المريض");
          showModal();
        });
    }
  };

  const editPatient = (patient) => {
    setEditingPatient(patient);
    navigate("/patient-form");
  };

  const searchPatient = (e) => {
    e.preventDefault();

    // Validate mobile input
    if (!searchMobile) {
        setError("يجب إدخال رقم الهاتف للبحث");
        showModal();
        return;
    }
    if (!/^(010|011|012|015)\d{8}$/.test(searchMobile)) {
        setError("يجب أن يبدأ الرقم بـ 010 أو 011 أو 012 أو 015 وأن يتكون من 11 رقمًا");
        showModal();
        return;
    }

    axios.get(`http://localhost:8080/api/patients/search?mobile=${searchMobile}`)
        .then((response) => {
            if (response.data.length === 0) {
                setError("لم يتم العثور على المريض");
                showModal();
            } else {
                setPatients(response.data);
            }
        })
        .catch((error) => {
            if (error.message.includes("Network Error") || error.code === "ECONNREFUSED") {
                setError("تأكد من الاتصال بالخادم");
            } else {
                setError("حدث خطأ أثناء البحث");
            }
            showModal();
        });
};



  // Function to show the Bootstrap modal
  const showModal = () => {
    const modal = new window.bootstrap.Modal(document.getElementById("errorModal"));
    modal.show();
  };

  return (
    <div className="container mt-4" dir="rtl">
      <br />
      <br />
      <h1 className="mt-4 text-end">قائمة المرضى</h1>

      {/* Success Message */}
      {message && <div className="alert alert-success text-end">{message}</div>}

      {/* Search Form */}
      <form onSubmit={searchPatient} className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            placeholder="ابحث برقم الهاتف"
            className="form-control text-end"
            value={searchMobile}
            onChange={(e) => setSearchMobile(e.target.value)}
            maxLength={11}
          />
        </div>
        <div className="col-md-2">
          <button type="submit" className="btn btn-primary w-100">بحث</button>
        </div>
      </form>

      {/* Patients Table */}
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
                  <Link to={`/profile/${patient.id}`} className="btn btn-primary">الملف الشخصي</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add New Patient Button */}
      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-primary" onClick={() => navigate("/patient-form")}>
          إضافة مريض جديد
        </button>
      </div>

      {/* Bootstrap Modal for Error Handling */}
      <div className="modal fade" id="errorModal" tabIndex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="errorModalLabel">خطأ</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">{error}</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إغلاق</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsTable;

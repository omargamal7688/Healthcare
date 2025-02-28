import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const PatientsTable = ({ setEditingPatient }) => {
  const [patients, setPatients] = useState([]);
  const [searchMobile, setSearchMobile] = useState("");
  const [message, setMessage] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [searchError, setSearchError] = useState("");
  const [deletePatientId, setDeletePatientId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    axios.get("http://localhost:8080/api/patients")
      .then((response) => setPatients(response.data))
      .catch(() => {
        setFetchError("تاكد من الاتصال بالخادم");
      });
  };

  const confirmDelete = (id) => {
    setDeletePatientId(id);
    const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
  };

  const deletePatient = () => {
    if (deletePatientId) {
      axios.delete(`http://localhost:8080/api/patients/${deletePatientId}`)
        .then(() => {
          setPatients(patients.filter((p) => p.id !== deletePatientId));
          setMessage("تم حذف المريض بنجاح");
        })
        .catch(() => {
          setSearchError("فشل في حذف المريض");
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
    if (!searchMobile) {
        setSearchError("يجب إدخال رقم الهاتف للبحث");
        showModal();
        return;
    }
    if (!/^(010|011|012|015)\d{8}$/.test(searchMobile)) {
        setSearchError("يجب أن يبدأ الرقم بـ 010 أو 011 أو 012 أو 015 وأن يتكون من 11 رقمًا");
        showModal();
        return;
    }
    axios.get(`http://localhost:8080/api/patients/search?mobile=${searchMobile}`)
        .then((response) => {
            if (response.data.length === 0) {
                setSearchError("لم يتم العثور على المريض");
                showModal();
            } else {
                setPatients(response.data);
            }
        })
        .catch(() => {
            setSearchError("حدث خطأ أثناء البحث");
            showModal();
        });
  };

  const showModal = () => {
    const modal = new window.bootstrap.Modal(document.getElementById("errorModal"));
    modal.show();
  };

  return (
    <div className="container mt-4" dir="rtl">
      <br />
      <br />
      <h1 className="mt-4 text-end">قائمة المرضى</h1>

     

      {fetchError && <div className="alert alert-danger text-end">{fetchError}</div>}
      {message && <div className="alert alert-success text-end">{message}</div>}

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
            {patients.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">لا يوجد أي مريض</td>
              </tr>
            ) : (
              patients.map((patient) => (
                <tr key={patient.id}>
                  <td className="text-end">{patient.id}</td>
                  <td className="text-end">{patient.name}</td>
                  <td className="text-end">{patient.mobile}</td>
                  <td className="text-end">
                    <button className="btn btn-primary btn-sm ms-2" onClick={() => editPatient(patient)}>تعديل</button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => confirmDelete(patient.id)}>حذف</button>
                    <Link to={`/profile/${patient.id}`} className="btn btn-primary">الملف الشخصي</Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <br></br>
        <button className="btn btn-success mb-3" onClick={() => navigate("/patient-form")}>
        أضف مريض جديد
      </button>
      </div>

      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="deleteModalLabel">تأكيد الحذف</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">هل أنت متأكد من حذف هذا المريض؟</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
              <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={deletePatient}>حذف</button>
            </div>
          </div>
        </div>
      </div>

      <div className="modal fade" id="errorModal" tabIndex="-1" aria-labelledby="errorModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="errorModalLabel">خطأ</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">{searchError}</div>
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

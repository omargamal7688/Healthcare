import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
const PatientsTable = ({ patients, setPatients, loading, error }) => {
  const [deletePatientId, setDeletePatientId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [errorMessage, setErrorMessage] = useState("");

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const confirmDelete = (id) => {
    setDeletePatientId(id);
    const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
  };

  const deletePatient = () => {
    axios.delete(`http://localhost:8080/api/patients/${deletePatientId}`)
      .then((response) => {
        if (response.status === 200) {
          setPatients((prevPatients) => prevPatients.filter((patient) => patient.id !== deletePatientId));
        } else {
          setErrorMessage("❌ حدث خطأ أثناء حذف المريض. يرجى المحاولة مرة أخرى.");
          const errorModal = new window.bootstrap.Modal(document.getElementById("errorModal"));
          errorModal.show();
        }
      })
      .catch(() => {
        setErrorMessage("❌ حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
        const errorModal = new window.bootstrap.Modal(document.getElementById("errorModal"));
        errorModal.show();
      });
  };

  if (loading) return <p className="text-center">⌛ جاري تحميل قائمة المرضى...</p>;

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(patients.length / patientsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mt-4" dir="rtl">
      <h2 className="text-end">قائمة المرضى</h2>

      {/* Display error message if there is an error */}
      {errorMessage && (
        <div className="alert alert-danger text-center mt-3">{errorMessage}</div>
      )}

      <table className="table table-striped text-end">
        <thead className="table-dark">
          <tr>
            <th>الرقم</th>
            <th>الاسم</th>
            <th>رقم الهاتف</th>
            <th>الإجراءات</th>
          </tr>
        </thead>
        <tbody>
          {currentPatients.length === 0 ? (
            <tr><td colSpan="4" className="text-center">لا يوجد مرضى مسجلين.</td></tr>
          ) : (
            currentPatients.map((patient) => (
              <tr key={patient.id}>
                <td>{patient.id}</td>
                <td>{patient.name}</td>
                <td>{patient.mobile}</td>
                <td>
                  <Link to={`/profile/${patient.id}`} className="btn btn-primary btn-sm">عرض</Link>
                  <Link to="/patient-form" state={{ patient }} className="btn btn-warning btn-sm mx-2">تعديل</Link>
                  <button className="btn btn-danger btn-sm" onClick={() => confirmDelete(patient.id)}>حذف</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination justify-content-center">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`btn ${currentPage === number ? 'btn-primary' : 'btn-secondary'} mx-1`}
          >
            {number}
          </button>
        ))}
      </div>

      <Link to="/patient-form" state={{ patient: null }} className="btn btn-success">إضافة مريض جديد</Link>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">تأكيد الحذف</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              هل أنت متأكد من إزالة المريض وجميع حجوزاته؟
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">إلغاء</button>
              <button type="button" className="btn btn-danger" onClick={deletePatient} data-bs-dismiss="modal">حذف</button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <div className="modal fade" id="errorModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">خطأ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
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

export default PatientsTable;

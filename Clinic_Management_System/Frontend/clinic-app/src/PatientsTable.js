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
  const [currentPage, setCurrentPage] = useState(1);
  const patientsPerPage = 7;
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
          setCurrentPage(1);
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

  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  return (
    <div className="container mt-4" dir="rtl">
      <br>
      </br>
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
            {currentPatients.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center">لا يوجد أي مريض</td>
              </tr>
            ) : (
              currentPatients.map((patient) => (
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

        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>السابق</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
              </li>
            ))}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>التالي</button>
            </li>
          </ul>
        </nav>

        <button className="btn btn-success mb-3" onClick={() => navigate("/patient-form")}>
          أضف مريض جديد
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">تأكيد الحذف</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              هل أنت متأكد من أنك تريد حذف هذا المريض؟
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
            <div className="modal-body">{searchError}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsTable;

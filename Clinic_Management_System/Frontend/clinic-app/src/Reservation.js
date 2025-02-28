import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    axios.get("http://localhost:8080/api/reservations/")
      .then((response) => setReservations(response.data))
      .catch(() => {
        setError("خطأ في جلب البيانات");
        showModal();
      });
  };

  const showModal = () => {
    const modal = new window.bootstrap.Modal(document.getElementById("errorModal"));
    modal.show();
  };

  return (
    <div className="container mt-4" dir="rtl">
        <br>
        </br>
        <br></br>
      <h1 className="mt-4 text-end">قائمة الحجوزات</h1>

      {error && <div className="alert alert-danger text-end">{error}</div>}

      <div className="table-responsive">
        <table className="table table-striped mt-3 text-end">
          <thead className="table-dark">
            <tr>
              <th className="text-end">الدور</th>
              <th className="text-end">تاريخ الحجز</th>
              <th className="text-end">اليوم</th>
              <th className="text-end">اسم العيادة</th>
              <th className="text-end">النوع</th>
              <th className="text-end">الاجراءات</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.turn}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.dayOfWeek}</td> 
                  <td>{reservation.clinicName}</td> 
                  <td>{reservation.type}</td>
                  <td>
                    <button className="btn btn-primary btn-sm ms-2">تعديل</button>
                    <button className="btn btn-danger btn-sm ms-2">حذف</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">لا توجد حجوزات متاحة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-end mt-2">
        <button className="btn btn-primary" onClick={() => navigate("/add-reservation")}>
          إضافة حجز جديد
        </button>
      </div>

      {/* Bootstrap Modal for Errors */}
      <div className="modal fade" id="errorModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">خطأ</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">{error}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;

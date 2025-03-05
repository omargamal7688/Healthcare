import React, { useState } from "react";
import axios from "axios";

const Reservation = ({ reservations, setReservations, fetchReservations }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [selectedCancelId, setSelectedCancelId] = useState(null);

  const deleteReservation = () => {
    if (selectedId) {
      axios
        .delete(`http://localhost:8080/api/reservations/${selectedId}`)
        .then(() => {
          fetchReservations();
        })
        .catch(() => {
          alert("حدث خطأ أثناء حذف الحجز، تأكد من الاتصال بالخادم.");
        })
        .finally(() => {
          closeDeleteModal();
        });
    }
  };

  const confirmCancelReservation = () => {
    if (selectedCancelId) {
      axios
        .put(`http://localhost:8080/api/reservations/${selectedCancelId}/cancel`)
        .then(() => {
          fetchReservations();
        })
        .catch(() => {
          alert("حدث خطأ أثناء إلغاء الحجز، تأكد من الاتصال بالخادم.");
        })
        .finally(() => {
          closeCancelModal();
        });
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    new window.bootstrap.Modal(document.getElementById("deleteModal")).show();
  };

  const closeDeleteModal = () => {
    setSelectedId(null);
    const modal = window.bootstrap.Modal.getInstance(document.getElementById("deleteModal"));
    if (modal) modal.hide();
  };

  const openCancelModal = (id) => {
    setSelectedCancelId(id);
    new window.bootstrap.Modal(document.getElementById("cancelModal")).show();
  };

  const closeCancelModal = () => {
    setSelectedCancelId(null);
    const modal = window.bootstrap.Modal.getInstance(document.getElementById("cancelModal"));
    if (modal) modal.hide();
  };

  return (
    <div className="container mt-4" dir="rtl">
      <h1 className="mt-4 text-end">قائمة الحجوزات</h1>

      <div className="table-responsive">
        <table className="table table-striped mt-3 text-end">
          <thead className="table-dark">
            <tr>
              <th>الدور</th>
              <th>تاريخ الحجز</th>
              <th>اليوم</th>
              <th>اسم العيادة</th>
              <th>حالة الحجز</th>
              <th>الانتظار</th>
              <th>النوع</th>
              <th>الإجراءات</th>
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
                  <td>{reservation.cancelled ? "ملغي" : "نشط"}</td>
                  <td>{reservation.success ? "تم الدخول" : "قيد الانتظار"}</td>
                  <td>{reservation.type}</td>
                  <td>
                    <button className="btn btn-primary btn-sm ms-2">تعديل</button>
                    <button className="btn btn-danger btn-sm ms-2" onClick={() => openDeleteModal(reservation.id)}>
                      حذف
                    </button>
                    <button className="btn btn-warning btn-sm ms-2" onClick={() => openCancelModal(reservation.id)}>
                      إلغاء الحجز
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">لا توجد حجوزات متاحة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">تأكيد الحذف</h5>
              <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
            </div>
            <div className="modal-body">هل أنت متأكد أنك تريد حذف هذا الحجز؟</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>
                إلغاء
              </button>
              <button type="button" className="btn btn-danger" onClick={deleteReservation}>
                حذف
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirmation Modal */}
      <div className="modal fade" id="cancelModal" tabIndex="-1" aria-labelledby="cancelModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="cancelModalLabel">تأكيد إلغاء الحجز</h5>
              <button type="button" className="btn-close" onClick={closeCancelModal}></button>
            </div>
            <div className="modal-body">هل أنت متأكد أنك تريد إلغاء هذا الحجز؟</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeCancelModal}>
                إلغاء
              </button>
              <button type="button" className="btn btn-warning" onClick={confirmCancelReservation}>
                إلغاء الحجز
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation;

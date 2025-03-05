import React, { useState, useEffect } from "react";
import axios from "axios";

const ReservationCancelled = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState("");
  const [selectedId, setSelectedId] = useState(null); // Store reservation ID for deletion

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = () => {
    axios.get("http://localhost:8080/api/reservations/cancel")
      .then((response) => setReservations(response.data))
      .catch(() => {
        setError("تأكد من الاتصال بالخادم");
      });
  };

  const deleteReservation = () => {
    if (selectedId) {
      axios.delete(`http://localhost:8080/api/reservations/${selectedId}`)
        .then(() => {
          fetchReservations(); // Refresh list after deletion
        })
        .catch(() => {
          alert("حدث خطأ أثناء حذف الحجز، تأكد من الاتصال بالخادم.");
        })
        .finally(() => {
          closeDeleteModal();
        });
    }
  };

  const cancelReservation = (id) => {
    axios.put(`http://localhost:8080/api/reservations/${id}/active`)
      .then(() => {
        fetchReservations(); // Refresh list after cancellation
      })
      .catch(() => {
        alert("حدث خطأ أثناء تفعيل الحجز، تأكد من الاتصال بالخادم.");
      });
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    const modal = new window.bootstrap.Modal(document.getElementById("deleteModal"));
    modal.show();
  };

  const closeDeleteModal = () => {
    setSelectedId(null);
    const modalElement = document.getElementById("deleteModal");
    const modal = window.bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();
  };

  return (
    <div className="container mt-4" dir="rtl">
      <br />
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
              <th className="text-end"> حالة الحجز</th>
              <th className="text-end">النوع</th>
              <th className="text-end">الإجراءات</th>
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
                  <td>{reservation.type}</td>
                  <td>
                    <button className="btn btn-primary btn-sm ms-2">تعديل</button>
                    <button 
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => openDeleteModal(reservation.id)}
                    >
                      حذف
                    </button>
                    <button 
                      className="btn btn-danger btn-sm ms-2"
                      onClick={() => cancelReservation(reservation.id)} 
                      
                    >
                      تفعيل الحجز 
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center">لا توجد حجوزات متاحة</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Bootstrap Delete Confirmation Modal */}
      <div className="modal fade" id="deleteModal" tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="deleteModalLabel">تأكيد الحذف</h5>
              <button type="button" className="btn-close" onClick={closeDeleteModal}></button>
            </div>
            <div className="modal-body">
              هل أنت متأكد أنك تريد حذف هذا الحجز؟
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeDeleteModal}>إلغاء</button>
              <button type="button" className="btn btn-danger" onClick={deleteReservation}>حذف</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ReservationCancelled;

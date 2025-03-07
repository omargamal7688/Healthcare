import React, { useState } from "react";

const ReservationSuccess = ({ reservations2 }) => {
  const [selectedId, setSelectedId] = useState(null);

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
      <h1 className="mt-4 text-end">قائمة الحجوزات الناجحة</h1>

      <div className="table-responsive">
        <table className="table table-striped mt-3 text-end">
          <thead className="table-dark">
            <tr>
              <th className="text-end">الدور</th>
              <th className="text-end">تاريخ الحجز</th>
              <th className="text-end">اليوم</th>
              <th className="text-end">اسم العيادة</th>
              <th className="text-end">النوع</th>
              <th className="text-end">الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {reservations2 && reservations2.length > 0 ? (
              reservations2.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.turn}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.dayOfWeek}</td>
                  <td>{reservation.clinicName}</td>
                  <td>{reservation.type}</td>
                  <td>
                    <button className="btn btn-danger btn-sm ms-2"
                      onClick={() => openDeleteModal(reservation.id)}>
                      حذف
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">لا توجد حجوزات ناجحة</td>
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
              <button type="button" className="btn btn-danger">حذف</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationSuccess;

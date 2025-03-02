import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./reservationForm.css";
const ReservationForm = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation

  const patientName = location.state?.patientName || "";
  const patientId = location.state?.patientId || null;

  const [date, setDate] = useState(null);
  const [turn, setTurn] = useState(null);
  const [clinicName, setClinicName] = useState("");
  const [type, setType] = useState("كشف");
  const [reservedTurns, setReservedTurns] = useState([]);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const totalChairs = 30;

  useEffect(() => {
    if (date) {
      fetchReservedTurns(date);
    }
  }, [date]);

  const fetchReservedTurns = async (selectedDate) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reservations/reserved-turns?date=${selectedDate}`
      );
      const data = await response.json();
      setReservedTurns(data);
    } catch (error) {
      console.error("Error fetching reserved turns:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!turn) {
      showModal("يرجى اختيار الدور.", false);
      return;
    }

    if (!patientId) {
      showModal("حدث خطأ: لم يتم تحديد المريض.", false);
      return;
    }

    const reservationData = {
      date,
      turn,
      clinicName,
      type,
      patient: {
        id: patientId,
      },
    };

    console.log("Submitting Reservation:", reservationData);

    try {
      const response = await fetch("http://localhost:8080/api/reservations/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(reservationData),
      });

      const text = await response.text();
      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = text;
      }

      if (!response.ok) {
        throw new Error(result.message || result || "حدث خطأ أثناء الحجز.");
      }

      showModal(result.message || "تم الحجز بنجاح!", true);
    } catch (error) {
      console.error("Error creating reservation:", error);
      showModal(error.message, false);
    }
  };

  const showModal = (message, success) => {
    setModalMessage(message);
    setIsSuccess(success);
    new window.bootstrap.Modal(document.getElementById("responseModal")).show();
  };

  const handleCloseModal = () => {
    // Navigate to the reservations table page when closing the modal
    navigate("/admin/reservations");
  };

  return (
    <div className="container mt-5">
      <h1>إضافة حجز جديد</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>اسم المريض</label>
          <input type="text" className="form-control" value={patientName} readOnly />
        </div>

        <div className="mb-3">
          <label htmlFor="date">تاريخ الحجز</label>
          <DatePicker
            id="date"
            selected={date}
            onChange={(selectedDate) =>
              setDate(selectedDate?.toISOString().split("T")[0])
            }
            dateFormat="yyyy-MM-dd"
            className="form-control"
            minDate={new Date()}
            filterDate={(date) => date.getDay() !== 5}
            placeholderText="اختر تاريخ الحجز"
          />
        </div>

        <div className="mb-3">
          <label>اختر الدور</label>
          <div className="d-flex flex-wrap gap-2" id="chairs-container">
            {Array.from({ length: totalChairs }, (_, i) => i + 1).map((num) => (
              <div
                key={num}
                className={`chair ${turn === num ? "selected" : ""} ${
                  reservedTurns.includes(num) ? "disabled" : ""
                }`}
                onClick={() => !reservedTurns.includes(num) && setTurn(num)}
              >
                {num}
              </div>
            ))}
          </div>
          <input type="hidden" name="turn" value={turn || ""} />
        </div>

        <div className="mb-3">
          <label htmlFor="clinicName">اسم العيادة</label>
          <input
            type="text"
            id="clinicName"
            name="clinicName"
            className="form-control"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="type">النوع</label>
          <select
            id="type"
            name="type"
            className="form-select"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="كشف">كشف</option>
            <option value="استشارة">استشارة</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          إضافة حجز
        </button>
      </form>

      {/* Bootstrap Modal for Success/Error Messages */}
      <div className="modal fade" id="responseModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog">
          <div className={`modal-content ${isSuccess ? "text-success" : "text-danger"}`}>
            <div className="modal-header">
              <h5 className="modal-title">{isSuccess ? "نجاح" : "خطأ"}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal} // Navigate when closing modal
              ></button>
            </div>
            <div className="modal-body">
              {modalMessage}
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                إغلاق
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;

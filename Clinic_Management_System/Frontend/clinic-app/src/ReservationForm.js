import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReservationForm = () => {
  const location = useLocation();
  const patientName = location.state?.patientName || ""; // Get patient name from state
  const patientId = location.state?.patientId || ""; // Get patient name from state

  const [date, setDate] = useState(null);
  const [turn, setTurn] = useState(null);
  const [clinicName, setClinicName] = useState("");
  const [type, setType] = useState("كشف");
  const [reservedTurns, setReservedTurns] = useState([]);
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
      alert("يرجى اختيار الدور.");
      return;
    }
  
    if (!patientId) {
      alert("حدث خطأ: لم يتم تحديد المريض.");
      return;
    }
  
    const reservationData = {
      date,
      turn,
      clinicName,
      type,
      patient: {
        id: patientId, // Ensure patientId is correctly set
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
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "حدث خطأ أثناء الحجز.");
      }
  
      const result = await response.json();
      console.log("Reservation created:", result);
      alert("تم الحجز بنجاح!");
    } catch (error) {
      console.error("Error creating reservation:", error);
      alert(error.message);
    }
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
          <label>اسم Id</label>
          <input type="text" className="form-control" value={patientId} readOnly />
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
            filterDate={(date) => date.getDay() !== 5} // Disable Fridays
            placeholderText="اختر تاريخ الحجز"
          />
        </div>

        <div className="mb-3">
          <label>اختر الدور</label>
          <div className="d-flex flex-wrap gap-2" id="chairs-container">
            {Array.from({ length: totalChairs }, (_, i) => i + 1).map(
              (num) => (
                <div
                  key={num}
                  className={`chair ${
                    turn === num ? "selected" : ""
                  } ${reservedTurns.includes(num) ? "disabled" : ""}`}
                  onClick={() =>
                    !reservedTurns.includes(num) && setTurn(num)
                  }
                >
                  {num}
                </div>
              )
            )}
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
    </div>
  );
};

export default ReservationForm;

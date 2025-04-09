import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/AddAppointmentPage.css";


const AddAppointment = ({ patients, appointments, setAppointments }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const patientIdFromProfile = new URLSearchParams(location.search).get("patientId");
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState(patientIdFromProfile || "");
  const [date, setDate] = useState(new Date());
  const [turn, setTurn] = useState("");
  const [type, setType] = useState("كشف");
  const [clinicName, setClinicName] = useState("مطرية");
  const [error, setError] = useState("");
  const turns = Array.from({ length: 30 }, (_, i) => i + 1);
  const [reservedTurns, setReservedTurns] = useState([]);
  const [hasAppointmentOnDate, setHasAppointmentOnDate] = useState(false);

  useEffect(() => {
    if (patientIdFromProfile) {
      const patient = patients.find((p) => p.id === parseInt(patientIdFromProfile));
      if (patient) {
        setPatientName(patient.name);
        setPatientId(patient.id);
      } else {
        setError("Patient not found.");
      }
    }
  }, [patientIdFromProfile, patients]);

  useEffect(() => {
    // Update reserved turns and check if patient has an appointment on the selected date
    const formattedDate = date.toLocaleDateString();
    const appointmentsOnSelectedDate = appointments.filter(
      (appt) => appt.date === formattedDate && appt.clinicName === clinicName
    );
    const reservedTurnNumbers = appointmentsOnSelectedDate.map((appt) => appt.turn);
    setReservedTurns(reservedTurnNumbers);

    const patientHasAppointment = appointmentsOnSelectedDate.some(
      (appt) => appt.patientId === parseInt(patientId)
    );
    setHasAppointmentOnDate(patientHasAppointment);
  }, [date, appointments, clinicName, patientId]);

  const handleTurnSelect = (selectedTurn) => {
    if (!reservedTurns.includes(selectedTurn)) {
      setTurn(selectedTurn.toString());
    } else {
      alert(`Turn ${selectedTurn} is already reserved for this date and clinic.`);
      setTurn("");
    }
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    setTurn("");
  };

  const handleClinicChange = (e) => {
    setClinicName(e.target.value);
    setTurn("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!patientId || !date || !turn || !type || !clinicName) {
      setError("Please fill in all fields.");
      return;
    }

    if (hasAppointmentOnDate) {
      alert("This patient already has an appointment on the selected date.");
      return;
    }

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const formattedDate = date.toLocaleDateString();

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayIndex = date.getDay();
    const dayOfWeek = daysOfWeek[dayIndex];

    const newAppointment = {
      id: appointments.length + 1,
      patientId: parseInt(patientId),
      date: formattedDate,
      time: turn,
      type: type,
      clinicName: clinicName,
      status: "Pending",
      patientName: patientName,
      dayOfWeek: dayOfWeek,
      turn: parseInt(turn),
    };

    setAppointments([...appointments, newAppointment]);
    navigate(`/patients/${patientId}`);
  };

  const handleCancel = () => {
    navigate(`/patients/${patientId}`);
  };

  // Custom input component
  const CustomDateInput = React.forwardRef(({ value, onClick }, ref) => (
    <input
      ref={ref}
      value={value}
      onClick={onClick}
      readOnly
      className="custom-date-input"
    />
  ));

  return (
    <div className="add-appointment-page">
      <h2>Add New Appointment</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="patientName">Patient Name:</label>
          <input
            type="text"
            id="patientName"
            value={patientName}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="patientId">Patient ID:</label>
          <input
            type="text"
            id="patientId"
            value={patientId}
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date:</label>
          <DatePicker
            id="date"
            selected={date}
            onChange={handleDateChange}
            dateFormat="yyyy-MM-dd"
            customInput={<CustomDateInput />}
          />
        </div>
        <div className="form-group">
          <label htmlFor="turn">Turn:</label>
          <div className="turn-selection">
            {turns.map((t) => (
              <div
                key={t}
                className={`turn-chair ${turn === t.toString() ? 'selected' : ''} ${
                  reservedTurns.includes(t) ? 'reserved' : ''
                }`}
                onClick={() => handleTurnSelect(t)}
              >
                {t}
              </div>
            ))}
          </div>
          {turn && <p className="selected-turn">Selected Turn: {turn}</p>}
          {!turn && <p className="select-turn-message">Select a turn (1-30)</p>}
          {hasAppointmentOnDate && (
            <p className="error-message">This patient already has an appointment on this date.</p>
          )}
        </div>
        <div className="form-group">
          <label htmlFor="type">Type:</label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="كشف">كشف</option>
            <option value="استشارة">استشارة</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="clinicName">Clinic:</label>
          <select
            id="clinicName"
            value={clinicName}
            onChange={handleClinicChange}
          >
            <option value="مطرية">مطرية</option>
            <option value="مصرالجديدة">مصرالجديدة</option>
          </select>
        </div>
        <div className="form-actions">
          <button type="submit" disabled={!turn || hasAppointmentOnDate}>
            Save Appointment
          </button>
          <button type="button" onClick={handleCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default AddAppointment;
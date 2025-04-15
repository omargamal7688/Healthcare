import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/AddAppointmentPage.css"; // Import CSS for styling
import { Modal, Button } from "react-bootstrap"; // Import Bootstrap Modal components

const AddAppoiment = ({ patients, appointments, setAppointments }) => {
  const [turn, setTurn] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState("كشف");
  const [clinicName, setClinicName] = useState("مطرية");
  const [patientId, setPatientId] = useState(null); // State for selected patient
  const [showError, setShowError] = useState(false); // State to control modal visibility
  const [errorMessage, setErrorMessage] = useState(""); // To store error message
  const [cost, setCost] = useState(0); // State to hold the calculated cost
  const navigate = useNavigate();
  const { id } = useParams(); // Get the patientId from the route

  // UseEffect to set patientId when the component mounts or route changes
  useEffect(() => {
    setPatientId(Number(id)); // Set patientId from route
  }, [id]);

  // Function to check if the patient already has an appointment on the selected date
  const validateAppointment = (patientId, date) => {
    const existingAppointment = appointments.find(
      (appointment) => appointment.patientId === patientId && appointment.date === date
    );
    return existingAppointment;
  };

  // Function to calculate the cost based on the appointment type
  const calculatePrice = (appointmentType) => {
    if (appointmentType === "كشف") {
      return 200; // Fixed cost for "كشف"
    }
    return 0; // Default cost for other types (if needed)
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!patientId) {
      setErrorMessage("Please select a patient.");
      setShowError(true);
      return;
    }

    if (validateAppointment(patientId, date)) {
      // If the patient already has an appointment, show error message
      setErrorMessage("Patient already has an appointment on this date.");
      setShowError(true); // Show the modal
    } else {
      // If no conflict, proceed to add the appointment
      const newAppointment = {
        id: appointments.length + 1,
        turn,
        date,
        clinicName,
        type,
        patientId,
        patientName: patients.find((patient) => patient.id === patientId)?.name || "Unknown", // Fetching patient name by ID
        dayOfWeek: new Date(date).toLocaleString("en-us", { weekday: "long" }),
        cost, // Include the calculated cost
        cancelled: false,
        success: false,
      };

      setAppointments([...appointments, newAppointment]);
      navigate("/appointments"); // Redirect to appointments page
    }
  };

  // Update the cost when the appointment type changes
  useEffect(() => {
    const calculatedCost = calculatePrice(type);
    setCost(calculatedCost); // Update the cost state
  }, [type]); // Recalculate price whenever type changes

  // Find the patient by ID (if available)
  const patient = patients.find((p) => p.id === patientId);

  return (
    <div className="add-appointment-container">
      <h1>Add New Appointment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient Name</label>
          {/* Display the patient name if patientId is set */}
          <input
            type="text"
            value={patient ? patient.name : "Loading..."}
            readOnly
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            className="form-control"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Turn</label>
          <div className="chairs-container">
            {[...Array(30).keys()].map((num) => (
              <button
                key={num}
                type="button"
                className={`chair-button ${turn === num + 1 ? "selected" : ""}`}
                onClick={() => setTurn(num + 1)}
              >
                {num + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Appointment Type</label>
          <select
            className="form-control"
            onChange={(e) => setType(e.target.value)}
            value={type}
            required
          >
            <option value="كشف">كشف</option>
            <option value="استشارة">استشارة</option>
          </select>
        </div>

        <div className="form-group">
          <label>Clinic</label>
          <select
            className="form-control"
            onChange={(e) => setClinicName(e.target.value)}
            value={clinicName}
            required
          >
            <option value="مطرية">مطرية</option>
            <option value="مصر الجديدة">مصر الجديدة</option>
          </select>
        </div>

        {/* Display the calculated cost */}
        <div className="form-group">
          <label>Appointment Cost</label>
          <input
            type="text"
            className="form-control"
            value={cost} // Display the cost dynamically
            readOnly
          />
        </div>

        <button type="submit" className="btn btn-primary">Add Appointment</button>
      </form>

      {/* Bootstrap Modal for Error Message */}
      <Modal show={showError} onHide={() => setShowError(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowError(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddAppoiment;

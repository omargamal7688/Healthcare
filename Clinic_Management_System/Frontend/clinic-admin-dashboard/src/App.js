import React, { useState, createContext, useContext, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Profile from "./pages/Profile";
import Appointments from "./pages/Appointments";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import "./App.css";
import AddPatient from "./pages/AddPatient";
import Payments from "./pages/Payments";
import { NotificationProvider } from "./components/NotificationContext";
import { useTranslation } from "react-i18next";
import AddAppointment from "./pages/AddAppoiment";
import axios from "axios";

// ✅ Role Context
const RoleContext = createContext();
export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState("");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
};
export const useRole = () => useContext(RoleContext);

const App = () => {
  const { role, setRole } = useRole();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  // ✅ Update direction based on language
  useEffect(() => {
    if (i18n.language === "ar") {
      document.body.classList.add("rtl");
    } else {
      document.body.classList.remove("rtl");
    }
  }, [i18n.language]);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === "en" ? "ar" : "en");
  };

  // ✅ Patients State
  const [patients, setPatients] = useState([]);

  // ✅ Fetch patients from API when the app loads
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/patients/");
        if (response.data.status === "success") {
          setPatients(response.data.data); // Use the 'data' field from the API response
        }
      } catch (error) {
        console.error("Failed to fetch patients:", error);
      }
    };

    fetchPatients();
  }, []);

  // ✅ Function to add a new patient
  const addPatient = (newPatient) => {
    setPatients([...patients, { ...newPatient, id: Date.now() }]);
  };

  // ✅ Function to update an existing patient
  const updatePatient = (updatedPatient) => {
    setPatients(patients.map(patient =>
      patient.id === updatedPatient.id ? updatedPatient : patient
    ));
  };

  // ✅ Function to delete a patient
  const deletePatient = (id) => {
    setPatients(patients.filter(patient => patient.id !== id));
    // Optionally, also remove associated appointments and payments
    setAppointments(appointments.filter(appointment => appointment.patientId !== id));
    setPayments(payments.filter(payment => payment.patientId !== id));
  };

  const [appointments, setAppointments] = useState([
    { id: 1, turn: 1, date: "2025-03-01", clinicName: "مصر الجديدة", type: "كشف", dayOfWeek: "Saturday", cancelled: false, success: false, patientId: 1, patientName: "John Doe" },
  ]);

  // ✅ Function to add a new appointment
  const addAppointment = (newAppointment) => {
    setAppointments([...appointments, { ...newAppointment, id: Date.now() }]);
  };

  const [payments, setPayments] = useState([
    {
      paymentId: 1,
      patientId: 1,
      appointmentId: 1,
      cost: 200,
      date: '2024-04-14',
      time: '10:00 AM',
      turn: 1,
      type: 'كشف',
      clinic: 'مطرية',
      status: 'Paid',
    }
  ]);

  // ✅ Function to add a new payment
  const addPayment = (newPayment) => {
    setPayments([...payments, { ...newPayment, paymentId: Date.now() }]);
  };

  // ✅ Function to update an existing payment
  const updatePayment = (updatedPayment) => {
    setPayments(payments.map(payment =>
      payment.paymentId === updatedPayment.paymentId ? updatedPayment : payment
    ));
  };

  // ✅ Function to delete a payment
  const deletePayment = (id) => {
    setPayments(payments.filter(payment => payment.paymentId !== id));
  };

  const handleLogout = () => {
    setRole("");
    navigate("/login", { replace: true });
  };

  return (
    <NotificationProvider>
      <div className="app">
        {role && <Sidebar />}
        <div className="content">
          {role && <div className="navbar"><Navbar onLogout={handleLogout} toggleLanguage={toggleLanguage} /></div>}

          <div className="scrollable-content">
            <Routes>
              <Route
                path="/"
                element={role === "admin"
                  ? <Dashboard appointments={appointments} setAppointments={setAppointments} patients={patients} />
                  : role === "receptionist"
                    ? <Dashboard appointments={appointments} setAppointments={setAppointments} patients={patients} />
                    : <Navigate to="/login" />}
              />
              <Route
                path="/patients"
                element={role === "receptionist" || role === "admin"
                  ? <Patients patients={patients} setPatients={setPatients} onDeletePatient={deletePatient} />
                  : <Navigate to="/login" />}
              />
              <Route
                path="/patients/:id"
                element={role === "receptionist" || role === "admin"
                  ? <Profile patients={patients} appointments={appointments} />
                  : <Navigate to="/login" />}
              />
              <Route
                path="/add-patient/:id?"
                element={role === "receptionist" || role === "admin"
                  ? <AddPatient patients={patients} setPatients={setPatients} onAddPatient={addPatient} onUpdatePatient={updatePatient} />
                  : <Navigate to="/login" />}
              />
              <Route
                path="/appointments"
                element={role === "receptionist" || role === "admin"
                  ? <Appointments appointments={appointments} setAppointments={setAppointments}   payments={payments} />
                  : <Navigate to="/login" />}
              />

              <Route
                path="/settings"
                element={role === "admin" ? <Settings /> : <Navigate to="/login" />}
              />
              <Route
                path="/add-appointment/:id"
                element={role === "receptionist" || role === "admin"
                  ? <AddAppointment patients={patients} appointments={appointments} onAddAppointment={addAppointment} setPayments={setPayments} />
                  : <Navigate to="/login" />}
              />
              <Route
                path="/payments"
                element={role === "receptionist" || role === "admin"
                  ? <Payments patients={patients}  setPayments={setPayments} payments={payments} onAddPayment={addPayment} onUpdatePayment={updatePayment} onDeletePayment={deletePayment} />
                  : <Navigate to="/login" />}
              /> 
              <Route path="/login" element={<Login onLogin={(selectedRole) => setRole(selectedRole)} />} />
            </Routes>
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default App;
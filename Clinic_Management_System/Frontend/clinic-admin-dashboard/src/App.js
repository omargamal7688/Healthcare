// App.js
import React, { useState, createContext, useContext } from "react";
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
import AddAppoinment from "./pages/AddAppoiment";


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

  // ✅ Patients State
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe", mobile: "123-456-7890" },
    { id: 2, name: "Jane Smith", mobile: "987-654-3210" }
  ]);

  // ✅ Appointments State (Updated to include only the two patients)
  const [appointments, setAppointments] = useState([
    { id: 1, turn: 1, date: "2025-03-01", clinicName: "مصر الجديدة", type: "كشف",dayOfWeek: "Saturday", cancelled: false, success: false,patientId:1 ,patientName: "John Doe" },
    { id: 2, turn: 2, date: "2025-03-01", clinicName: "مصر الجديدة", type: "كشف",dayOfWeek: "Saturday", cancelled: false, success: false,patientId:2, patientName: "Jane Smith" },
    { id: 3, turn: 1, date: "2025-03-02", clinicName: "مصر الجديدة", type: "استشارة", dayOfWeek: "Sunday", cancelled: false, success: false,patientId:1 ,patientName: "John Doe" },
    { id: 4, turn: 2, date: "2025-03-02", clinicName: "مصر الجديدة", type: "استشارة", dayOfWeek: "Sunday", cancelled: false, success: false, patientId:2,patientName: "Jane Smith" },
    { id: 5, turn: 2, date: "2024-03-02", clinicName: "مصر الجديدة", type: "استشارة", dayOfWeek: "Sunday", cancelled: false, success: false, patientId:2,patientName: "Jane Smith" },
    { id: 6, turn: 2, date: "2025-03-03", clinicName: "مصر الجديدة", type: "استشارة", dayOfWeek: "Sunday", cancelled: false, success: false, patientId:2,patientName: "Jane Smith" },
    { id: 7, turn: 1, date: "2025-04-10", clinicName: "مصر الجديدة", type: "كشف", dayOfWeek: "Sunday", cancelled: false, success: false, patientId:1,patientName: "John Doe" },
    { id: 8, turn: 2, date: "2025-04-10", clinicName: "مصر الجديدة", type: "استشارة", dayOfWeek: "Sunday", cancelled: false, success: false, patientId:2,patientName: "Jane Smith" },
    { id: 9, turn: "3", date: "2025-04-10", clinicName: "مصر الجديدة", type: "استشارة", dayOfWeek: "Sunday", cancelled: false, success: false, patientId:2,patientName: "Jane Smith" }
  ]);
  const payments = [
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
      status: 'Paid', // or 'Pending', 'Failed', etc.
    },
    // More payments
  ];
  

  // ✅ Handle Logout
  const handleLogout = () => {
    setRole("");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app">
    {role && <Sidebar />}
    <div className="content">
      {role && <div className="navbar"><Navbar onLogout={handleLogout} /></div>}

      <div className="scrollable-content">
        <Routes>
          <Route
            path="/"
            element={role === "admin"
              ? <Dashboard appointments={appointments} setAppointments={setAppointments} patients={patients} />
              : role === "receptionist"
              ? <Patients patients={patients} setPatients={setPatients} />
              : <Navigate to="/login" />}
          />
          <Route
            path="/patients"
            element={role ? <Patients patients={patients} setPatients={setPatients} /> : <Navigate to="/login" />}
          />
          <Route
            path="/patients/:id"
            element={role ? <Profile patients={patients} appointments={appointments} setAppointments={setAppointments} /> : <Navigate to="/login" />}
          />
          <Route
            path="/add-patient/:id?"
            element={role ? <AddPatient patients={patients} setPatients={setPatients} /> : <Navigate to="/login" />}
          />
          <Route
            path="/appointments"
            element={role === "admin" ? <Appointments appointments={appointments} setAppointments={setAppointments} /> : <Navigate to="/login" />}
          />
          <Route
            path="/settings"
            element={role === "admin" ? <Settings /> : <Navigate to="/login" />}
          />
          
           <Route
            path="/add-appointment/:id"
            element={role === "admin" ? <AddAppoinment patients={patients} appointments={appointments} setAppointments={setAppointments} /> : <Navigate to="/login" />}
          />
        <Route
  path="/payments"
  element={role === "admin" ? <Payments payments={payments} appointments={appointments} /> : <Navigate to="/login" />}
/>
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  </div>
  );
};

export default App;
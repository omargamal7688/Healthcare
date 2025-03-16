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

  // ✅ Handle Logout
  const handleLogout = () => {
    setRole("");
    navigate("/login", { replace: true });
  };

  return (
    <div className="app">
      {role && <Sidebar />}
      <div className="content">
        {role && <Navbar onLogout={handleLogout} />}
        <Routes>
          <Route 
            path="/" 
            element={role === "admin" ? <Dashboard /> : role === "receptionist" ? <Patients patients={patients} setPatients={setPatients} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/patients" 
            element={role ? <Patients patients={patients} setPatients={setPatients} /> : <Navigate to="/login" />} 
          />
          <Route 
            path="/patients/:id" 
            element={role ? <Profile patients={patients} /> : <Navigate to="/login" />} 
          />
           <Route path="/add-patient" element={role ? <AddPatient patients={patients} setPatients={setPatients} /> : <Navigate to="/login" />} />
          <Route path="/appointments" element={role === "admin" ? <Appointments /> : <Navigate to="/login" />} />
          <Route path="/settings" element={role === "admin" ? <Settings /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;

import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import PatientsTable from "./PatientsTable";
import PatientForm from "./PatientForm";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./App.css";
import PatientProfile from "./PatientProfile";
import Reservation from "./Reservation";
import ReservationForm from "./ReservationForm";
import ReservationCancelled from "./ReservationCancelled";



const App = () => {
  const [editingPatient, setEditingPatient] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <BrowserRouter future={{ v7_startTransition: true ,v7_relativeSplatPath: true}}>
    
        <Navbar  />
        <div className={`app-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>

        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main-content">
       
        <div className="content">
          <Routes>
            <Route path="/admin/patients" element={<PatientsTable setEditingPatient={setEditingPatient} />} />
            <Route path="/patient-form" element={<PatientForm editingPatient={editingPatient} setEditingPatient={setEditingPatient} />} />
            <Route path="/profile/:id" element={<PatientProfile />} />
            <Route path="/admin/reservations" element={<Reservation />} />
            <Route path="/admin/reservations/cancel" element={<ReservationCancelled />} />
            <Route path="/admin/reservationForm" element={<ReservationForm />} />
          </Routes>

        </div>
       
        </div>
      </div>
      <Footer />
    
    </BrowserRouter>
  );
};

export default App;

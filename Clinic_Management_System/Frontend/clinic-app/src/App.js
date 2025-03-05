import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import "bootstrap/dist/js/bootstrap.bundle.min";
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
  const [reservations, setReservations] = useState([]);
  const [x,setX] = useState(null);

  const fetchReservations = useCallback(() => {
    axios
      .get("http://localhost:8080/api/reservations/active")
      .then((response) => {
        const today = new Date().toISOString().split("T")[0]; 
        const filteredReservations = response.data.filter(reservation => 
          !reservation.success && 
          !reservation.cancelled && 
          reservation.date === today 
        );
        console.log("Filtered Reservations:", filteredReservations.length);
        setReservations(filteredReservations);
    setX(filteredReservations.length);
  
      })
      .catch(() => {
        console.error("تأكد من الاتصال بالخادم");
      });
  }, []);
  useEffect(() => {
    console.log(x);
  }, [x]);
  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  return (
    <div>
      <Navbar />
      <div className={`app-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
        <Sidebar  isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="main-content">
          <div className="content">
            <Routes>
              <Route path="/admin/patients" element={<PatientsTable setEditingPatient={setEditingPatient} />} />
              <Route path="/patient-form" element={<PatientForm editingPatient={editingPatient} setEditingPatient={setEditingPatient} />} />
              <Route path="/profile/:id" element={<PatientProfile />} />
              <Route path="/admin/reservations" element={
                <Reservation 
                  reservations={reservations} 
                  setReservations={setReservations} 
                  fetchReservations={fetchReservations} 
                />
              } />
              <Route path="/admin/reservations/cancel" element={<ReservationCancelled />} />
              <Route path="/admin/reservationForm" element={<ReservationForm />} />
            </Routes>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;

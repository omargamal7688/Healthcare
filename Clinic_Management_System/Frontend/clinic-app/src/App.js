import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.min.js";
import { BrowserRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import PatientsTable from "./PatientsTable";
import PatientForm from "./PatientForm";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./App.css";


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
          </Routes>

        </div>
       
        </div>
      </div>
      <Footer />
    
    </BrowserRouter>
  );
};

export default App;

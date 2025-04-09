// Dashboard.js
import React, { useState, useEffect } from "react";
import {
  FaUserMd,
  FaCalendarCheck,
  FaDollarSign,
  FaCheckCircle,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../styles/Dashboard.css";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const ITEMS_PER_SLIDE = 3; // Adjust as needed

const Dashboard = ({ appointments, setAppointments, patients }) => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [currentIndex, setCurrentIndex] = useState(0);
  const todayDate = new Date().toISOString().split("T")[0];

  const todaysAppointments = appointments.filter(app => app.date === todayDate);
  const pendingAppointments = todaysAppointments.filter(app => !app.success);
  const successfulAppointments = todaysAppointments.filter(app => app.success);

  const pendingExaminations = pendingAppointments.filter(app => app.type === "كشف");
  const pendingConsultations = pendingAppointments.filter(app => app.type === "استشارة");

  const successfulExaminations = successfulAppointments.filter(app => app.type === "كشف");
  const successfulConsultations = successfulAppointments.filter(app => app.type === "استشارة");

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      Math.min(prevIndex + 1, Math.ceil(pendingAppointments.length / ITEMS_PER_SLIDE) - 1)
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const startIndex = currentIndex * ITEMS_PER_SLIDE;
  const visibleAppointments = pendingAppointments.slice(startIndex, startIndex + ITEMS_PER_SLIDE);

  const appointmentData = months.map((month, index) => {
    const monthAppointments = appointments.filter(app => {
      const date = new Date(app.date);
      return date.getFullYear() === selectedYear && date.getMonth() === index;
    });

    return {
      day: month,
      appointments: monthAppointments.length,
    };
  });

  const handleYearChange = (e) => {
    setSelectedYear(Number(e.target.value));
  };
  const markAsCompleted = (id) => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((appt) =>
        appt.id === id ? { ...appt, success: true, cancelled: false } : appt
      )
    );
  };
  return (
    <div className="dashboard">
      <h1>Control Panel</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <FaUserMd className="stat-icon" />
          <div>
            <p>Total Patients</p>
            <h3>{patients.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarCheck className="stat-icon" />
          <div>
            <p>All Examinations</p>
            <h3>{appointments.filter(app => app.type === "كشف").length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarCheck className="stat-icon" />
          <div>
            <p>All Consultations</p>
            <h3>{appointments.filter(app => app.type === "استشارة").length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaDollarSign className="stat-icon" />
          <div>
            <p>Total Income</p>
            <h3>{appointments.filter(app => app.type === "كشف" && app.success).length * 300}</h3>
          </div>
        </div>
      </div>

      <h1>Today's Statistics</h1>
      <div className="stats-grid">
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div>
            <p>Pending Appointments</p>
            <h3>{pendingAppointments.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div>
            <p>Pending Examinations</p>
            <h3>{pendingExaminations.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaClock className="stat-icon" />
          <div>
            <p>Pending Consultations</p>
            <h3>{pendingConsultations.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div>
            <p>Successful Appointments</p>
            <h3>{successfulAppointments.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div>
            <p>Successful Examinations</p>
            <h3>{successfulExaminations.length}</h3>
          </div>
        </div>
        <div className="stat-card">
          <FaCheckCircle className="stat-icon" />
          <div>
            <p>Successful Consultations</p>
            <h3>{successfulConsultations.length}</h3>
          </div>
        </div>
      </div>

      <h2>Today's Pending Appointments</h2>
      <div id="carouselExampleControls" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          {pendingAppointments.length > 0 ? (
            pendingAppointments.map((app, index) => (
              <div className={`carousel-item ${index === 0 ? 'active' : ''}`} key={app.id}>
                <div className="carousel-item-content">
                  <p><strong>{app.patientName}</strong></p>
                  <p>Turn: {app.turn}</p>
                  {/* Add other appointment details you want to display */}
                  <button className="complete-btn" onClick={() => markAsCompleted(app.id)}>Completed</button>
                </div>
              </div>
            ))
          ) : (
            <div className="carousel-item active">
              <p>No pending appointments for today.</p>
            </div>
          )}
        </div>
        {pendingAppointments.length > 1 && (
          <>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleControls"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </>
        )}
      </div>

      <div className="charts-container">
        <div className="chart-card">
          <h3>Monthly Appointment Trends</h3>
          <label>Select Year:</label>
          <select value={selectedYear} onChange={handleYearChange}>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
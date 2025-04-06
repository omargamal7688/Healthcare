import React, { useState, useEffect } from "react";
import { FaUserMd, FaCalendarCheck, FaDollarSign, FaMoneyCheckAlt } from "react-icons/fa";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import "../styles/Dashboard.css";

// Ensure all months are included in the data
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const Dashboard = ({ appointments }) => {
  // State for selected year
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());  // Default to current year

  // Handle Year Change
  const handleYearChange = (event) => {
    setSelectedYear(Number(event.target.value));  // Ensure the value is a number
  };

  // Generate appointment data per month for the selected year
  const appointmentData = months.map((month, index) => {
    const monthAppointments = appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.date);
      const appointmentYear = appointmentDate.getFullYear();
      const appointmentMonth = appointmentDate.getMonth();
      return appointmentYear === selectedYear && appointmentMonth === index;
    });

    return {
      day: month,
      appointments: monthAppointments.length
    };
  });

  // Log appointmentData to debug
  useEffect(() => {
    console.log("Filtered Appointment Data for Year", selectedYear, appointmentData);
  }, [appointmentData, selectedYear]);

  const pendingPayments = [
    { id: 1, patient: "John Doe", amount: "$200", dueDate: "Mar 15" },
    { id: 2, patient: "Jane Smith", amount: "$350", dueDate: "Mar 18" },
    { id: 3, patient: "Emily Johnson", amount: "$150", dueDate: "Mar 20" }
  ];

  return (
    <div className="dashboard">
      {/* 📊 Top Statistics */}
      <div className="stats-grid">
        <div className="stat-card">
          <FaUserMd className="stat-icon" />
          <div>
            <h3>1,234</h3>
            <p>Total Patients</p>
          </div>
        </div>
        <div className="stat-card">
          <FaCalendarCheck className="stat-icon" />
          <div>
            <h3>23</h3>
            <p>Today's Appointments</p>
          </div>
        </div>
        <div className="stat-card">
          <FaDollarSign className="stat-icon" />
          <div>
            <h3>$50,890</h3>
            <p>Revenue This Month</p>
          </div>
        </div>
        <div className="stat-card">
          <FaMoneyCheckAlt className="stat-icon" />
          <div>
            <h3>$8,200</h3>
            <p>Pending Payments</p>
          </div>
        </div>
      </div>

      {/* 📈 Charts Section */}
      <div className="charts-container">
        {/* Appointment Trends */}
        <div className="chart-card">
          <h3>Appointment Trends</h3>
          
          {/* Year Selector */}
          <div>
            <label>Select Year:</label>
            <select value={selectedYear} onChange={handleYearChange}>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              {/* Add more years if necessary */}
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="appointments" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📌 Pending Payments */}
      <div className="pending-payments">
        <h3>Pending Payments</h3>
        <table className="payments-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Amount</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {pendingPayments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.patient}</td>
                <td>{payment.amount}</td>
                <td>{payment.dueDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;

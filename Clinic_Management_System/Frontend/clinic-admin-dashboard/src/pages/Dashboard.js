import React, { useState } from "react";
import {
  FaUserMd, FaCalendarCheck, FaDollarSign, FaUserPlus, FaMoneyCheckAlt
} from "react-icons/fa";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import "../styles/Dashboard.css";

// Sample Data
const patientData = [
  { month: "Jan", patients: 50, date: "2025-01-01" },
  { month: "Feb", patients: 80, date: "2025-02-01" },
  { month: "Mar", patients: 120, date: "2025-03-01" },
  { month: "Apr", patients: 150, date: "2025-04-01" },
  { month: "May", patients: 180, date: "2025-05-01" }
];

const appointmentData = [
  { day: "Mon", appointments: 15 },
  { day: "Tue", appointments: 22 },
  { day: "Wed", appointments: 30 },
  { day: "Thu", appointments: 28 },
  { day: "Fri", appointments: 35 }
];

const earningsBreakdown = [
  { name: "Consultations", value: 15000 },
  { name: "Treatments", value: 25000 },
  { name: "Follow-ups", value: 10000 }
];

const pendingPayments = [
  { id: 1, patient: "John Doe", amount: "$200", dueDate: "Mar 15" },
  { id: 2, patient: "Jane Smith", amount: "$350", dueDate: "Mar 18" },
  { id: 3, patient: "Emily Johnson", amount: "$150", dueDate: "Mar 20" }
];

const Dashboard = () => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredPatientData = patientData.filter((data) => {
    const dataDate = new Date(data.date);
    return (
      (!startDate || new Date(startDate) <= dataDate) &&
      (!endDate || new Date(endDate) >= dataDate)
    );
  });

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
        {/* Patient Growth */}
        <div className="chart-card">
          <h3>Patient Growth</h3>
          <div className="date-filters">
            <label>
              Start Date:
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </label>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={filteredPatientData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#4CAF50" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Appointment Trends */}
        <div className="chart-card">
          <h3>Appointment Trends</h3>
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

        {/* Earnings Breakdown */}
        <div className="chart-card">
          <h3>Earnings Breakdown</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={earningsBreakdown} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#FF7043" label />
              <Tooltip />
              <Legend />
            </PieChart>
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

      {/* 🚀 Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="btn primary">
            <FaUserPlus /> Add Patient
          </button>
          <button className="btn secondary">
            <FaCalendarCheck /> Schedule Appointment
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

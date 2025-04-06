import React from "react";
import { Link } from "react-router-dom";
import { useRole } from "../App"; // Import role context
import "./Sidebar.css";
const Sidebar = () => {
  const { role } = useRole();

  return (
    <div className="sidebar">
      <h2>Clinic Admin</h2>
      {role === "admin" && <Link to="/">Dashboard</Link>}
      <Link to="/patients">Patients</Link>
      {role === "admin" && <Link to="/appointments">Appointments</Link>}
      {role === "admin" && <Link to="/payments">Payments</Link>}
      {role === "admin" && <Link to="/settings">Settings</Link>}

    </div>
  );
};

export default Sidebar;

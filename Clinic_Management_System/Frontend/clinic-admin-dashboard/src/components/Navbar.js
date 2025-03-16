import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRole } from "../App"; // ✅ Import role context
import "./Navbar.css";

const Navbar = ({ onLogout }) => {
  const { role } = useRole();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <nav className="navbar">
      <h1 className="logo">Clinic Admin</h1>
      <div className="profile-menu">
        <button 
          className="profile-button"
          onClick={() => setShowDropdown(!showDropdown)}
        >
          <span>👤 {role}</span> ▼
        </button>
        {showDropdown && (
          <div className="dropdown-menu">
            <Link to="/profile">Profile</Link>
            {role === "admin" && <Link to="/settings">Settings</Link>}
            <button onClick={onLogout}>Logout</button> {/* ✅ Logout calls handleLogout */}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

import React from "react";
import { Link } from "react-router-dom";
import "../src/Sidebar.css";

import { FaBars } from "react-icons/fa"; // ✅ Sidebar Toggle Icon

      
const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <button className="toggle-btn" onClick={toggleSidebar}>
          <FaBars />
        </button>
       
    <nav className="sidebar d-flex flex-column bg-dark text-white vh-100 position-fixed end-0 p-3">
      <ul className="nav flex-column">
      <li className="nav-item">
          <Link className="nav-link text-white text-end" to="/admin/">
            لوحة التحكم
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white text-end" to="/admin/">
            لوحة التحكم
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white text-end" to="/admin/patients/">
            المرضى
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white text-end" to="/admin/reservations/">
            الحجوزات
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white text-end" to="/admin/labs/">
            التحاليل
          </Link>
        </li>
      </ul>
    </nav>
    </div>
  );
};

export default Sidebar;

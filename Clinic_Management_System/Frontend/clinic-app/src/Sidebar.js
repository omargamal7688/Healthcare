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
          <br />
          <br />
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
          <li className="nav-item dropdown">
            <button
              className="nav-link dropdown-toggle text-white text-end bg-transparent border-0"
              id="reservationsDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              الحجوزات
            </button>
            <ul
              className="dropdown-menu bg-dark text-white text-end"
              aria-labelledby="reservationsDropdown"
            >
              <li>
                <Link className="dropdown-item text-white" to="/admin/reservations">
                  الحجوزات قيد الانتظار
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-white" to="/admin/reservations">
                  الحجوزات تم دخولها
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-white" to="/admin/reservations/cancel">
                  الحجوزات الملغاة
                </Link>
              </li>
              <li>
                <Link className="dropdown-item text-white" to="/admin/all-reservations">
                  جميع الحجوزات
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;

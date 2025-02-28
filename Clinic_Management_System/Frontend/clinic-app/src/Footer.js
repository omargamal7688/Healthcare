import React from "react";
import "./footer.css"; // ✅ Make sure this file exists for custom styles

const Footer = () => {
  return (
    <footer className="footer bg-dark text-white text-center py-3">
      <div className="container">
        <p className="mb-0">جميع الحقوق محفوظة &copy; 2025 عيادة الدكتور جمال ابو رجيلة</p>
      </div>
    </footer>
  );
};

export default Footer;

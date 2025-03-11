import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";
import PatientsTable from "./PatientsTable";
import Navbar from "./Navbar";
import Footer from "./Footer";
import PatientForm from "./PatientForm";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "./App.css";

const App = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState(false);
  const [countdown, setCountdown] = useState(10); // ⏳ العد التنازلي لإعادة المحاولة

  // دالة لجلب قائمة المرضى
  const fetchPatients = () => {
    axios.get("http://localhost:8080/api/patients/")
      .then((response) => {
        setPatients(response.data);
        setServerError(false); // ✅ إخفاء رسالة الخطأ عند نجاح الاتصال
        setLoading(false);
      })
      .catch(() => {
        setServerError(true);
        setLoading(false);
      });
  };

  // ✅ إعادة المحاولة كل 10 ثوانٍ
  useEffect(() => {
    fetchPatients(); // جلب البيانات عند التحميل

    const interval = setInterval(() => {
      if (serverError) {
        fetchPatients();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [serverError]);

  // ✅ تحديث العد التنازلي كل ثانية
  useEffect(() => {
    if (serverError) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 10)); // إعادة العد التنازلي بعد الوصول إلى الصفر
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [serverError]);

  return (
    <div>
      <Navbar />
      <Sidebar />
      <div className="main-content">
        <Routes>
          <Route path="/admin/patients" element={<PatientsTable patients={patients} setPatients={setPatients} loading={loading} />} />
          <Route path="/patient-form" element={<PatientForm fetchPatients={fetchPatients} />} />
        </Routes>
      </div>
      <Footer />

      {/* ✅ نافذة خطأ عند انقطاع الاتصال بالسيرفر */}
      {serverError && (
        <div className="modal fade show d-block" id="serverErrorModal" tabIndex="-1" aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">⚠ خطأ في الاتصال</h5>
              </div>
              <div className="modal-body text-center">
                <p className="fs-5">❌ تأكد من الاتصال بالخادم، سيتم إعادة المحاولة خلال {countdown} ثوانٍ.</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={fetchPatients}>إعادة المحاولة الآن</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;

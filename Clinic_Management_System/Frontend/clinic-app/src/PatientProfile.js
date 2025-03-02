import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaWhatsapp } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";

const PatientProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    const fetchPatient = async () => {
      const response = await fetch(`http://localhost:8080/api/patients/${id}`);
      const data = await response.json();
      setPatient(data);
    };

    fetchPatient();
  }, [id]);

  if (!patient) {
    return <div className="text-center mt-5">جاري التحميل...</div>;
  }

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar Placeholder */}
        <div className="col-lg-3">
          <div className="bg-light p-3">Sidebar</div>
        </div>

        {/* Main Content */}
        <div className="col-lg-10">
          <h1 className="mt-4 text-primary">الملف المرضي</h1>

          {/* Tracking Bar */}
          <div className="d-flex justify-content-between mt-4">
            <div className="text-center">
              <div className="circle bg-success text-white">1</div>
              <p>إرسال عنوان العيادة</p>
            </div>
            <div className="text-center">
              <div className="circle bg-secondary text-white">2</div>
              <p>حجز كشف</p>
            </div>
          </div>

          {/* Patient Details Section */}
          <div className="card mt-4">
            <div className="card-header bg-primary text-white">تفاصيل المريض</div>
            <div className="card-body">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <th>الرقم</th>
                    <td>{patient.id}</td>
                  </tr>
                  <tr>
                    <th>الاسم</th>
                    <td>{patient.name}</td>
                  </tr>
                  <tr>
                    <th>رقم الهاتف</th>
                    <td>
                      {patient.phone} &nbsp;
                      <a
                        href={`https://wa.me/${patient.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-success btn-sm"
                      >
                        <FaWhatsapp /> إرسال واتساب
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Reservations Section */}
          <div className="card mt-4">
            <div className="card-header bg-dark text-white">الحجوزات</div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>الدور</th>
                    <th>تاريخ الحجز</th>
                    <th>اسم العيادة</th>
                    <th>النوع</th>
                    <th>الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {patient.reservations && patient.reservations.length > 0 ? (
                    patient.reservations.map((res, index) => (
                      <tr key={index}>
                        <td>{res.queueNumber}</td>
                        <td>{res.date}</td>
                        <td>{res.clinicName}</td>
                        <td>{res.type}</td>
                        <td>
                          <button className="btn btn-danger btn-sm">إلغاء</button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        لا توجد حجوزات
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
           
              <button 
  className="btn btn-primary mt-3" 
  onClick={() => navigate("/admin/reservationForm", { state: { patientName: patient.name  ,patientId:patient.id} })}
>
  إضافة حجز جديد
</button>
            </div>
          </div>

          {/* Add New Reservation Button */}
   


          {/* Back Button */}
          <button className="btn btn-secondary mt-4 ms-3" onClick={() => navigate(-1)}>
            رجوع
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;

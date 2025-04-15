import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "../styles/Payments.css";

const Payments = ({ payments, patients }) => {
  const [paymentList, setPaymentList] = useState(payments);

  useEffect(() => {
    setPaymentList(payments);
  }, [payments]);

  // 🧾 PDF Generation Function
  const generateReceipt = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Clinic Payment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Receipt ID: ${payment.paymentId}`, 20, 40);
    doc.text(`Patient Name: ${getPatientName(payment.patientId)}`, 20, 50);
    doc.text(`Appointment ID: ${payment.appointmentId}`, 20, 60);
    doc.text(`Cost: $${payment.cost}`, 20, 70);
    doc.text(`Date: ${payment.date}`, 20, 80);
    doc.text(`Time: ${payment.time}`, 20, 90);
    doc.text(`Turn: ${payment.turn}`, 20, 100);
    doc.text(`Type: ${payment.type}`, 20, 110);
    doc.text(`Clinic: ${payment.clinic}`, 20, 120);
    doc.text(`Status: ${payment.status}`, 20, 130);
    doc.text("Thank you for your visit!", 20, 140);

    doc.save(`Receipt_${getPatientName(payment.patientId)}_${payment.paymentId}.pdf`);
  };

  // Helper function to get patient name from patientId
  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  const updatePaymentStatus = (paymentId, status) => {
    setPaymentList((prevPayments) =>
      prevPayments.map((payment) => {
        if (payment.paymentId === paymentId) {
          const updated = { ...payment, status };
          if (status === "Paid") {
            generateReceipt(updated);
          }
          return updated;
        }
        return payment;
      })
    );
  };

  return (
    <div className="payments-container">
      <h2>Payments</h2>

      <table className="payments-table">
        <thead>
          <tr>
            <th>Payment ID</th>
            <th>Patient Name</th>
            <th>Appointment ID</th>
            <th>Cost</th>
            <th>Date</th>
            <th>Time</th>
            <th>Turn</th>
            <th>Type</th>
            <th>Clinic</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paymentList.length > 0 ? (
            paymentList.map((payment) => (
              <tr key={payment.paymentId} className={payment.status.toLowerCase()}>
                <td>{payment.paymentId}</td>
                <td>{getPatientName(payment.patientId)}</td>
                <td>{payment.appointmentId}</td>
                <td>{payment.cost > 0 ? `$${payment.cost}` : "Free"}</td>
                <td>{payment.date}</td>
                <td>{payment.time}</td>
                <td>{payment.turn}</td>
                <td>{payment.type}</td>
                <td>{payment.clinic}</td>
                <td>{payment.status}</td>
                <td>
                  {payment.status === "Pending" && (
                    <button
                      className="pay-btn"
                      onClick={() => updatePaymentStatus(payment.paymentId, "Paid")}
                    >
                      Mark as Paid
                    </button>
                  )}
                  {payment.status === "Paid" && (
                    <button
                      className="pending-btn"
                      onClick={() => updatePaymentStatus(payment.paymentId, "Pending")}
                    >
                      Set to Pending
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="11" className="no-results">No payments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;

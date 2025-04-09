import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "../styles/Payments.css";

const Payments = ({ appointments }) => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const generatedPayments = appointments.map((appointment) => ({
      id: appointment.id,
      patientName: appointment.patientName,
      amount: appointment.type === "كشف" ? 300 : 0,
      date: appointment.date,
      status: "Pending",
    }));
    setPayments(generatedPayments);
  }, [appointments]);

  // 🧾 PDF Generation Function
  const generateReceipt = (payment) => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Clinic Payment Receipt", 20, 20);

    doc.setFontSize(12);
    doc.text(`Receipt ID: ${payment.id}`, 20, 40);
    doc.text(`Patient Name: ${payment.patientName}`, 20, 50);
    doc.text(`Date: ${payment.date}`, 20, 60);
    doc.text(`Amount Paid: $${payment.amount}`, 20, 70);
    doc.text(`Status: ${payment.status}`, 20, 80);
    doc.text("Thank you for your visit!", 20, 100);

    doc.save(`Receipt_${payment.patientName}_${payment.id}.pdf`);
  };

  const updatePaymentStatus = (id, status) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) => {
        if (payment.id === id) {
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
            <th>Patient</th>
            <th>Amount</th>
            <th>Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {payments.length > 0 ? (
            payments.map((payment) => (
              <tr key={payment.id} className={payment.status.toLowerCase()}>
                <td>{payment.patientName}</td>
                <td>{payment.amount > 0 ? `$${payment.amount}` : "Free"}</td>
                <td>{payment.date}</td>
                <td>{payment.status}</td>
                <td>
                  {payment.status === "Pending" && (
                    <button
                      className="pay-btn"
                      onClick={() => updatePaymentStatus(payment.id, "Paid")}
                    >
                      Mark as Paid
                    </button>
                  )}
                  {payment.status === "Paid" && (
                    <button
                      className="pending-btn"
                      onClick={() => updatePaymentStatus(payment.id, "Pending")}
                    >
                      Set to Pending
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="no-results">No payments found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Payments;

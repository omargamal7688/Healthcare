import React, { useState, useEffect } from "react";
import "../styles/Payments.css"; // Ensure you have styling for this page

const Payments = ({ appointments }) => {
  const [payments, setPayments] = useState([]);

  // Generate payments from appointments
  useEffect(() => {
    const generatedPayments = appointments.map((appointment) => ({
      id: appointment.id,
      patientName: appointment.patientName,
      amount: appointment.type === "كشف" ? 300 : 0,
      date: appointment.date,
      status: "Pending", // Default status
    }));
    setPayments(generatedPayments);
  }, [appointments]);

  // Handle Payment Status Change
  const updatePaymentStatus = (id, status) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === id ? { ...payment, status } : payment
      )
    );
  };

  return (
    <div className="payments-container">
      <h2>Payments</h2>

      {/* Payments Table */}
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

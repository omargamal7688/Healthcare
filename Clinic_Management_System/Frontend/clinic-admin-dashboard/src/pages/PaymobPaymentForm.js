import React, { useState, useEffect } from 'react';

const PaymobPaymentForm = ({ amount, onPaymentSuccess, onPaymentFailure, onPaymentCancel }) => {
  const [paymentKey, setPaymentKey] = useState('');
  const [orderId, setOrderId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('Initializing payment...');
  const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);

  // **Replace with your actual Integration ID (for potential Paymob SDK usage)**
  const INTEGRATION_ID = 'YOUR_INTEGRATION_ID'; // Replace with 504436

  useEffect(() => {
    // **Simulate fetching a payment key and order ID from a (non-existent) backend**
    if (amount && !paymentKey && !orderId && isPaymentInitiated) {
      console.log('Simulating fetching payment key and order ID...');
      setTimeout(() => {
        const fakePaymentKey = Math.random().toString(36).substring(7);
        const fakeOrderId = Math.floor(Math.random() * 1000000);
        setPaymentKey(fakePaymentKey);
        setOrderId(fakeOrderId);
        setPaymentStatus('Simulated payment form is ready.');
      }, 1500);
    }
  }, [amount, paymentKey, orderId, isPaymentInitiated]);

  const initiatePayment = () => {
    setIsPaymentInitiated(true);
    setPaymentStatus('Initiating payment...');
  };

  const simulatePaymentSuccess = () => {
    setPaymentStatus('Simulated payment successful!');
    if (onPaymentSuccess) {
      onPaymentSuccess({ transactionId: Math.random().toString(36).substring(7) });
    }
  };

  const simulatePaymentFailure = () => {
    setPaymentStatus('Simulated payment failed.');
    if (onPaymentFailure) {
      onPaymentFailure({ error: 'Simulated payment failure' });
    }
  };

  const simulatePaymentCancel = () => {
    setPaymentStatus('Simulated payment cancelled.');
    if (onPaymentCancel) {
      onPaymentCancel();
    }
  };

  return (
    <div>
      <h2>Pay with Card (Simulated)</h2>
      {!isPaymentInitiated ? (
        <button onClick={initiatePayment} disabled={!amount}>
          Initiate Payment ({amount ? `EGP ${amount}` : 'Enter Amount'})
        </button>
      ) : (
        <div>
          <p>{paymentStatus}</p>
          {paymentKey && orderId ? (
            <div className="simulated-paymob-form">
              <p>Simulating Paymob iFrame:</p>
              <p>Payment Key: {paymentKey}</p>
              <p>Order ID: {orderId}</p>
              {/* In a real app, Paymob's iFrame would be embedded here */}
              <button onClick={simulatePaymentSuccess}>Simulate Successful Payment</button>
              <button onClick={simulatePaymentFailure}>Simulate Payment Failure</button>
              <button onClick={simulatePaymentCancel}>Simulate Cancel Payment</button>
            </div>
          ) : (
            <p>Loading simulated payment form...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default PaymobPaymentForm;
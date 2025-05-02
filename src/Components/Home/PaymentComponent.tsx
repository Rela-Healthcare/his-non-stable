import React, {useState} from 'react';
import {usePayment} from '../../hooks/payment/usePayment';

type PaymentStatus = 'idle' | 'pending' | 'success' | 'failed';

const PaymentComponent = () => {
  const [amount, setAmount] = useState(100);
  const [localTransactionStatus, setLocalTransactionStatus] =
    useState<PaymentStatus>('idle');

  const {
    initiatePayment,
    isLoading,
    error,
    iframeUrl,
    resetError,
    checkPaymentStatus,
  } = usePayment();

  const handlePayment = async () => {
    setLocalTransactionStatus('pending');

    const response = await initiatePayment({
      patientName: 'John Doe',
      patientID: 'PAT12345',
      amount,
      email: 'john@example.com',
      phone: '9876543210',
      processingId: `ORDER_${Date.now()}`,
      paymode: 'cards-upi',
    });

    if (!response.success) {
      setLocalTransactionStatus('failed');
      console.error('Payment failed:', response.error);
      return;
    }
  };

  // Start polling for payment status
  //   const pollStatus = async () => {
  //     const result = await checkPaymentStatus(response.transactionId!);

  //     if (result.status === 'success') {
  //       setLocalTransactionStatus('success');
  //       // Optionally use result.message for success feedback
  //     } else if (result.status === 'failed') {
  //       setLocalTransactionStatus('failed');
  //       // Optionally use result.message for error feedback
  //       console.log(result.message);
  //     } else {
  //       setTimeout(pollStatus, 2000);
  //     }
  //   };

  //   pollStatus();

  return (
    <div className="payment-container">
      <h2>Make Payment</h2>

      <div className="amount-input">
        <label htmlFor="amount">Amount:</label>
        <input
          id="amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          min="1"
        />
      </div>

      <button
        onClick={handlePayment}
        disabled={isLoading || localTransactionStatus === 'pending'}
        className="pay-button">
        {isLoading ? 'Processing...' : 'Pay Now'}
      </button>

      {error && (
        <div className="error-message">
          {error}
          <button onClick={resetError} className="dismiss-button">
            Dismiss
          </button>
        </div>
      )}

      {localTransactionStatus === 'pending' && iframeUrl && (
        <div className="payment-status">
          <p>Processing your payment...</p>
          <iframe
            src={iframeUrl}
            title="MomentPay Payment"
            className="payment-iframe"
            allow="payment"
          />
        </div>
      )}

      {localTransactionStatus === 'success' && (
        <div className="success-message">
          Payment successful! Thank you for your purchase.
        </div>
      )}

      {localTransactionStatus === 'failed' && !error && (
        <div className="error-message">Payment failed. Please try again.</div>
      )}
    </div>
  );
};

export default PaymentComponent;

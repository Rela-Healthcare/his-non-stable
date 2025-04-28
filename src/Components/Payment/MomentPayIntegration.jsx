import React, {useState, useEffect, useRef} from 'react';
import CryptoJS from 'crypto-js';

const MomentPayIntegration = () => {
  // Configuration from environment variables
  const config = {
    baseUrl: process.env.REACT_APP_MOMENT_PAY_BASE_URL,
    user: process.env.REACT_APP_MOMENTPAY_USER,
    key: process.env.REACT_APP_MOMENTPAY_KEY,
    secret: process.env.REACT_APP_MOMENTPAY_SECRET,
    merchantId: process.env.REACT_APP_MOMENTPAY_MERCHANT_ID,
    callbackUrl: 'http://localhost:3000/payment-result',
    redirectUrl: 'http://localhost:3000/payment-result',
  };

  // State for payment details
  const [paymentDetails, setPaymentDetails] = useState({
    amount: '1.00',
    customerName: 'Test Customer',
    customerId: 'CUST' + Date.now(),
    email: 'test@example.com',
    phone: '9876543210',
    processingId: 'ORDER' + Date.now(),
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentParams, setPaymentParams] = useState(null);
  const [paymentResponse, setPaymentResponse] = useState(null);
  const formRef = useRef(null);

  // Calculate checksum according to MomentPay specs
  const calculateChecksum = () => {
    const {amount, processingId} = paymentDetails;
    const plainString = `${amount}|${processingId}+${config.merchantId}+${config.secret}`;
    const hash = CryptoJS.SHA256(plainString);
    return CryptoJS.enc.Base64.stringify(hash);
  };

  // Prepare payment payload
  const preparePayment = () => {
    const checksum = calculateChecksum();

    const payload = {
      authentication: {
        user: config.user,
        key: config.key,
        version: 'HISV2',
      },
      cashier_id: 'WEB_CASHIER_01', // Static value for web payments
      customer_details: [
        {
          customer_name: paymentDetails.customerName,
          customer_id: paymentDetails.customerId,
          payment_amount: paymentDetails.amount,
          customer_email: paymentDetails.email,
          customer_phone: paymentDetails.phone,
        },
      ],
      processing_id: paymentDetails.processingId,
      paymode: 'cards-upi', // Recommended default payment mode
      transaction_till: 'WEB_PORTAL',
      payment_fill: 'express_full',
      merchant_id: config.merchantId,
      checksum_hash: checksum,
      callback_url: '',
      redirect_url: config.redirectUrl,
    };

    setPaymentParams(payload);
    setIsModalOpen(true);
  };

  // Submit form when modal opens
  useEffect(() => {
    if (isModalOpen && paymentParams && formRef.current) {
      formRef.current.submit();
    }
  }, [isModalOpen, paymentParams]);

  // Handle payment response
  useEffect(() => {
    const handleMessage = (event) => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        if (data.response_token || data.transaction_id) {
          setPaymentResponse(data);
          setIsModalOpen(false);
        }
      } catch (error) {
        console.error('Error processing payment response:', error);
      }
    };

    if (isModalOpen) {
      window.addEventListener('message', handleMessage);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isModalOpen]);

  return (
    <div style={styles.container}>
      <h2>MomentPay Payment</h2>

      <div style={styles.warningBox}>
        <strong>Note:</strong> This is for testing only. Secret key should never
        be exposed in frontend code in production.
      </div>

      <div style={styles.formGroup}>
        <label>Amount (₹)</label>
        <input
          type="text"
          value={paymentDetails.amount}
          onChange={(e) =>
            setPaymentDetails({...paymentDetails, amount: e.target.value})
          }
        />
      </div>

      <button onClick={preparePayment} style={styles.payButton}>
        Proceed to Payment
      </button>

      {paymentResponse && (
        <div style={styles.responseBox}>
          <h3>Payment Result</h3>
          <pre>{JSON.stringify(paymentResponse, null, 2)}</pre>
          {paymentResponse.response_token?.response_code === '1200' ? (
            <p style={styles.successText}>Payment Successful!</p>
          ) : (
            <p style={styles.errorText}>Payment Failed</p>
          )}
        </div>
      )}

      {/* Payment Modal */}
      {isModalOpen && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={styles.closeButton}>
              ×
            </button>
            <h3>Complete Your Payment</h3>
            <iframe
              name="momentpay-iframe"
              title="Payment Gateway"
              style={styles.iframe}
              sandbox="allow-forms allow-scripts allow-same-origin"></iframe>

            <form
              ref={formRef}
              method="post"
              action={config.baseUrl}
              target="momentpay-iframe"
              style={{display: 'none'}}>
              {paymentParams &&
                Object.entries(paymentParams).map(([key, value]) => (
                  <input
                    key={key}
                    type="hidden"
                    name={key}
                    value={
                      typeof value === 'object' ? JSON.stringify(value) : value
                    }
                  />
                ))}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles
const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  warningBox: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '15px',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '10px 15px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  responseBox: {
    marginTop: '20px',
    padding: '15px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  successText: {
    color: '#28a745',
    fontWeight: 'bold',
  },
  errorText: {
    color: '#dc3545',
    fontWeight: 'bold',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: '800px',
    height: '80vh',
    borderRadius: '8px',
    padding: '20px',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    background: 'none',
    border: 'none',
    fontSize: '24px',
    cursor: 'pointer',
  },
  iframe: {
    width: '100%',
    height: 'calc(100% - 40px)',
    border: 'none',
    marginTop: '20px',
  },
};

export default MomentPayIntegration;

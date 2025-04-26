import {useEffect} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Parse query parameters for payment result
    const params = new URLSearchParams(location.search);
    const status = params.get('status');
    const transactionId = params.get('transaction_id');

    if (status === 'success') {
      alert(`Payment successful! Transaction ID: ${transactionId}`);
    } else {
      alert('Payment failed or was cancelled');
    }

    // Redirect back after showing message
    setTimeout(() => navigate('/'), 3000);
  }, [location, navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Processing your payment...</h2>
        <p>You will be redirected shortly.</p>
      </div>
    </div>
  );
};

export default PaymentResult;

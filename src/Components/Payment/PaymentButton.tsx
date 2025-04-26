import {usePayment} from '../../hooks/usePayment';
import PaymentModal from './PaymentModal';
import {PaymentButtonProps} from '../../types/payment.types';
import {createPortal} from 'react-dom';
import {useEffect, useState} from 'react';

const PaymentButton = ({
  paymentDetails,
  className = '',
  onPaymentSuccess,
  onPaymentError,
}: PaymentButtonProps) => {
  const {initiatePayment, isLoading, error, iframeUrl, resetError} =
    usePayment();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePaymentInitiation = async () => {
    const response = await initiatePayment(paymentDetails);

    if (response.success && response.iframeUrl) {
      setIsModalOpen(true);
      onPaymentSuccess?.({message: 'Payment initialized successfully'});
    } else if (response.error) {
      onPaymentError?.(response.error);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    // You might want to verify payment status here if needed
  };

  useEffect(() => {
    if (error) {
      onPaymentError?.(error);
      resetError();
    }
  }, [error, onPaymentError, resetError]);

  useEffect(() => {
    if (error) {
      onPaymentError?.(error);
      resetError();
    }
  }, [error, onPaymentError, resetError]);

  return (
    <>
      <button
        onClick={handlePaymentInitiation}
        disabled={isLoading}
        className={`flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-teal-800 text-white hover:from-green-700 hover:to-teal-900 transition-all duration-300 ease-in-out px-6 py-2 rounded-lg shadow-lg font-bold text-sm tracking-wide ${className}`}>
        {isLoading
          ? 'Processing...'
          : `Pay ₹${paymentDetails.amount.toFixed(2)}`}
      </button>

      {isModalOpen &&
        iframeUrl &&
        createPortal(
          <PaymentModal
            isOpen={isModalOpen}
            iframeUrl={iframeUrl}
            onClose={handleModalClose}
          />,
          document.getElementById('modal-root')!
        )}
    </>
  );
};

export default PaymentButton;

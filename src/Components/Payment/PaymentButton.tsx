import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {Button} from 'react-bootstrap';
import type {AppDispatch} from '../../store/store';
import {
  initiatePayment,
  initializeMomentPay,
} from '../../store/Slices/momentPay/momentPayThunks';
import {selectPaymentStatus} from '../../store/Slices/momentPay/momentPaySlice';
import {PaymentButtonProps} from '../../types/payment.types';

const PaymentButton = ({
  paymentDetails,
  className = '',
  onPaymentSuccess,
  onPaymentError,
}: PaymentButtonProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const {isLoading, error, status} = useSelector(selectPaymentStatus);

  useEffect(() => {
    dispatch(initializeMomentPay());
  }, [dispatch]);

  const handlePaymentInitiation = () => {
    if (!paymentDetails) {
      onPaymentError?.('Invalid payment details');
      return;
    }

    dispatch(
      initiatePayment(
        paymentDetails,
        onPaymentSuccess,
        (error, isUserClosed = false) => {
          if (!isUserClosed) {
            onPaymentError?.(error);
          }
        }
      )
    );
  };

  useEffect(() => {
    if (status === 'success') {
      onPaymentSuccess?.('Payment successful');
    } else if (status === 'failed') {
      onPaymentError?.(error || 'Payment failed');
    }
  }, [status, error, onPaymentSuccess, onPaymentError]);

  return (
    <Button
      onClick={handlePaymentInitiation}
      disabled={isLoading}
      className={`flex items-center justify-center gap-2 bg-gradient-to-r from-green-700 to-teal-800 text-white hover:from-green-700 hover:to-teal-900 transition-all duration-300 ease-in-out px-6 py-2 rounded-lg shadow-lg text-sm tracking-wide w-full mt-6 ${className}`}>
      {isLoading ? 'Processing...' : `Pay ₹${paymentDetails.amount.toFixed(2)}`}
    </Button>
  );
};

export default PaymentButton;

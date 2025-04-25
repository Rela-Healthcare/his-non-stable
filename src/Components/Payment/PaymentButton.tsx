import {Button} from 'react-bootstrap';
import {usePayment} from '../../hooks/usePayment';
import PaymentModal from './PaymentModal';
import {PaymentButtonProps} from '../../types/payment.types';
import {createPortal} from 'react-dom';

const PaymentButton = ({
  paymentDetails,
  className = '',
}: PaymentButtonProps) => {
  const {iframeUrl, isOpen, startPayment, closePayment} = usePayment();

  const handleClick = () => {
    startPayment(paymentDetails);
  };

  const handleClose = async () => {
    const response = await closePayment(paymentDetails.processingId);
    console.log('Payment response:', response?.data);
  };

  return (
    <>
      <Button
        onClick={handleClick}
        className={`flex items-center font-sans justify-center gap-2 bg-gradient-to-r from-green-700 to-teal-800 text-white hover:from-green-700 hover:to-teal-900 transition-all duration-300 ease-in-out px-6 py-2 rounded-lg shadow-lg font-bold text-sm tracking-wide ${className}`}>
        Pay ₹{paymentDetails.chargeRate.toFixed(2)}
      </Button>

      {isOpen &&
        createPortal(
          <PaymentModal
            isOpen={isOpen}
            iframeUrl={iframeUrl}
            onClose={handleClose}
          />,
          document.getElementById('modal-root')!
        )}
    </>
  );
};

export default PaymentButton;

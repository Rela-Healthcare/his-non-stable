import React, {useEffect} from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  iframeUrl: string;
  onClose: () => void;
  onPaymentSuccess?: (data: any) => void;
  onPaymentError?: (error: string) => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  iframeUrl,
  onClose,
  onPaymentSuccess,
  onPaymentError,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleMessage = (event: MessageEvent) => {
      console.log('Modal received message:', event.data);

      // Verify origin in production
      // if (event.origin !== "https://testing.momentpay.in") return;

      try {
        // Handle different response formats
        let responseData;

        if (typeof event.data === 'string') {
          responseData = JSON.parse(event.data);
        } else {
          responseData = event.data;
        }

        // Check for success in different response formats
        if (responseData?.response_token?.response_code === '1200') {
          onPaymentSuccess?.(responseData.response_token);
        } else if (responseData?.status === 'success') {
          onPaymentSuccess?.(responseData);
        } else {
          const errorMsg =
            responseData?.response_token?.response_message ||
            responseData?.message ||
            'Payment failed';
          onPaymentError?.(errorMsg);
        }
      } catch (error) {
        console.error('Error processing payment response:', error);
        onPaymentError?.('Invalid payment response format');
      } finally {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('message', handleMessage);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('message', handleMessage);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose, onPaymentSuccess, onPaymentError]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-[9999]">
      <div className="bg-white rounded-2xl w-full h-[85vh] max-w-screen-lg shadow-lg overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold z-50"
          aria-label="Close Payment Modal">
          &times;
        </button>
        <iframe
          src={iframeUrl}
          title="Payment Gateway"
          className="w-full h-full border-0"
          referrerPolicy="no-referrer"
          allow="payment *"
          allowFullScreen
          sandbox="allow-forms allow-scripts allow-same-origin allow-popups allow-modals"
        />
      </div>
    </div>
  );
};

export default PaymentModal;

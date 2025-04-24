import React, {useEffect} from 'react';

interface PaymentModalProps {
  isOpen: boolean;
  iframeUrl: string;
  onClose: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  iframeUrl,
  onClose,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl w-full max-w-screen-lg shadow-lg overflow-hidden relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            aria-label="Close Payment Modal">
            &times;
          </button>
          <iframe
            src={iframeUrl}
            title="Payment Gateway"
            className="w-full h-[600px] border-0"
            referrerPolicy="no-referrer"
            allowFullScreen
          />
        </div>
      </div>
    </>
  );
};

export default PaymentModal;

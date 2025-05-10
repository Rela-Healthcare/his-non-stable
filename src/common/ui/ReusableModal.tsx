import React, {useEffect, useRef} from 'react';
import {FocusTrap} from 'focus-trap-react';
import {motion, AnimatePresence} from 'framer-motion';

interface ReusableModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  maxWidth?: string;
  height?: string;
  title?: string;
  footer?: React.ReactNode;
  zIndex?: string;
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  maxWidth = 'max-w-3xl',
  height = 'h-[85vh]',
  title,
  footer,
  zIndex = 'z-[9999]',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`fixed inset-0 ${zIndex} bg-gray-900 bg-opacity-60 flex items-center justify-center px-4 sm:px-6 md:px-8`}
          initial={{opacity: 0}}
          animate={{opacity: 1}}
          exit={{opacity: 0}}
          transition={{duration: 0.2}}>
          <FocusTrap active={isOpen}>
            <div
              ref={modalRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              className={`w-full ${maxWidth} ${height} bg-white rounded-2xl shadow-xl relative transition-all transform flex flex-col`}>
              {/* Close Button */}
              {showCloseButton && (
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold z-50 w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Close Modal">
                  &times;
                </button>
              )}

              {/* Title */}
              {title && (
                <div className="px-6 pt-4 pb-2 border-b border-gray-200 flex justify-between items-center">
                  <h2
                    id="modal-title"
                    className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
                    {title}
                  </h2>
                </div>
              )}

              {/* Content */}
              <div className="px-6 py-3 overflow-y-auto flex-1 text-gray-700">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end gap-3">
                  {footer}
                </div>
              )}
            </div>
          </FocusTrap>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ReusableModal;

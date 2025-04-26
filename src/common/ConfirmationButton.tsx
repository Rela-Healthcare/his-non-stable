import {useState} from 'react';
import ConfirmDialog from './ConfirmDialog';
import {Button, Spinner} from 'react-bootstrap';

interface ConfirmationButtonProps {
  buttonText: string;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => Promise<void> | void;
  className?: string;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'danger'
    | 'warning'
    | 'info'
    | 'light'
    | 'dark'
    | 'link';
}

const ConfirmationButton = ({
  buttonText,
  title = 'Are you sure?',
  message = 'Do you really want to perform this action?',
  confirmText = 'Yes',
  cancelText = 'Cancel',
  onConfirm,
  className = '',
  variant,
}: ConfirmationButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onConfirm();
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        onClick={() => setShowConfirm(true)}
        className={` ${className}`}
        disabled={loading}>
        {loading && <Spinner animation="border" size="sm" />}
        {buttonText}
      </Button>

      <ConfirmDialog
        show={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirm}
        title={title}
        message={message}
        confirmText={confirmText}
        cancelText={cancelText}
      />
    </>
  );
};

export default ConfirmationButton;

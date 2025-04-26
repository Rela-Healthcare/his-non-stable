import {Button} from 'react-bootstrap';
import ConfirmationButton from '../../../../common/ConfirmationButton';

interface FormActionButtonsProps {
  onClear: () => Promise<void> | void;
  position?: 'left' | 'center' | 'right';
}

const FormActionButtons = ({
  onClear,
  position = 'right',
}: FormActionButtonsProps) => {
  const getJustifyClass = () => {
    switch (position) {
      case 'left':
        return 'justify-start';
      case 'center':
        return 'justify-center';
      case 'right':
      default:
        return 'justify-end';
    }
  };

  return (
    <div className={`flex gap-2 ${getJustifyClass()}`}>
      {/* Clear Button (with confirmation) */}
      <ConfirmationButton
        buttonText="Clear"
        title="Clear Form"
        message="Are you sure you want to clear this form?"
        confirmText="Clear"
        cancelText="Cancel"
        onConfirm={onClear}
        className="bg-gray-500 hover:bg-gray-600"
      />

      {/* Save Button */}
      <Button variant="primary" type="submit">
        Save & Continue
      </Button>
    </div>
  );
};

export default FormActionButtons;

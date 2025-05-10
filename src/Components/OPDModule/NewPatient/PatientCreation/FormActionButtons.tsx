import {Button} from 'react-bootstrap';
import ConfirmationButton from '../../../../common/ConfirmationButton';
import classNames from 'classnames';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark'
  | 'link';

interface FormActionButtonsProps {
  onClear: () => Promise<void> | void;
  onSave?: () => void;
  position?: 'left' | 'center' | 'right';
  clearButtonText?: string;
  saveButtonText?: string;
  clearButtonVariant?: ButtonVariant;
  saveButtonVariant?: ButtonVariant;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
  showClear?: boolean;
  showSave?: boolean;
}

const FormActionButtons = ({
  onClear,
  onSave,
  position = 'right',
  clearButtonText = 'Clear',
  saveButtonText = 'Save & Continue',
  clearButtonVariant = 'secondary',
  saveButtonVariant = 'primary',
  className = '',
  disabled = false,
  isLoading = false,
  showClear = true,
  showSave = true,
}: FormActionButtonsProps) => {
  const positionClass = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end',
  }[position];

  const containerClasses = classNames(
    'flex flex-wrap gap-2',
    positionClass,
    className
  );

  return (
    <div className={containerClasses}>
      {/* Clear Button (with confirmation) */}
      {showClear && (
        <ConfirmationButton
          buttonText={clearButtonText}
          title="Clear Form"
          message="Are you sure you want to clear this form?"
          confirmText={clearButtonText}
          cancelText="Cancel"
          onConfirm={onClear}
          variant={clearButtonVariant}
          disabled={disabled}
        />
      )}

      {/* Save Button */}
      {showSave && (
        <Button
          variant={saveButtonVariant}
          type="submit"
          onClick={onSave}
          disabled={disabled || isLoading}>
          {isLoading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              />
              {saveButtonText}
            </>
          ) : (
            saveButtonText
          )}
        </Button>
      )}
    </div>
  );
};

export default FormActionButtons;

import {useState} from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

interface DialogState {
  open: boolean;
  message: string | React.ReactNode;
  title: string;
  resolve: ((value: boolean) => void) | null;
}

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState<DialogState>({
    open: false,
    message: '',
    title: '',
    resolve: null,
  });

  const confirm = (
    title: string,
    message: string | React.ReactNode
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setDialogState({open: true, title, message, resolve});
    });
  };

  const handleClose = () => {
    if (dialogState.resolve) {
      dialogState.resolve(false);
    }
    setDialogState((prev) => ({...prev, open: false}));
  };

  const handleConfirm = () => {
    if (dialogState.resolve) {
      dialogState.resolve(true);
    }
    setDialogState((prev) => ({...prev, open: false}));
  };

  const ConfirmDialogComponent: React.FC = () => (
    <ConfirmDialog
      show={dialogState.open}
      onClose={handleClose}
      onConfirm={handleConfirm}
      title={dialogState.title}
      message={dialogState.message}
    />
  );

  return {confirm, ConfirmDialogComponent};
};

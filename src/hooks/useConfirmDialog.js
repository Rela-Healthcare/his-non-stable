import {useState} from 'react';
import ConfirmDialog from '../common/ConfirmDialog';

export const useConfirmDialog = () => {
  const [dialogState, setDialogState] = useState({
    open: false,
    message: '',
    title: '',
    resolve: null,
  });

  const confirm = (title, message) => {
    return new Promise((resolve) => {
      setDialogState({open: true, title, message, resolve});
    });
  };

  const handleClose = () => {
    dialogState.resolve(false);
    setDialogState((prev) => ({...prev, open: false}));
  };

  const handleConfirm = () => {
    dialogState.resolve(true);
    setDialogState((prev) => ({...prev, open: false}));
  };

  const ConfirmDialogComponent = () => (
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

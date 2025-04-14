import {Modal} from 'react-bootstrap';
import {motion} from 'framer-motion';

const ConfirmDialog = ({
  show,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'Do you really want to perform this action?',
  confirmText = 'Yes',
  cancelText = 'Cancel',
}) => {
  return (
    <Modal
      show={show}
      onHide={onClose}
      centered
      backdrop="static"
      keyboard={false}>
      <motion.div
        initial={{opacity: 0, scale: 0.85}}
        animate={{opacity: 1, scale: 1}}
        transition={{duration: 0.25}}
        className="bg-white rounded-xl p-6 shadow-lg max-w-md w-full mx-auto">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-4 font-semibold">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition">
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-md transition">
            {confirmText}
          </button>
        </div>
      </motion.div>
    </Modal>
  );
};

export default ConfirmDialog;

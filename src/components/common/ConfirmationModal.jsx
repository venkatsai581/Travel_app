import {
  AlertTriangle
} from "lucide-react";

import Modal from "./Modal.jsx";

import Button from "./Button.jsx";

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  loading = false
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="small"
    >
      <div className="confirmation-content">
        <div className="confirmation-icon">
          <AlertTriangle size={24} />
        </div>

        <h4>
          {title}
        </h4>

        <p>
          {message}
        </p>

        <div className="confirmation-actions">
          <Button
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            {cancelText}
          </Button>

          <Button
            variant="danger"
            onClick={onConfirm}
            loading={loading}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ConfirmationModal;
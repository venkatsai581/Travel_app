import {
  CheckCircle2,
  AlertCircle,
  Info,
  X
} from "lucide-react";

function Toast({
  message,
  type = "success",
  onClose
}) {
  if (!message) {
    return null;
  }

  const icons = {
    success: <CheckCircle2 size={19} />,
    error: <AlertCircle size={19} />,
    info: <Info size={19} />
  };

  return (
    <div
      className={`toast toast-${type}`}
    >
      <div className="toast-icon">
        {icons[type]}
      </div>

      <span>
        {message}
      </span>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
}

export default Toast;
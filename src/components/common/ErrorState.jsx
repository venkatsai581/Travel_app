import {
  AlertCircle,
  RefreshCw
} from "lucide-react";

function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load this information.",
  onRetry
}) {
  return (
    <div className="error-state">
      <div className="error-state-icon">
        <AlertCircle size={27} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="error-retry-button"
          onClick={onRetry}
        >
          <RefreshCw size={15} />

          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
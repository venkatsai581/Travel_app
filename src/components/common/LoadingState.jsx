import {
  Loader2
} from "lucide-react";

function LoadingState({
  message = "Loading..."
}) {
  return (
    <div className="loading-state">
      <Loader2 className="loading-spinner" />

      <span>
        {message}
      </span>
    </div>
  );
}

export default LoadingState;
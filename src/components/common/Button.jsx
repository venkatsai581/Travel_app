import {
  Loader2
} from "lucide-react";

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "medium",
  icon = null,
  loading = false,
  disabled = false,
  onClick,
  className = ""
}) {
  return (
    <button
      type={type}
      className={`app-button app-button-${variant} app-button-${size} ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <Loader2
          size={17}
          className="button-spinner"
        />
      ) : (
        icon
      )}

      <span>{children}</span>
    </button>
  );
}

export default Button;
import {
  Inbox
} from "lucide-react";

function EmptyState({
  title = "No data found",
  message = "There is nothing to display here.",
  action = null
}) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        <Inbox size={27} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {action && (
        <div className="empty-state-action">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
function StatusBadge({
  status
}) {
  if (!status) {
    return null;
  }

  const normalizedStatus =
    status
      .toLowerCase()
      .replace(/\s+/g, "-");

  return (
    <span
      className={`status-badge status-${normalizedStatus}`}
    >
      <span className="status-dot" />

      {status}
    </span>
  );
}

export default StatusBadge;
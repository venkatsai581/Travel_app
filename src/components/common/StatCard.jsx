function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendType = "positive"
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">
          {icon}
        </div>

        {trend && (
          <span
            className={`stat-trend ${trendType}`}
          >
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-content">
        <span className="stat-card-title">
          {title}
        </span>

        <strong className="stat-card-value">
          {value}
        </strong>

        {description && (
          <span className="stat-card-description">
            {description}
          </span>
        )}
      </div>
    </div>
  );
}

export default StatCard;
import "./SummaryCard.css";

/**
 * icon: optional icon component from Icons.jsx, rendered on the right.
 * label: e.g. "Total Employees"
 * value: e.g. 42
 */
export default function SummaryCard({ icon: Icon, label, value }) {
  return (
    <div className="summary-card">
      <div className="summary-card-text">
        <span className="summary-card-label">{label}</span>
        <span className="summary-card-value">{value}</span>
      </div>
      {Icon && (
        <span className="summary-card-icon">
          <Icon />
        </span>
      )}
    </div>
  );
}

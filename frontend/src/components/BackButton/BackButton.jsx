import "./BackButton.css";

export default function BackButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`back-button ${className}`}
      aria-label="Go back"
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
    </button>
  );
}

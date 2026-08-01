import "./GradientButton.css";

/**
 * Shared button: left-right gradient fill, top-bottom gradient border,
 * bold centred white text (styling spec Part 1.1). Use `as="link"` styling
 * is not needed - just render normally and pass onClick/type/disabled.
 */
export default function GradientButton({
  children,
  type = "button",
  onClick,
  disabled = false,
  className = "",
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`gradient-button ${className}`}
    >
      {children}
    </button>
  );
}

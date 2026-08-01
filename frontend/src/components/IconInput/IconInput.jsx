import { useState } from "react";
import { EyeOpenIcon, EyeClosedIcon } from "../Icons";
import "./IconInput.css";

/**
 * Shared text/password input: label above, icon on the far left inside the
 * field, rounded corners, consistent placeholder/border/background colours
 * (see styling spec Part 1.2). Pass `icon` as one of the components from
 * Icons.jsx (e.g. UserIcon, LockIcon, MailIcon).
 *
 * For type="password", a show/hide eye toggle is added automatically on
 * the right side of the field.
 */
export default function IconInput({
  id,
  name,
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (visible ? "text" : "password") : type;

  return (
    <div className="icon-input-group">
      {label && (
        <label htmlFor={id} className="icon-input-label">
          {label}
        </label>
      )}
      <div className="icon-input-wrapper">
        {Icon && (
          <span className="icon-input-icon">
            <Icon />
          </span>
        )}
        <input
          id={id}
          name={name}
          type={resolvedType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className="icon-input-field"
        />
        {isPassword && (
          <button
            type="button"
            className="icon-input-eye-toggle"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? <EyeOpenIcon /> : <EyeClosedIcon />}
          </button>
        )}
      </div>
    </div>
  );
}

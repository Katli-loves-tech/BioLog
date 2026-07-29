import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../services/api";

// Lets an Admin or HR user reset their password by re-verifying their
// identity (employee number + ID number), same pattern as Register.jsx.
export default function ForgotPassword() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      await forgotPassword({ employeeNumber, idNumber, newPassword });
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Forgot Password</h1>
      <p>Verify your identity to set a new password.</p>

      <label>
        Employee Number
        <input
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          required
        />
      </label>

      <label>
        ID Number
        <input
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          required
        />
      </label>

      <label>
        New Password
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          minLength={8}
        />
      </label>

      <label>
        Confirm New Password
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
        />
      </label>

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Reset Password"}
      </button>
    </form>
  );
}

import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../../../styles/auth-common.css";
import BackButton from "../../../components/BackButton/BackButton";
import IconInput from "../../../components/IconInput/IconInput";
import Modal from "../../../components/Modal/Modal";
import FaceScanner from "../../../components/FaceScanner/FaceScanner";
import { UserIcon, LockIcon, CardIcon } from "../../../components/Icons";
import { setPassword } from "../../../services/api";

const COPY = {
  register: {
    heading: "Create Your Account",
    subheading: "Register to access the BioLog System",
    idLabel: "ID Number",
    idPlaceholder: "Enter ID Number",
    passwordLabel: "New Password",
    passwordPlaceholder: "Enter New Password",
  },
  reset: {
    heading: "Reset your password",
    subheading: "Verify your identity to reset password",
    idLabel: "ID Number",
    idPlaceholder: "Enter ID Number",
    passwordLabel: "New Password",
    passwordPlaceholder: "Enter New Password",
  },
};

export default function AccountSetup() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") === "reset" ? "reset" : "register";
  const copy = COPY[mode];

  const [employeeNumber, setEmployeeNumber] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showScanner, setShowScanner] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const validateBeforeScan = () => {
    if (!employeeNumber || !idNumber) {
      setError("Enter your Employee Number and ID Number first.");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return false;
    }
    setError("");
    return true;
  };

  const handleFaceIdClick = () => {
    if (validateBeforeScan()) {
      setShowScanner(true);
    }
  };

  const handleCapture = async (faceVector) => {
    if (!faceVector) return; // Retake pressed - wait for a real capture.

    setSubmitting(true);
    setError("");
    try {
      const result = await setPassword(employeeNumber, idNumber, password, confirmPassword, faceVector);
      setShowScanner(false);

      // Backend is expected to return the identity/role on a successful
      // face match, matching how Login.jsx stores the session.
      if (result?.token) {
        localStorage.setItem("token", result.token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            employeeNumber: result.employeeNumber,
            fullName: result.fullName,
            role: result.role,
          })
        );
        navigate(result.role === "HR" ? "/hr/dashboard" : "/admin/dashboard");
      } else {
        // Backend contract for this isn't confirmed yet - fall back to
        // sending them to log in normally rather than leaving them stuck.
        navigate("/login");
      }
    } catch (err) {
      setError(err.data || "Face verification failed. Please try again.");
      setShowScanner(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <BackButton className="auth-back-button" onClick={() => navigate("/login")} />

      <h1 className="auth-heading">{copy.heading}</h1>
      <p className="auth-subheading">{copy.subheading}</p>

      <div className="auth-form-content">
        {error && <div className="auth-error">{error}</div>}

        <IconInput
          id="employeeNumber"
          label="Employee Number"
          icon={UserIcon}
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          placeholder="Enter Employee Number"
          required
        />

        <IconInput
          id="idNumber"
          label={copy.idLabel}
          icon={CardIcon}
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          placeholder={copy.idPlaceholder}
          required
        />

        <IconInput
          id="password"
          label={copy.passwordLabel}
          icon={LockIcon}
          type="password"
          value={password}
          onChange={(e) => setPasswordValue(e.target.value)}
          placeholder={copy.passwordPlaceholder}
          required
        />

        <IconInput
          id="confirmPassword"
          label="Confirm Password"
          icon={LockIcon}
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
        />

        <div className="auth-secondary-row">
          <button type="button" className="auth-link" onClick={handleFaceIdClick}>
            Face ID
          </button>
        </div>
      </div>

      <Modal open={showScanner} onClose={() => setShowScanner(false)} title="Verify your face">
        <FaceScanner onCapture={handleCapture} />
        {submitting && <p>Verifying...</p>}
      </Modal>
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterEmployee.css";
import IconInput from "../../../components/IconInput/IconInput";
import GradientButton from "../../../components/GradientButton/GradientButton";
import Modal from "../../../components/Modal/Modal";
import FaceScanner from "../../../components/FaceScanner/FaceScanner";
import { ProfileIcon, UserIcon, CardIcon, MailIcon, CameraIcon } from "../../../components/Icons";
import { registerEmployee, setFaceVector } from "../../../services/api";

const EMPTY_FORM = {
  employeeNumber: "",
  firstName: "",
  lastName: "",
  idNumber: "",
  role: "Employee",
  department: "",
  contactNumber: "",
  email: "",
  gender: "",
};

export default function RegisterEmployee() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [faceVector, setFaceVectorState] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCapture = (descriptor) => {
    setFaceVectorState(descriptor);
    if (descriptor) setShowScanner(false);
  };

  const handleCancel = () => {
    setFormData(EMPTY_FORM);
    setFaceVectorState(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const result = await registerEmployee(formData);
      const empNo = result.employeeNumber || formData.employeeNumber;

      if (faceVector) {
        try {
          await setFaceVector(empNo, faceVector);
        } catch (faceErr) {
          console.warn("Face vector upload failed (can be done later):", faceErr);
        }
      }

      setSuccess(`Employee ${empNo} registered successfully!`);
      handleCancel();
    } catch (err) {
      setError(err.data || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-employee-page">
      <header className="dashboard-header">
        <h1>Register New Employee</h1>
        <div className="dashboard-header-profile">
          <ProfileIcon className="dashboard-header-profile-icon" />
          <div className="dashboard-header-profile-text">
            <span className="dashboard-header-role">System Admin</span>
            <span className="dashboard-header-name">{user.fullName || "Admin"}</span>
          </div>
        </div>
      </header>
      <p className="register-employee-subtitle">Fill in the details to register a new employee</p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <form className="register-employee-form" onSubmit={handleSubmit}>
        <div className="form-row-double">
          <IconInput
            id="firstName"
            name="firstName"
            label="First Name"
            icon={UserIcon}
            value={formData.firstName}
            onChange={handleChange}
            placeholder="Enter first name"
            required
          />
          <IconInput
            id="lastName"
            name="lastName"
            label="Last Name"
            icon={UserIcon}
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Enter last name"
            required
          />
        </div>

        <div className="form-row-double">
          <IconInput
            id="idNumber"
            name="idNumber"
            label="ID Number"
            icon={CardIcon}
            value={formData.idNumber}
            onChange={handleChange}
            placeholder="South African ID number"
            required
          />
          <div className="icon-input-group">
            <label htmlFor="role" className="icon-input-label">Role</label>
            <div className="icon-input-wrapper">
              <span className="icon-input-icon"><CardIcon /></span>
              <select id="role" name="role" value={formData.role} onChange={handleChange} className="icon-input-field register-employee-select">
                <option value="Employee">Employee</option>
                <option value="HR">HR</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-row-double">
          <IconInput
            id="department"
            name="department"
            label="Department"
            value={formData.department}
            onChange={handleChange}
            placeholder="e.g. Engineering"
          />
          <IconInput
            id="contactNumber"
            name="contactNumber"
            label="Contact Number"
            value={formData.contactNumber}
            onChange={handleChange}
            placeholder="e.g. 071 234 5678"
          />
        </div>

        <div className="form-row-final">
          <div className="form-row-final-left">
            <IconInput
              id="email"
              name="email"
              label="Email"
              icon={MailIcon}
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="employee@company.com"
            />
            <div className="icon-input-group">
              <label htmlFor="gender" className="icon-input-label">Gender</label>
              <div className="icon-input-wrapper">
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="icon-input-field register-employee-select">
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row-final-right">
            <span className="icon-input-label">Face Vector (Biometrics)</span>
            <button
              type="button"
              className="register-employee-face-btn"
              onClick={() => setShowScanner(true)}
            >
              <CameraIcon />
              <span>{faceVector ? "Retake Face" : "Capture Face"}</span>
            </button>
            <p className="register-employee-face-hint">
              {faceVector ? "Face captured successfully." : "Use camera to capture employee's face"}
            </p>
          </div>
        </div>

        <div className="register-employee-actions">
          <button type="button" className="register-employee-cancel-btn" onClick={handleCancel}>
            Cancel
          </button>
          <GradientButton type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </GradientButton>
        </div>
      </form>

      <Modal open={showScanner} onClose={() => setShowScanner(false)} title="Capture employee's face">
        <FaceScanner onCapture={handleCapture} />
      </Modal>
    </div>
  );
}

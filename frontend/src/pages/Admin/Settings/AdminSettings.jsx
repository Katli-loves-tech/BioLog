import { useState } from "react";
import { changePassword, updateAdminInfo } from "../../../services/api";

export default function AdminSettings() {
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");

  const [infoForm, setInfoForm] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
  });
  const [infoError, setInfoError] = useState("");
  const [infoSuccess, setInfoSuccess] = useState("");

  const handlePasswordChange = (field, value) => {
    setPasswordForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      await changePassword(passwordForm);
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleInfoChange = (field, value) => {
    setInfoForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleInfoSubmit = async (e) => {
    e.preventDefault();
    setInfoError("");
    setInfoSuccess("");

    try {
      await updateAdminInfo(infoForm);
      setInfoSuccess("Information updated successfully.");
    } catch (err) {
      setInfoError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Settings</h1>

      <section>
        <h2>Change Password</h2>
        {passwordError && <p role="alert">{passwordError}</p>}
        {passwordSuccess && <p>{passwordSuccess}</p>}
        <form onSubmit={handlePasswordSubmit}>
          <label>
            Current Password
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) => handlePasswordChange("currentPassword", e.target.value)}
              required
            />
          </label>

          <label>
            New Password
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => handlePasswordChange("newPassword", e.target.value)}
              required
              minLength={8}
            />
          </label>

          <label>
            Confirm New Password
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => handlePasswordChange("confirmPassword", e.target.value)}
              required
              minLength={8}
            />
          </label>

          <button type="submit">Update Password</button>
        </form>
      </section>

      <section>
        <h2>Update Information</h2>
        {infoError && <p role="alert">{infoError}</p>}
        {infoSuccess && <p>{infoSuccess}</p>}
        <form onSubmit={handleInfoSubmit}>
          <label>
            First Name
            <input
              value={infoForm.firstName}
              onChange={(e) => handleInfoChange("firstName", e.target.value)}
            />
          </label>

          <label>
            Last Name
            <input
              value={infoForm.lastName}
              onChange={(e) => handleInfoChange("lastName", e.target.value)}
            />
          </label>

          <label>
            Contact Number
            <input
              value={infoForm.contactNumber}
              onChange={(e) => handleInfoChange("contactNumber", e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={infoForm.email}
              onChange={(e) => handleInfoChange("email", e.target.value)}
            />
          </label>

          <button type="submit">Save Changes</button>
        </form>
      </section>
    </div>
  );
}

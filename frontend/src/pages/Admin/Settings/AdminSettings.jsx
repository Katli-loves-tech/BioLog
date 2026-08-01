import { useState } from "react";
import "./AdminSettings.css";
import IconInput from "../../../components/IconInput/IconInput";
import GradientButton from "../../../components/GradientButton/GradientButton";
import { UserIcon, LockIcon } from "../../../components/Icons";
import { changePassword, updateProfile } from "../../../services/api";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [fullName, setFullName] = useState(user.fullName || "");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    setProfileLoading(true);
    try {
      const result = await updateProfile(fullName);
      localStorage.setItem("user", JSON.stringify({ ...user, fullName }));
      setProfileMsg(result?.message || "Profile updated successfully.");
    } catch (err) {
      setProfileError(err.data || "Failed to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    if (newPassword !== confirmNewPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      const result = await changePassword(currentPassword, newPassword, confirmNewPassword);
      setPasswordMsg(result?.message || "Password changed successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (err) {
      setPasswordError(err.data || "Failed to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h1>Admin Settings</h1>

      <div className="settings-tabs">
        <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>
          Profile
        </button>
        <button className={activeTab === "password" ? "active" : ""} onClick={() => setActiveTab("password")}>
          Change Password
        </button>
      </div>

      {activeTab === "profile" && (
        <form className="settings-form" onSubmit={handleProfileUpdate}>
          {profileMsg && <div className="auth-success">{profileMsg}</div>}
          {profileError && <div className="auth-error">{profileError}</div>}
          <IconInput
            id="employeeNumber"
            label="Employee Number"
            value={user.employeeNumber || ""}
            onChange={() => {}}
            disabled
          />
          <IconInput id="role" label="Role" value={user.role || ""} onChange={() => {}} disabled />
          <IconInput
            id="fullName"
            label="Full Name"
            icon={UserIcon}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
            required
          />
          <GradientButton type="submit" disabled={profileLoading}>
            {profileLoading ? "Saving..." : "Save Changes"}
          </GradientButton>
        </form>
      )}

      {activeTab === "password" && (
        <form className="settings-form" onSubmit={handlePasswordChange}>
          {passwordMsg && <div className="auth-success">{passwordMsg}</div>}
          {passwordError && <div className="auth-error">{passwordError}</div>}
          <IconInput
            id="currentPassword"
            label="Current Password"
            icon={LockIcon}
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Enter current password"
            required
          />
          <IconInput
            id="newPassword"
            label="New Password"
            icon={LockIcon}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            required
          />
          <IconInput
            id="confirmNewPassword"
            label="Confirm New Password"
            icon={LockIcon}
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            placeholder="Confirm new password"
            required
          />
          <GradientButton type="submit" disabled={passwordLoading}>
            {passwordLoading ? "Changing..." : "Change Password"}
          </GradientButton>
        </form>
      )}
    </div>
  );
}

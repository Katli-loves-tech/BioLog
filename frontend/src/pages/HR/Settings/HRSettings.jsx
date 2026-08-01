import { useState } from "react";
import "../../Admin/Settings/AdminSettings.css";
import IconInput from "../../../components/IconInput/IconInput";
import GradientButton from "../../../components/GradientButton/GradientButton";
import { UserIcon, LockIcon, MailIcon } from "../../../components/Icons";

// NOTE: reuses AdminSettings.css since both pages follow the exact same
// "default styling" per the spec - only the page heading differs.
export default function HRSettings() {
  const [activeTab, setActiveTab] = useState("updateInfo");

  const [name, setName] = useState("HR Admin");
  const [email, setEmail] = useState("hradmin@company.com");
  const [phone, setPhone] = useState("+27 12 345 6789");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateInfo = (e) => {
    e.preventDefault();
    alert("Information updated successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="settings-page">
      <h1>HR Settings</h1>

      <div className="settings-tabs">
        <button className={activeTab === "updateInfo" ? "active" : ""} onClick={() => setActiveTab("updateInfo")}>
          Update Information
        </button>
        <button className={activeTab === "changePassword" ? "active" : ""} onClick={() => setActiveTab("changePassword")}>
          Change Password
        </button>
      </div>

      {activeTab === "updateInfo" && (
        <form className="settings-form" onSubmit={handleUpdateInfo}>
          <IconInput id="name" label="Full Name" icon={UserIcon} value={name} onChange={(e) => setName(e.target.value)} required />
          <IconInput id="email" label="Email Address" icon={MailIcon} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <IconInput id="phone" label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <GradientButton type="submit">Save Changes</GradientButton>
        </form>
      )}

      {activeTab === "changePassword" && (
        <form className="settings-form" onSubmit={handleChangePassword}>
          <IconInput id="currentPassword" label="Current Password" icon={LockIcon} type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required />
          <IconInput id="newPassword" label="New Password" icon={LockIcon} type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
          <IconInput id="confirmPassword" label="Confirm New Password" icon={LockIcon} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          <GradientButton type="submit">Change Password</GradientButton>
        </form>
      )}
    </div>
  );
}

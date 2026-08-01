import { BioLogLogo, AuthTypesIcon } from "../Icons";
import "./AuthSidebar.css";

export default function AuthSidebar() {
  return (
    <aside className="auth-sidebar">
      <div className="auth-sidebar-brand">
        <BioLogLogo className="auth-sidebar-logo" />
        <span className="auth-sidebar-brand-text">BioLog</span>
      </div>

      <div className="auth-sidebar-tagline">
        <p className="auth-sidebar-tagline-primary">Secure Workforce.</p>
        <p className="auth-sidebar-tagline-secondary">Smarter Attendance.</p>
        <p className="auth-sidebar-tagline-body">
          Advanced biometric authentication for a more secure and efficient workplace.
        </p>
      </div>

      <div className="auth-sidebar-illustration">
        <AuthTypesIcon className="auth-sidebar-illustration-img" />
      </div>
    </aside>
  );
}

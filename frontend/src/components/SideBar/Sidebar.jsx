import { NavLink, useNavigate } from "react-router-dom";
import { BioLogLogo, LogoutIcon } from "../Icons";
import "./Sidebar.css";

/**
 * Shared sidebar for both Admin and HR layouts (Styling Part 2.2).
 * navItems: [{ to, label, icon: IconComponent }]
 * Active-route highlighting comes from NavLink itself, so the "stays
 * highlighted until you navigate elsewhere" behaviour from the spec is
 * automatic rather than manually tracked state.
 */
export default function Sidebar({ navItems }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="app-sidebar">
      <div className="app-sidebar-brand">
        <BioLogLogo className="app-sidebar-logo" />
        <span className="app-sidebar-brand-text">BioLog</span>
      </div>

      <ul className="app-sidebar-nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) => `app-sidebar-link ${isActive ? "active" : ""}`}
            >
              <Icon className="app-sidebar-link-icon" />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>

      <button type="button" className="app-sidebar-logout" onClick={handleLogout}>
        <LogoutIcon className="app-sidebar-logout-icon" />
        <span>Logout</span>
      </button>
    </nav>
  );
}

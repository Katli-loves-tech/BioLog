import { NavLink, useNavigate } from "react-router-dom";

// Shared between AdminDashboard, RegisterEmployee, and AdminSettings so it
// stays active/visible across all three pages, per the spec.
export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // TODO: clear auth/session state once real authentication exists.
    navigate("/login");
  };

  return (
    <nav>
      <NavLink to="/admin/dashboard">Dashboard</NavLink>
      <NavLink to="/admin/register-employee">Register Employee</NavLink>
      <NavLink to="/admin/settings">Settings</NavLink>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

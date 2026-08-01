import { Outlet } from "react-router-dom";
import Sidebar from "../SideBar/Sidebar";
import { HouseIcon, MultipleUsersIcon, GearIcon } from "../Icons";
import "./DashboardLayout.css";

const ADMIN_NAV_ITEMS = [
  { to: "/admin/dashboard", label: "Dashboard", icon: HouseIcon },
  { to: "/admin/register-employee", label: "Register Employee", icon: MultipleUsersIcon },
  { to: "/admin/settings", label: "Settings", icon: GearIcon },
];

export default function AdminLayout() {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-layout-sidebar">
        <Sidebar navItems={ADMIN_NAV_ITEMS} />
      </div>
      <main className="dashboard-layout-content">
        <Outlet />
      </main>
    </div>
  );
}

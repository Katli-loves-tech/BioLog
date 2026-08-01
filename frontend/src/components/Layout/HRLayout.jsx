import { Outlet } from "react-router-dom";
import Sidebar from "../SideBar/Sidebar";
import { HouseIcon, GearIcon } from "../Icons";
import "./DashboardLayout.css";

const HR_NAV_ITEMS = [
  { to: "/hr/dashboard", label: "Dashboard", icon: HouseIcon },
  { to: "/hr/settings", label: "Settings", icon: GearIcon },
];

export default function HRLayout() {
  return (
    <div className="dashboard-layout">
      <div className="dashboard-layout-sidebar">
        <Sidebar navItems={HR_NAV_ITEMS} />
      </div>
      <main className="dashboard-layout-content">
        <Outlet />
      </main>
    </div>
  );
}

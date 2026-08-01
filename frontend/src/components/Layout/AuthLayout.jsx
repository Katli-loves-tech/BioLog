import { Outlet } from "react-router-dom";
import AuthSidebar from "../SideBar/AuthSidebar";
import "./AuthLayout.css";

export default function AuthLayout() {
  return (
    <div className="auth-layout">
      <div className="auth-layout-sidebar">
        <AuthSidebar />
      </div>
      <main className="auth-layout-content">
        <Outlet />
      </main>
    </div>
  );
}

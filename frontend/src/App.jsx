import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";

import AdminLayout from "./components/Layout/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import RegisterEmployee from "./pages/Admin/RegisterEmployee/RegisterEmployee";
import AdminSettings from "./pages/Admin/Settings/AdminSettings";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* AdminLayout renders the sidebar once and keeps it mounted while
            Outlet swaps between Dashboard / RegisterEmployee / Settings. */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="register-employee" element={<RegisterEmployee />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* No auth/route-guarding yet — per today's decision, everything
            defaults to the admin dashboard until real auth is wired in. */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

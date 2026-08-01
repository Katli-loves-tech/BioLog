import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import AuthLayout from "./components/Layout/AuthLayout";
import AdminLayout from "./components/Layout/AdminLayout";
import HRLayout from "./components/Layout/HRLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Login from "./pages/Auth/Login/Login";
import AccountSetup from "./pages/Auth/AccountSetup/AccountSetup";

import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import RegisterEmployee from "./pages/Admin/RegisterEmployee/RegisterEmployee";
import AdminSettings from "./pages/Admin/Settings/AdminSettings";

import HRDashboard from "./pages/HR/Dashboard/HRDashboard";
import HRSettings from "./pages/HR/Settings/HRSettings";

// NOTE on role strings: different parts of the codebase have referred to
// the admin role as both "Admin" and "Superadmin" at different points.
// Both are allowed here so neither breaks - but the team should settle on
// one canonical string with the backend and use it everywhere (the JWT's
// role claim, RegisterEmployee's role dropdown, and this list all need to
// agree). See the chat response for this flag.
const ADMIN_ROLES = ["Admin", "Superadmin"];
const HR_ROLES = ["HR"];

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/account-setup" element={<AccountSetup />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={ADMIN_ROLES} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="register-employee" element={<RegisterEmployee />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={HR_ROLES} />}>
          <Route path="/hr" element={<HRLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<HRDashboard />} />
            <Route path="settings" element={<HRSettings />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

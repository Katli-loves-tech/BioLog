import { Navigate, Outlet } from "react-router-dom";

/**
 * Wrap route elements that require a logged-in user, optionally restricted
 * to specific roles.
 *
 *   <Route element={<ProtectedRoute allowedRoles={["Admin", "Superadmin"]} />}>
 *     <Route path="/admin" element={<AdminLayout />}>...</Route>
 *   </Route>
 *
 * NOTE: this only checks localStorage, since real auth/session handling is
 * intentionally deferred for early-phase testing. Swap the `isAuthenticated`
 * check for a real token-validity check once the backend supports it.
 */
export default function ProtectedRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const isAuthenticated = Boolean(token && user);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Logged in, but wrong role for this section - bounce to their own
    // dashboard rather than a dead end.
    const fallback = user.role === "HR" ? "/hr/dashboard" : "/admin/dashboard";
    return <Navigate to={fallback} replace />;
  }

  return children ?? <Outlet />;
}

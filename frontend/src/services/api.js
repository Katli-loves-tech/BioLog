// Centralized API layer.
//
// All frontend pages call functions from this file instead of using fetch()
// directly. That way, when the real backend routes/response shapes are
// confirmed with the backend team, there is exactly one place to update.
//
// Set VITE_API_BASE_URL in a .env file at the project root, e.g.:
//   VITE_API_BASE_URL=https://localhost:5001/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    // Try to read a structured error message from the backend, fall back
    // to a generic one if the response isn't JSON.
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) return null; // No Content
  return response.json();
}

// ---------------------------------------------------------------------------
// Auth
// TODO: endpoint paths below are assumptions — confirm against the backend
// team's actual route names once they're available. No JWT/session handling
// is wired up yet, per the "skip auth for now" decision.
// ---------------------------------------------------------------------------

export function loginUser(employeeNumber, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ employeeNumber, password }),
  });
}

// Used by Register.jsx. Backend must verify employeeNumber + idNumber match
// an existing Employee record (created earlier by an Admin) before setting
// the password.
export function registerUser({ employeeNumber, idNumber, password }) {
  return request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ employeeNumber, idNumber, password }),
  });
}

// Used by ForgotPassword.jsx (both Admins and HR).
export function forgotPassword({ employeeNumber, idNumber, newPassword }) {
  return request("/auth/forgot-password", {
    method: "POST",
    body: JSON.stringify({ employeeNumber, idNumber, newPassword }),
  });
}

// Used by AdminSettings.jsx.
export function changePassword({ currentPassword, newPassword }) {
  // TODO: needs the logged-in user's employeeNumber once real auth exists.
  return request("/auth/change-password", {
    method: "POST",
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------

export function getEmployees() {
  return request("/employees");
}

// Used by RegisterEmployee.jsx. Note: FaceVector is intentionally NOT sent
// here — it's captured later via the mobile app's facial enrollment flow and
// matched back to this employee by employeeNumber.
export function createEmployee(employeeData) {
  return request("/employees", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });
}

// Used by AdminDashboard.jsx's "Update" action. Per the spec, IdNumber,
// FaceVector, Password, and Gender are excluded from what admins can edit here.
export function updateEmployee(employeeNumber, updates) {
  return request(`/employees/${employeeNumber}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });
}

export function deleteEmployee(employeeNumber) {
  return request(`/employees/${employeeNumber}`, {
    method: "DELETE",
  });
}

// ---------------------------------------------------------------------------
// Admin / HR self-service
// ---------------------------------------------------------------------------

// Used by AdminSettings.jsx "Update Information" section.
export function updateAdminInfo(infoData) {
  // TODO: needs the logged-in user's employeeNumber once real auth exists.
  return request("/admin/me", {
    method: "PUT",
    body: JSON.stringify(infoData),
  });
}

// Centralized API layer. Every page calls functions from here instead of
// using fetch() directly.
//
// Merged from the two earlier api.js drafts per team decisions:
//  - Vite env var convention (VITE_API_BASE_URL), not CRA's process.env
//  - Bearer-token auth wired in (real early-phase testing decision, kept)
//  - ApiError class with a .data property, since every page's catch block
//    already reads err.data
//  - Field names/casing sent to the backend match the CRA draft (camelCase,
//    as-is from form state), since that was the version tested against the
//    backend
//  - Function names/signatures follow the CRA draft as canonical
//
// Set VITE_API_BASE_URL in a .env file at the project root, e.g.:
//   VITE_API_BASE_URL=https://localhost:5001/api
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://biolog.onrender.com/api";

export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.text();
    } catch {
      errorData = null;
    }
    throw new ApiError(
      errorData || `Request failed with status ${response.status}`,
      response.status,
      errorData
    );
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------

export async function login(employeeNumber, password) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ employeeNumber, password }),
  });
}

// Used by the merged AccountSetup page (mode="register" | "reset").
// TODO/FLAG: faceVector is a new parameter added for the "verify face on
// activation/reset" decision - this is not yet confirmed against a live
// backend contract. Confirm the shape with the backend team; they said
// they'll adjust their side once the frontend face-capture flow works.
export async function setPassword(employeeNumber, idNumber, password, confirmPassword, faceVector) {
  return request("/auth/set-password", {
    method: "POST",
    body: JSON.stringify({ employeeNumber, idNumber, password, confirmPassword, faceVector }),
  });
}

export async function changePassword(currentPassword, newPassword, confirmNewPassword) {
  return request("/auth/change-password", {
    method: "PUT",
    body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
  });
}

export async function updateProfile(fullName) {
  return request("/auth/profile", {
    method: "PUT",
    body: JSON.stringify({ fullName }),
  });
}

// ---------------------------------------------------------------------------
// Employees
// ---------------------------------------------------------------------------

export async function getEmployees() {
  return request("/employees");
}

export async function getEmployee(empNo) {
  return request(`/employees/${empNo}`);
}

export async function registerEmployee(employeeData) {
  return request("/employees/register", {
    method: "POST",
    body: JSON.stringify(employeeData),
  });
}

export async function updateEmployee(empNo, employeeData) {
  return request(`/employees/${empNo}`, {
    method: "PUT",
    body: JSON.stringify(employeeData),
  });
}

export async function deleteEmployee(empNo) {
  return request(`/employees/${empNo}`, {
    method: "DELETE",
  });
}

export async function promoteToHr(empNo) {
  return request(`/employees/${empNo}/promote-to-hr`, {
    method: "POST",
  });
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------

export async function clockIn(empNo) {
  return request(`/attendance/clock-in/${empNo}`, {
    method: "POST",
  });
}

export async function clockOut(empNo) {
  return request(`/attendance/clock-out/${empNo}`, {
    method: "POST",
  });
}

export async function getAttendanceHistory(empNo) {
  return request(`/attendance/${empNo}`);
}

export async function getHoursWorked(empNo) {
  return request(`/attendance/hours-worked/${empNo}`);
}

// ---------------------------------------------------------------------------
// Reports
// ---------------------------------------------------------------------------

export async function getHrDashboardSummary(date) {
  const params = date ? `?date=${date}` : "";
  return request(`/reports/hr-summary${params}`);
}

export async function getEmployeeHistory(empNo, from, to) {
  const params = new URLSearchParams();
  if (from) params.append("from", from);
  if (to) params.append("to", to);
  const query = params.toString();
  return request(`/reports/hr-summary/${empNo}${query ? `?${query}` : ""}`);
}

export async function getOrganisationReport() {
  return request("/reports/organisation");
}

// ---------------------------------------------------------------------------
// Face recognition
// ---------------------------------------------------------------------------

export async function setFaceVector(empNo, vector) {
  return request(`/employees/${empNo}/face-vector`, {
    method: "POST",
    body: JSON.stringify(vector),
  });
}

export async function verifyFace(empNo, vector, threshold = 0.85) {
  return request(`/employees/${empNo}/verify-face`, {
    method: "POST",
    body: JSON.stringify({ vector, threshold }),
  });
}

// ---------------------------------------------------------------------------
// Health check
// ---------------------------------------------------------------------------

export async function healthCheck() {
  return request("/health");
}

export default {
  login,
  setPassword,
  changePassword,
  updateProfile,
  getEmployees,
  getEmployee,
  registerEmployee,
  updateEmployee,
  deleteEmployee,
  promoteToHr,
  clockIn,
  clockOut,
  getAttendanceHistory,
  getHoursWorked,
  getHrDashboardSummary,
  getEmployeeHistory,
  getOrganisationReport,
  setFaceVector,
  verifyFace,
  healthCheck,
  ApiError,
};

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./HRDashboard.css";
import SummaryCard from "../../../components/SummaryCard/SummaryCard";
import EmployeeView from "./EmployeeView";
import {
  ProfileIcon,
  MultipleUsersIcon,
  LateIcon,
  PresentIcon,
  AbsentIcon,
} from "../../../components/Icons";
import { getHrDashboardSummary } from "../../../services/api";

const PREVIEW_ROWS = 6;

export default function HRDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getHrDashboardSummary();
      setSummary(data);
    } catch (err) {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const totalEmployees = summary?.totalEmployees || 0;
  const presentCount = summary?.presentCount || 0;
  const lateCount = summary?.lateCount || 0;
  const absentCount = summary?.absentCount || 0;
  const employees = summary?.employees || [];

  const visibleEmployees = expanded ? employees : employees.slice(0, PREVIEW_ROWS);

  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const statusClass = (status) => {
    const s = (status || "").toLowerCase();
    if (s === "present") return "status-present";
    if (s === "late") return "status-late";
    if (s === "absent") return "status-absent";
    return "";
  };

  return (
    <div className="hr-dashboard-page">
      <header className="dashboard-header">
        <h1>Employee Management</h1>
        <div className="dashboard-header-profile">
          <ProfileIcon className="dashboard-header-profile-icon" />
          <div className="dashboard-header-profile-text">
            <span className="dashboard-header-role">HR Manager</span>
            <span className="dashboard-header-name">{user.fullName || "HR Admin"}</span>
          </div>
        </div>
      </header>

      <div className="hr-summary-grid">
        <SummaryCard icon={MultipleUsersIcon} label="Total Employees" value={totalEmployees} />
        <SummaryCard icon={LateIcon} label="Late Today" value={lateCount} />
        <SummaryCard icon={PresentIcon} label="Present Today" value={presentCount} />
        <SummaryCard icon={AbsentIcon} label="Absent Today" value={absentCount} />
      </div>

      <h2 className="hr-section-title">Today's Attendance Overview</h2>

      {loading ? (
        <p className="dashboard-state-text">Loading dashboard data...</p>
      ) : error ? (
        <div className="dashboard-state-text">
          <p>{error}</p>
          <button onClick={fetchDashboardData}>Retry</button>
        </div>
      ) : (
        <>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                  <th>Duration</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="dashboard-table-empty">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  visibleEmployees.map((emp, index) => (
                    <tr key={emp.employeeNumber || index}>
                      <td>{emp.fullName}</td>
                      <td>{formatTime(emp.clockInTime)}</td>
                      <td>{formatTime(emp.clockOutTime)}</td>
                      <td>
                        <span className={`status-badge ${statusClass(emp.status)}`}>
                          {emp.status || "Unknown"}
                        </span>
                      </td>
                      <td>{emp.duration || "--:--"}</td>
                      <td>
                        <button
                          type="button"
                          className="hr-view-link"
                          onClick={() => setViewingEmployee(emp)}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {!expanded && employees.length > PREVIEW_ROWS && (
            <button type="button" className="hr-view-all-link" onClick={() => setExpanded(true)}>
              &lsaquo; View all reports
            </button>
          )}
        </>
      )}

      <EmployeeView
        employee={viewingEmployee}
        onClose={() => setViewingEmployee(null)}
      />
    </div>
  );
}

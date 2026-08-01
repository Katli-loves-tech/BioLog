import { useState, useEffect } from "react";
import Modal from "../../../components/Modal/Modal";
import { getEmployeeHistory } from "../../../services/api";

export default function EmployeeView({ employee, onClose }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employee) return;
    setLoading(true);
    setError("");
    getEmployeeHistory(employee.employeeNumber)
      .then((data) => setHistory(Array.isArray(data) ? data : []))
      .catch(() => setError("Failed to load this employee's report."))
      .finally(() => setLoading(false));
  }, [employee]);

  const formatTime = (timestamp) =>
    timestamp ? new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";

  return (
    <Modal
      open={Boolean(employee)}
      onClose={onClose}
      title={employee ? `${employee.fullName} (${employee.employeeNumber})` : ""}
    >
      {loading && <p>Loading report...</p>}
      {error && <div className="auth-error">{error}</div>}
      {!loading && !error && (
        <table className="employee-view-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="4">No history available.</td>
              </tr>
            ) : (
              history.map((h, i) => (
                <tr key={i}>
                  <td>{h.status || "-"}</td>
                  <td>{formatTime(h.clockInTime)}</td>
                  <td>{formatTime(h.clockOutTime)}</td>
                  <td>{h.duration || "--:--"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </Modal>
  );
}

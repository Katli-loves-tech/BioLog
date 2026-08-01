import { useState, useEffect, useMemo } from "react";
import "./AdminDashboard.css";
import Pagination from "../../../components/Pagination/Pagination";
import Modal from "../../../components/Modal/Modal";
import IconInput from "../../../components/IconInput/IconInput";
import GradientButton from "../../../components/GradientButton/GradientButton";
import { ProfileIcon, EditIcon, BinIcon, UserIcon, MailIcon } from "../../../components/Icons";
import { getEmployees, deleteEmployee, updateEmployee } from "../../../services/api";

const PAGE_SIZE = 6;

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [editingEmployee, setEditingEmployee] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError("Failed to load employees. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Excludes the logged-in admin from the managed list, per spec.
  const visibleEmployees = useMemo(
    () => employees.filter((e) => e.employeeNumber !== user.employeeNumber),
    [employees, user.employeeNumber]
  );

  const pageStart = (page - 1) * PAGE_SIZE;
  const pageEmployees = visibleEmployees.slice(pageStart, pageStart + PAGE_SIZE);

  const handleDelete = async (empNo) => {
    if (!window.confirm("Are you sure you want to delete this employee?")) return;
    try {
      await deleteEmployee(empNo);
      setEmployees((prev) => prev.filter((e) => e.employeeNumber !== empNo));
    } catch (err) {
      alert("Failed to delete employee.");
    }
  };

  const handleSaveEdit = async (updates) => {
    try {
      await updateEmployee(editingEmployee.employeeNumber, updates);
      setEmployees((prev) =>
        prev.map((e) =>
          e.employeeNumber === editingEmployee.employeeNumber ? { ...e, ...updates } : e
        )
      );
      setEditingEmployee(null);
    } catch (err) {
      alert(err.data || "Failed to update employee.");
    }
  };

  return (
    <div className="admin-dashboard-page">
      <header className="dashboard-header">
        <h1>Employee Management</h1>
        <div className="dashboard-header-profile">
          <ProfileIcon className="dashboard-header-profile-icon" />
          <div className="dashboard-header-profile-text">
            <span className="dashboard-header-role">System Admin</span>
            <span className="dashboard-header-name">{user.fullName || "Admin"}</span>
          </div>
        </div>
      </header>

      <section className="dashboard-summary-row">
        <span className="dashboard-summary-label">Total Employees</span>
        <span className="dashboard-summary-pill">{visibleEmployees.length}</span>
      </section>

      {loading ? (
        <p className="dashboard-state-text">Loading employees...</p>
      ) : error ? (
        <div className="dashboard-state-text">
          <p>{error}</p>
          <button onClick={fetchEmployees}>Retry</button>
        </div>
      ) : (
        <>
          <div className="dashboard-table-wrapper">
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Employee Number</th>
                  <th>Name</th>
                  <th>Surname</th>
                  <th>Phone Number</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pageEmployees.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="dashboard-table-empty">
                      No employees found
                    </td>
                  </tr>
                ) : (
                  pageEmployees.map((emp) => (
                    <tr key={emp.employeeNumber}>
                      <td>{emp.employeeNumber}</td>
                      <td>{emp.firstName}</td>
                      <td>{emp.lastName}</td>
                      <td>{emp.contactNumber || "-"}</td>
                      <td>{emp.email || "-"}</td>
                      <td>{emp.portalRole || "Employee"}</td>
                      <td className="dashboard-table-actions">
                        <button
                          type="button"
                          className="dashboard-icon-btn"
                          onClick={() => setEditingEmployee(emp)}
                          title="Edit"
                        >
                          <EditIcon />
                        </button>
                        <button
                          type="button"
                          className="dashboard-icon-btn"
                          onClick={() => handleDelete(emp.employeeNumber)}
                          title="Delete"
                        >
                          <BinIcon />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Pagination
            currentPage={page}
            totalItems={visibleEmployees.length}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        </>
      )}

      <EditEmployeeModal
        employee={editingEmployee}
        onClose={() => setEditingEmployee(null)}
        onSave={handleSaveEdit}
      />
    </div>
  );
}

function EditEmployeeModal({ employee, onClose, onSave }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (employee) {
      setForm({
        firstName: employee.firstName || "",
        lastName: employee.lastName || "",
        contactNumber: employee.contactNumber || "",
        email: employee.email || "",
        position: employee.position || "",
        department: employee.department || "",
      });
    } else {
      setForm(null);
    }
  }, [employee]);

  if (!employee || !form) return null;

  const handleChange = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <Modal open={Boolean(employee)} onClose={onClose} title={`Edit ${employee.employeeNumber}`}>
      <form className="admin-edit-form" onSubmit={handleSubmit}>
        <IconInput
          id="editFirstName"
          label="First Name"
          icon={UserIcon}
          value={form.firstName}
          onChange={handleChange("firstName")}
        />
        <IconInput
          id="editLastName"
          label="Last Name"
          icon={UserIcon}
          value={form.lastName}
          onChange={handleChange("lastName")}
        />
        <IconInput
          id="editEmail"
          label="Email"
          icon={MailIcon}
          type="email"
          value={form.email}
          onChange={handleChange("email")}
        />
        <IconInput
          id="editContact"
          label="Contact Number"
          value={form.contactNumber}
          onChange={handleChange("contactNumber")}
        />
        <GradientButton type="submit">Save Changes</GradientButton>
      </form>
    </Modal>
  );
}

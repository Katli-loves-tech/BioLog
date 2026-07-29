import { useEffect, useState } from "react";
import { getEmployees, updateEmployee, deleteEmployee } from "../../../services/api";

const EMPTY_EDIT_FORM = {
  firstName: "",
  lastName: "",
  position: "",
  department: "",
  contactNumber: "",
  email: "",
  role: "Employee",
};

export default function AdminDashboard() {
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Which employee (if any) is currently being edited, and the draft values
  // for that edit. Kept separate from the table data so typing in the form
  // doesn't touch the list until Save is pressed.
  const [editingEmployeeNumber, setEditingEmployeeNumber] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (employee) => {
    setEditingEmployeeNumber(employee.employeeNumber);
    setEditForm({
      firstName: employee.firstName ?? "",
      lastName: employee.lastName ?? "",
      position: employee.position ?? "",
      department: employee.department ?? "",
      contactNumber: employee.contactNumber ?? "",
      email: employee.email ?? "",
      role: employee.role ?? "Employee",
    });
  };

  const cancelEdit = () => {
    setEditingEmployeeNumber(null);
    setEditForm(EMPTY_EDIT_FORM);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    try {
      // Note: IdNumber, FaceVector, Password, and Gender are deliberately
      // excluded — admins cannot update these per the spec.
      await updateEmployee(editingEmployeeNumber, editForm);
      await loadEmployees();
      cancelEdit();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (employeeNumber) => {
    const confirmed = window.confirm("Delete this employee? This cannot be undone.");
    if (!confirmed) return;

    try {
      await deleteEmployee(employeeNumber);
      await loadEmployees();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      {error && <p role="alert">{error}</p>}

      {isLoading ? (
        <p>Loading employees...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Phone Number</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.employeeNumber}>
                <td>{employee.employeeNumber}</td>
                <td>{employee.firstName}</td>
                <td>{employee.lastName}</td>
                <td>{employee.contactNumber}</td>
                <td>{employee.email}</td>
                <td>{employee.role}</td>
                <td>
                  <button type="button" onClick={() => startEdit(employee)}>
                    Update
                  </button>
                  <button type="button" onClick={() => handleDelete(employee.employeeNumber)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editingEmployeeNumber && (
        <form onSubmit={saveEdit}>
          <h2>Update Employee {editingEmployeeNumber}</h2>

          <label>
            First Name
            <input
              value={editForm.firstName}
              onChange={(e) => handleEditChange("firstName", e.target.value)}
              required
            />
          </label>

          <label>
            Last Name
            <input
              value={editForm.lastName}
              onChange={(e) => handleEditChange("lastName", e.target.value)}
              required
            />
          </label>

          <label>
            Position
            <input
              value={editForm.position}
              onChange={(e) => handleEditChange("position", e.target.value)}
            />
          </label>

          <label>
            Department
            <input
              value={editForm.department}
              onChange={(e) => handleEditChange("department", e.target.value)}
            />
          </label>

          <label>
            Contact Number
            <input
              value={editForm.contactNumber}
              onChange={(e) => handleEditChange("contactNumber", e.target.value)}
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={editForm.email}
              onChange={(e) => handleEditChange("email", e.target.value)}
            />
          </label>

          <label>
            Role
            <select
              value={editForm.role}
              onChange={(e) => handleEditChange("role", e.target.value)}
            >
              <option value="Employee">Employee</option>
              <option value="HR">HR</option>
            </select>
          </label>

          <button type="submit">Save</button>
          <button type="button" onClick={cancelEdit}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEmployee } from "../../../services/api";

const EMPTY_FORM = {
  firstName: "",
  lastName: "",
  idNumber: "",
  position: "Employee",
  department: "",
  contactNumber: "",
  email: "",
  gender: "",
};

export default function RegisterEmployee() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      // FaceVector is not collected here — see the disabled field below.
      // Password also isn't set here; it stays null until the employee (if
      // HR) registers via Register.jsx.
      await createEmployee(form);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register Employee</h1>

      {error && <p role="alert">{error}</p>}

      <label>
        First Name
        <input
          value={form.firstName}
          onChange={(e) => handleChange("firstName", e.target.value)}
          required
        />
      </label>

      <label>
        Last Name
        <input
          value={form.lastName}
          onChange={(e) => handleChange("lastName", e.target.value)}
          required
        />
      </label>

      <label>
        ID Number
        <input
          value={form.idNumber}
          onChange={(e) => handleChange("idNumber", e.target.value)}
          required
        />
      </label>

      <label>
        Position
        <select value={form.position} onChange={(e) => handleChange("position", e.target.value)}>
          <option value="Employee">Employee</option>
          <option value="HR">HR</option>
        </select>
      </label>

      <label>
        Department
        <input
          value={form.department}
          onChange={(e) => handleChange("department", e.target.value)}
        />
      </label>

      <label>
        Contact Number
        <input
          value={form.contactNumber}
          onChange={(e) => handleChange("contactNumber", e.target.value)}
        />
      </label>

      <label>
        Email
        <input
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
        />
      </label>

      <label>
        Gender
        <select
          value={form.gender}
          onChange={(e) => handleChange("gender", e.target.value)}
          required
        >
          <option value="" disabled>
            Select gender
          </option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label>
        <a href="#">Scan Face ID</a>
      </label>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Registering..." : "Register Employee"}
      </button>
    </form>
  );
}

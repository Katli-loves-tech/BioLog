import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../../services/api";

// PLACEHOLDER — Login.jsx belongs to another teammate. This minimal version
// exists only so App.jsx has something to route to while everyone works in
// parallel. Swap it out for the real page whenever it's ready; nothing else
// in this codebase depends on its internals beyond the /login route existing.
export default function Login() {
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      // TODO: real auth/session handling comes later. For now, just
      // redirect to the admin dashboard on any successful response.
      // await loginUser(employeeNumber, password);
      navigate("/admin/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <label>
        Employee Number
        <input
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          required
        />
      </label>
      <label>
        Password
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Logging in..." : "Login"}
      </button>
    </form>
  );
}

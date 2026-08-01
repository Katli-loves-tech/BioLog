import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../../../styles/auth-common.css";
import "./Login.css";
import IconInput from "../../../components/IconInput/IconInput";
import GradientButton from "../../../components/GradientButton/GradientButton";
import { UserIcon, LockIcon } from "../../../components/Icons";
import { login } from "../../../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await login(employeeNumber, password);
      localStorage.setItem("token", result.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          employeeNumber: result.employeeNumber,
          fullName: result.fullName,
          role: result.role,
        })
      );
      navigate(result.role === "HR" ? "/hr/dashboard" : "/admin/dashboard");
    } catch (err) {
      setError(err.data || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <h1 className="auth-heading">Welcome back</h1>
      <p className="auth-subheading">Sign in to continue to BioLog</p>

      <form className="auth-form-content" onSubmit={handleSubmit}>
        {error && <div className="auth-error">{error}</div>}

        <IconInput
          id="employeeNumber"
          label="Employee Number"
          icon={UserIcon}
          value={employeeNumber}
          onChange={(e) => setEmployeeNumber(e.target.value)}
          placeholder="Enter Employee Number"
          required
        />

        <IconInput
          id="password"
          label="Password"
          icon={LockIcon}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Password"
          required
        />

        <div className="auth-forgot-row">
          <Link to="/account-setup?mode=reset" className="auth-link">
            Forgot Password?
          </Link>
        </div>

        <GradientButton type="submit" disabled={loading}>
          {loading ? "Signing In..." : "Login"}
        </GradientButton>

        <span className="auth-divider">OR</span>

        <div className="auth-secondary-row">
          <span>New here?</span>
          <Link to="/account-setup?mode=register" className="auth-link">
            Register
          </Link>
        </div>
      </form>
    </div>
  );
}

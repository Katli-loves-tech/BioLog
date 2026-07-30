import React, { useState } from 'react';
import './Login.css';
import { login } from './api';

function Login({ onLogin }) {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(employeeNumber, password);
      // Store token and user info
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify({
        employeeNumber: result.employeeNumber,
        fullName: result.fullName,
        role: result.role,
      }));
      onLogin(result);
    } catch (err) {
      setError(err.data || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <div className="branding">
          <h1>BioLog</h1>
          <p className="tagline">Employee Attendance Management System</p>
        </div>
        <div className="login-illustration">
          <div className="feature-list">
            
           
          </div>
        </div>
      </div>
      <div className="login-right">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>Welcome!!</h2>
          <p className="form-subtitle">Sign in to your account</p>
          <div className="form-group">
            <label htmlFor="employeeNumber">Employee Number</label>
            <input
              type="text"
              id="employeeNumber"
              value={employeeNumber}
              onChange={(e) => setEmployeeNumber(e.target.value)}
              placeholder="Enter your employee number"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
            <div className="forgot-password">
              <button type="button" className="forgot-link" onClick={() => console.log('Forgot password clicked')}>Forgot Password?</button>
            </div>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          <button type="button" className="register-button" onClick={() => console.log('Navigate to register')}>Create an Account</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
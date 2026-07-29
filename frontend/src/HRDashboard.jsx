import React, { useState } from 'react';
import './HRDashboard.css';
import HRSettings from './HRSettings';

function HRDashboard({ onLogout }) {
  const [activePage, setActivePage] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');

  // Sample employee data
  const [employees] = useState([
    { id: 1, name: 'John Doe', employeeNumber: 'EMP001', clockIn: '08:00', clockOut: '17:00', status: 'present', duration: '9h 0m' },
    { id: 2, name: 'Jane Smith', employeeNumber: 'EMP002', clockIn: '08:15', clockOut: '17:00', status: 'late', duration: '8h 45m' },
    { id: 3, name: 'Bob Johnson', employeeNumber: 'EMP003', clockIn: '-', clockOut: '-', status: 'absent', duration: '-' },
    { id: 4, name: 'Alice Brown', employeeNumber: 'EMP004', clockIn: '07:55', clockOut: '17:05', status: 'present', duration: '9h 10m' },
    { id: 5, name: 'Charlie Wilson', employeeNumber: 'EMP005', clockIn: '08:30', clockOut: '16:30', status: 'late', duration: '8h 0m' },
    { id: 6, name: 'Diana Lee', employeeNumber: 'EMP006', clockIn: '-', clockOut: '-', status: 'absent', duration: '-' },
  ]);

  const totalEmployees = employees.length;
  const presentCount = employees.filter(e => e.status === 'present').length;
  const lateCount = employees.filter(e => e.status === 'late').length;
  const absentCount = employees.filter(e => e.status === 'absent').length;

  const filteredEmployees = employees.filter(emp =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employeeNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewReport = (employee) => {
    alert(`Viewing report for ${employee.name} (${employee.employeeNumber})`);
  };

  const handleLogout = () => {
    onLogout();
  };

  if (activePage === 'settings') {
    return (
      <div className="hr-dashboard">
        <div className="sidebar">
          <h2>BioLog</h2>
          <ul>
            <li className={activePage === 'dashboard' ? 'active' : ''} onClick={() => setActivePage('dashboard')}>
              <span className="icon">📊</span> Dashboard
            </li>
            <li className={activePage === 'settings' ? 'active' : ''} onClick={() => setActivePage('settings')}>
              <span className="icon">⚙️</span> Settings
            </li>
            <li className="logout" onClick={handleLogout}>
              <span className="icon">🚪</span> Logout
            </li>
          </ul>
          <div className="sidebar-user">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <span className="user-name">HR Admin</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
        </div>
        <div className="main-content">
          <HRSettings />
        </div>
      </div>
    );
  }

  return (
    <div className="hr-dashboard">
      <div className="sidebar">
        <h2>BioLog</h2>
        <ul>
          <li className={activePage === 'dashboard' ? 'active' : ''} onClick={() => setActivePage('dashboard')}>
            <span className="icon">📊</span> Dashboard
          </li>
          <li className={activePage === 'settings' ? 'active' : ''} onClick={() => setActivePage('settings')}>
            <span className="icon">⚙️</span> Settings
          </li>
            <li className="logout" onClick={handleLogout}>
              <span className="icon">🚪</span> Logout
            </li>
          </ul>
          <div className="sidebar-user">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <span className="user-name">HR Admin</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
      </div>
      <div className="main-content">
        <h1>HR Dashboard</h1>

        {/* Summary Cards */}
        <div className="summary-cards">
          <div className="card total">
            <h3>Total Employees</h3>
            <p className="card-value">{totalEmployees}</p>
          </div>
          <div className="card present">
            <h3>Present</h3>
            <p className="card-value">{presentCount}</p>
          </div>
          <div className="card late">
            <h3>Late</h3>
            <p className="card-value">{lateCount}</p>
          </div>
          <div className="card absent">
            <h3>Absent</h3>
            <p className="card-value">{absentCount}</p>
          </div>
        </div>

        {/* Employee List */}
        <div className="employee-list">
          <div className="employee-list-header">
            <h2>Employee Attendance</h2>
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search by name or employee number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>Employee Info</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Status</th>
                <th>Duration</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>
                    <div className="employee-info">
                      <span className="emp-name">{emp.name}</span>
                      <span className="emp-number">{emp.employeeNumber}</span>
                    </div>
                  </td>
                  <td>{emp.clockIn}</td>
                  <td>{emp.clockOut}</td>
                  <td>
                    <span className={`status-badge ${emp.status}`}>
                      {emp.status.charAt(0).toUpperCase() + emp.status.slice(1)}
                    </span>
                  </td>
                  <td>{emp.duration}</td>
                  <td>
                    <button className="view-btn" onClick={() => handleViewReport(emp)}>View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HRDashboard;
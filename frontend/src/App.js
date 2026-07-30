import React, { useState } from 'react';
import Login from "./Login";
import ForgetPassword from "./ForgetPassword";
import HRDashboard from "./HRDashboard";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const goToForgotPassword = () => {
    setCurrentPage('forgotPassword');
  };

  const goToLogin = () => {
    setCurrentPage('login');
  };

  if (!isLoggedIn) {
    if (currentPage === 'forgotPassword') {
      return <ForgetPassword onBackToLogin={goToLogin} />;
    }
    return <Login onLogin={handleLogin} onForgotPassword={goToForgotPassword} />;
  }

  // Route Superadmin users to AdminDashboard, HR users to HRDashboard
  if (user?.role === 'Superadmin') {
    return <AdminDashboard onLogout={handleLogout} user={user} />;
  }

  return <HRDashboard onLogout={handleLogout} user={user} />;
}

export default App;

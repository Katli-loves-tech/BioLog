import React, { useState } from 'react';
import Login from "./Login";
import HRDashboard from "./HRDashboard";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return <HRDashboard onLogout={handleLogout} />;
}

export default App;
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState<'user' | 'admin'>('user');
  const [loading, setLoading] = useState(false);

  const handleLogin = (type: 'user' | 'admin') => {
    setIsAuthenticated(true);
    setUserType(type);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserType('user');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <div className="text-lg">Memuat...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {isAuthenticated ? (
        <Dashboard onLogout={handleLogout} userType={userType} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
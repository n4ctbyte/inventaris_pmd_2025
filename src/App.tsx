import React, { useState, Suspense } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Kita hanya perlu me-lazy load Login dan Dashboard di sini
const Login = React.lazy(() => import('./components/Login'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));

// Komponen Fallback untuk Suspense
const LoadingFallback = () => (
  <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    <p className="mt-4 text-lg text-gray-600">Memuat...</p>
  </div>
);

function App() {
  // Logika untuk menyimpan status login di localStorage
  const getInitialUserType = (): 'user' | 'admin' | null => {
    const storedUserType = localStorage.getItem('userType');
    return storedUserType === 'user' || storedUserType === 'admin' ? storedUserType : null;
  };

  const [userType, setUserType] = useState<'user' | 'admin' | null>(getInitialUserType());

  const handleLogin = (type: 'user' | 'admin') => {
    localStorage.setItem('userType', type);
    setUserType(type);
  };

  const handleLogout = () => {
    localStorage.removeItem('userType');
    setUserType(null);
  };

  return (
    <Router>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route 
            path="/login" 
            element={!userType ? <Login onLogin={handleLogin} /> : <Navigate to="/" />} 
          />
          {/* Semua path lainnya akan ditangani oleh Dashboard */}
          <Route 
            path="/*" 
            element={userType ? <Dashboard userType={userType} onLogout={handleLogout} /> : <Navigate to="/login" />} 
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
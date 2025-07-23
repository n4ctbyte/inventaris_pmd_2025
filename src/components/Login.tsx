import React, { useState } from 'react';
import { User } from '../App';
import { LogIn, Users, Shield, Eye, EyeOff } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User, token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user, data.token);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Kesalahan koneksi ke server');
    }

    setLoading(false);
  };

  const quickLogin = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-3 w-16 h-16 mx-auto mb-4 shadow-lg">
              <LogIn className="h-10 w-10 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Selamat Datang</h2>
            <p className="text-gray-600">Sistem Inventaris Permuridhis</p>
            <p className="text-sm text-gray-500 mt-1">Persatuan Mahasiswa-Mahasiswi UNRI Buddhis</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Masukkan username"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Masukkan password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold shadow-lg"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Memuat...
                </div>
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-4 text-center">Akun Demo untuk Pengujian</p>
            <div className="space-y-3">
              <button
                onClick={() => quickLogin('admin', 'admin123')}
                className="w-full bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700 py-2.5 px-4 rounded-lg transition-all duration-200 flex items-center justify-center font-medium"
              >
                <Shield className="h-4 w-4 mr-2" />
                Administrator
                <span className="ml-auto text-xs bg-purple-200 px-2 py-1 rounded">admin / admin123</span>
              </button>
              
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => quickLogin('mahasiswa1', 'user123')}
                  className="bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-medium"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Ahmad Budi
                </button>
                <button
                  onClick={() => quickLogin('mahasiswa2', 'user123')}
                  className="bg-green-50 hover:bg-green-100 border border-green-200 text-green-700 py-2 px-3 rounded-lg transition-all duration-200 flex items-center justify-center text-sm font-medium"
                >
                  <Users className="h-4 w-4 mr-1" />
                  Sari Dewi
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-500 text-center mt-3">
              Klik tombol di atas untuk login cepat dengan akun demo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
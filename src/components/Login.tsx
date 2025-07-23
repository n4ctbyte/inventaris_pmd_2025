import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Password untuk akses sistem
  const SYSTEM_PASSWORD = 'permuridhis2025';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password === SYSTEM_PASSWORD) {
      onLogin();
    } else {
      setError('Password salah! Silakan coba lagi.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full p-4 w-20 h-20 mx-auto mb-6 shadow-lg">
              <Lock className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistem Inventaris</h1>
            <h2 className="text-xl font-semibold text-blue-600 mb-2">Permuridhis</h2>
            <p className="text-gray-600 text-sm">Persatuan Mahasiswa-Mahasiswi UNRI Buddhis</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-3">
                Masukkan Password Sistem
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg"
                  placeholder="Password untuk mengakses sistem"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-semibold shadow-lg text-lg"
            >
              <div className="flex items-center justify-center">
                <LogIn className="h-5 w-5 mr-2" />
                Masuk ke Sistem
              </div>
            </button>
          </form>

          {/* Demo Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-blue-800 text-center">
                <strong>Password Demo:</strong> <code className="bg-blue-100 px-2 py-1 rounded">permuridhis2025</code>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
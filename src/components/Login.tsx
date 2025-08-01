import React, { useState, useEffect, useRef } from 'react';
import { LogIn, Eye, EyeOff, Shield, Heart } from 'lucide-react';
import pmdIcon from '../assets/pmd_icon.png';

interface LoginProps {
  onLogin: (userType: 'user' | 'admin') => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // PASTIKAN INI ADALAH URL BARU YANG ANDA BUAT DI LANGKAH SEBELUMNYA
  const API_URL = 'https://script.google.com/macros/s/AKfycbyjgRZqqlkKlSOyeuqzoQSGwD-3Q8GMC8--N8_HzFoIrXa-a2e-Q2iy5BhPtAn_PmCOVA/exec';

  // useRef untuk menunjuk ke elemen form di JSX
  const formRef = useRef<HTMLFormElement>(null );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Kirim form secara tradisional ke target iframe
    if (formRef.current) {
      formRef.current.submit();
    }

    // Pasang timeout untuk menangani jika server tidak merespons sama sekali
    const timeoutId = setTimeout(() => {
      setIsLoading(false);
      setError("Waktu habis. Server tidak merespons, periksa URL API atau koneksi.");
    }, 15000); // Timeout 15 detik

    // Buat listener untuk "mendengarkan" pesan yang dikirim kembali oleh Apps Script
    const handleMessage = (event: MessageEvent) => {
      // Pastikan event.data ada dan merupakan string
      if (typeof event.data !== 'string') return;

      clearTimeout(timeoutId); // Batalkan timeout karena respons sudah diterima
      
      try {
        // Karena kita mengirim stringified JSON, kita perlu parse dua kali
        const result = JSON.parse(event.data);
        
        if (result.success) {
          if (result.userType === 'admin' || result.userType === 'user') {
            onLogin(result.userType);
          } else {
            setError('Tipe pengguna tidak valid dari server.');
          }
        } else {
          setError(result.message || 'Password salah!');
        }
      } catch (err) {
        setError("Gagal memproses respons dari server.");
      } finally {
        setIsLoading(false);
        // Hapus listener setelah selesai agar tidak menumpuk
        window.removeEventListener('message', handleMessage);
      }
    };

    // Mulai mendengarkan pesan
    window.addEventListener('message', handleMessage, false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-50 via-white to-violet-50 relative overflow-hidden">
      {/* Floating background elements */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-soft"></div>
      <div className="absolute top-40 right-20 w-72 h-72 bg-violet-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse-soft" style={{ animationDelay: '4s' }}></div>

      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20 animate-fade-in-scale relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent pointer-events-none"></div>
          <div className="text-center mb-8 relative z-10">
            <div className="bg-gradient-to-r from-purple-600 to-violet-600 rounded-full p-1 w-28 h-28 mx-auto mb-6 shadow-2xl floating relative">
              <img src={pmdIcon} alt="Logo Permuridhis" className="h-full w-full object-cover rounded-full" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">Sistem Inventaris</h1>
            <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent mb-2">Permuridhis</h2>
            <p className="text-gray-600 text-sm font-medium">Persaudaraan Mahasiswa-Mahasiswi UNRI Buddhis</p>
          </div>

          {error && (
            <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center animate-slide-in-right shadow-soft">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form sekarang memiliki ref, action, method, dan target */}
          <form ref={formRef} action={API_URL} method="post" target="response_iframe" onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-3 flex items-center">
                <Shield className="h-4 w-4 mr-2 text-purple-600" />
                Masukkan Password User/Admin
              </label>
              <div className="relative">
                {/* Input password sekarang WAJIB punya atribut 'name' */}
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 text-lg bg-white/50 backdrop-blur-sm shadow-soft hover:shadow-lg font-medium"
                  placeholder="Masukkan Password"
                  required
                  disabled={isLoading}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-all duration-200 p-1 rounded-lg hover:bg-purple-50" disabled={isLoading}>
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="w-full bg-gradient-to-r from-purple-600 to-violet-600 text-white py-4 px-4 rounded-xl hover:from-purple-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-300 font-semibold shadow-xl text-lg transform hover:-translate-y-0.5 hover:shadow-2xl ripple relative overflow-hidden disabled:opacity-75 disabled:cursor-not-allowed">
              <div className="flex items-center justify-center">
                {isLoading ? (
                  <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div><span>Mengecek...</span></>
                ) : (
                  <><LogIn className="h-5 w-5 mr-2" /><span>Masuk</span></>
                )}
              </div>
            </button>
          </form>
          <div>
            <p className="text-gray-600 text-sm font-medium text-center mt-4">
              Dibuat dengan <Heart className="inline w-4 h-4 text-red-500 mx-1 fill-red-500" /> oleh Divisi Human Resource and Equipment
            </p>
          </div>
        </div>
      </div>
      {/* Iframe tersembunyi untuk menerima respons dari form. Ini adalah kunci dari solusinya. */}
      <iframe name="response_iframe" style={{ display: 'none' }}></iframe>
    </div>
  );
};

export default Login;
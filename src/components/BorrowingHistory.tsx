import React, { useState, useEffect } from 'react';
import { Calendar, Package, ArrowRight, User, Eye, EyeOff, History } from 'lucide-react';
import { Borrowing, getBorrowings } from '../utils/storage';

interface BorrowingHistoryProps {
  userType?: 'user' | 'admin';
}

const BorrowingHistory: React.FC<BorrowingHistoryProps> = ({ userType = 'user' }) => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);

  useEffect(() => {
    const allBorrowings = getBorrowings();
    const sortedBorrowings = allBorrowings.sort((a, b) => 
      new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime()
    );
    setBorrowings(sortedBorrowings);
  }, []);

  const isAdmin = userType === 'admin';

  return (
    <div>
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-3 mr-4">
            <History className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
              Riwayat Peminjaman
            </h2>
            <p className="text-gray-600 font-medium">
            {isAdmin 
              ? 'Semua riwayat peminjaman dalam sistem' 
              : 'Riwayat peminjaman barang inventaris'
            }
          </p>
          </div>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowPersonalInfo(!showPersonalInfo)}
            className={`flex items-center px-4 py-3 rounded-xl font-semibold transition-all duration-300 shadow-lg transform hover:-translate-y-0.5 ${
              showPersonalInfo
                ? 'bg-red-100/80 text-red-700 hover:bg-red-200/80 shadow-red-200'
                : 'bg-purple-100/80 text-purple-700 hover:bg-purple-200/80 shadow-purple-200'
            }`}
          >
            {showPersonalInfo ? (
              <>
                <EyeOff className="h-4 w-4 mr-2" />
                Sembunyikan Info Pribadi
              </>
            ) : (
              <>
                <Eye className="h-4 w-4 mr-2" />
                Tampilkan Info Pribadi
              </>
            )}
          </button>
        )}
      </div>

      {borrowings.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-scale">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <Package className="h-16 w-16 text-gray-400" />
          </div>
          <p className="text-gray-500 text-xl font-medium">Belum ada riwayat peminjaman</p>
        </div>
      ) : (
        <div className="space-y-6">
          {borrowings.map((borrowing) => (
            <div key={borrowing.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-soft hover:shadow-xl transition-all duration-300 card-hover animate-fade-in-up relative overflow-hidden group">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="flex items-start justify-between">
                <div className="flex-1 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-2 mr-3 shadow-soft">
                        <Package className="h-5 w-5 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-purple-900 transition-colors duration-200">
                        {borrowing.item_name}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1.5 rounded-full text-sm font-bold shadow-soft ${
                        borrowing.status === 'borrowed'
                          ? 'bg-yellow-100/80 text-yellow-800'
                          : 'bg-green-100/80 text-green-800'
                      }`}
                    >
                      {borrowing.status === 'borrowed' ? 'Sedang Dipinjam' : 'Sudah Dikembalikan'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      {/* Info Peminjam - Hanya tampil untuk admin atau jika admin mengaktifkan */}
                      {isAdmin && (
                        <div className="flex items-center text-gray-700">
                          <User className="h-4 w-4 mr-3 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 font-medium">Peminjam:</span>
                            <p className="font-bold">
                              {showPersonalInfo ? borrowing.borrower_name : '****** (Disembunyikan)'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-700">
                        <Package className="h-4 w-4 mr-3 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500 font-medium">Jumlah:</span>
                          <p className="font-bold text-purple-600">{borrowing.quantity} unit</p>
                        </div>
                      </div>
                      
                      <div className="text-gray-700">
                        <span className="text-sm text-gray-500 font-medium">Tujuan Peminjaman:</span>
                        <p className="font-semibold mt-1 leading-relaxed">{borrowing.purpose}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500 font-medium">Tanggal Pinjam:</span>
                          <p className="font-bold">
                            {new Date(borrowing.borrow_date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>

                      {borrowing.return_date && (
                        <div className="flex items-center text-gray-700">
                          <ArrowRight className="h-4 w-4 mr-3 text-gray-500" />
                          <div>
                            <span className="text-sm text-gray-500 font-medium">Tanggal Kembali:</span>
                            <p className="font-bold text-green-600">
                              {new Date(borrowing.return_date).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {borrowing.condition_note && (
                    <div className="mt-6 p-4 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-xl border border-gray-200/50 shadow-soft">
                      <div className="flex items-start">
                        <div className="bg-gray-200/80 rounded-full p-1 mr-3 mt-0.5">
                          <Package className="h-3 w-3 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-700 mb-1">Kondisi saat dikembalikan:</p>
                          <p className="text-sm text-gray-600 font-medium leading-relaxed">{borrowing.condition_note}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info untuk user biasa */}
      {!isAdmin && (
        <div className="mt-8 bg-gradient-to-r from-purple-50/80 to-violet-50/80 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/50 shadow-soft animate-fade-in-up">
          <div className="flex items-start">
            <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-2 mr-4 shadow-soft">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-bold text-purple-900 mb-2">Informasi Privasi</h3>
              <p className="text-sm text-purple-800 font-medium leading-relaxed">
                Untuk menjaga privasi, informasi peminjam tidak ditampilkan dalam riwayat umum. 
                Hanya administrator yang dapat melihat detail lengkap peminjaman.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowingHistory;
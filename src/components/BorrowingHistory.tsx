import React, { useState, useEffect } from 'react';
import { Calendar, Package, ArrowRight, User, Eye, EyeOff } from 'lucide-react';
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Riwayat Peminjaman</h2>
          <p className="text-gray-600 mt-1">
            {isAdmin 
              ? 'Semua riwayat peminjaman dalam sistem' 
              : 'Riwayat peminjaman barang inventaris'
            }
          </p>
        </div>
        
        {isAdmin && (
          <button
            onClick={() => setShowPersonalInfo(!showPersonalInfo)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              showPersonalInfo
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
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
        <div className="text-center py-16">
          <Package className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Belum ada riwayat peminjaman</p>
        </div>
      ) : (
        <div className="space-y-4">
          {borrowings.map((borrowing) => (
            <div key={borrowing.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-blue-50 rounded-lg p-2 mr-3">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {borrowing.item_name}
                      </h3>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        borrowing.status === 'borrowed'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
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
                            <span className="text-sm text-gray-500">Peminjam:</span>
                            <p className="font-medium">
                              {showPersonalInfo ? borrowing.borrower_name : '****** (Disembunyikan)'}
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center text-gray-700">
                        <Package className="h-4 w-4 mr-3 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500">Jumlah:</span>
                          <p className="font-medium">{borrowing.quantity} unit</p>
                        </div>
                      </div>
                      
                      <div className="text-gray-700">
                        <span className="text-sm text-gray-500">Tujuan Peminjaman:</span>
                        <p className="font-medium mt-1">{borrowing.purpose}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-3 text-gray-500" />
                        <div>
                          <span className="text-sm text-gray-500">Tanggal Pinjam:</span>
                          <p className="font-medium">
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
                            <span className="text-sm text-gray-500">Tanggal Kembali:</span>
                            <p className="font-medium">
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
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-start">
                        <div className="bg-gray-200 rounded-full p-1 mr-3 mt-0.5">
                          <Package className="h-3 w-3 text-gray-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-1">Kondisi saat dikembalikan:</p>
                          <p className="text-sm text-gray-600">{borrowing.condition_note}</p>
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
        <div className="mt-8 bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-start">
            <div className="bg-blue-100 rounded-lg p-2 mr-4">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-blue-900 mb-2">Informasi Privasi</h3>
              <p className="text-sm text-blue-800">
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
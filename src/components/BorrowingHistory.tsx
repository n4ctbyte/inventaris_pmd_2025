import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { Calendar, Package, ArrowRight } from 'lucide-react';

interface Borrowing {
  id: number;
  item_name: string;
  item_description: string;
  quantity: number;
  purpose: string;
  borrow_date: string;
  return_date?: string;
  condition_note?: string;
  status: 'borrowed' | 'returned';
}

interface BorrowingHistoryProps {
  user: User;
}

const BorrowingHistory: React.FC<BorrowingHistoryProps> = ({ user }) => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const endpoint = user.role === 'admin' ? '/api/all-borrowings' : '/api/my-borrowings';
      const response = await fetch(`http://localhost:3001${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setBorrowings(data);
      }
    } catch (err) {
      console.error('Error fetching borrowings:', err);
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Memuat riwayat peminjaman...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {user.role === 'admin' ? 'Semua Riwayat Peminjaman' : 'Riwayat Peminjaman Saya'}
      </h2>

      {borrowings.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada riwayat peminjaman</p>
        </div>
      ) : (
        <div className="space-y-4">
          {borrowings.map((borrowing) => (
            <div key={borrowing.id} className="bg-gray-50 rounded-lg p-6 border">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {borrowing.item_name}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        borrowing.status === 'borrowed'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {borrowing.status === 'borrowed' ? 'Dipinjam' : 'Dikembalikan'}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{borrowing.item_description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-700">
                        <strong>Jumlah:</strong> {borrowing.quantity}
                      </p>
                      <p className="text-gray-700">
                        <strong>Tujuan:</strong> {borrowing.purpose}
                      </p>
                      {user.role === 'admin' && (borrowing as any).user_name && (
                        <p className="text-gray-700">
                          <strong>Peminjam:</strong> {(borrowing as any).user_name}
                        </p>
                      )}
                    </div>

                    <div>
                      <div className="flex items-center text-gray-700 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          <strong>Dipinjam:</strong>{' '}
                          {new Date(borrowing.borrow_date).toLocaleDateString('id-ID', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>

                      {borrowing.return_date && (
                        <div className="flex items-center text-gray-700">
                          <ArrowRight className="h-4 w-4 mr-2" />
                          <span>
                            <strong>Dikembalikan:</strong>{' '}
                            {new Date(borrowing.return_date).toLocaleDateString('id-ID', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {borrowing.condition_note && (
                    <div className="mt-4 p-3 bg-white rounded border">
                      <p className="text-sm">
                        <strong>Kondisi saat dikembalikan:</strong> {borrowing.condition_note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BorrowingHistory;
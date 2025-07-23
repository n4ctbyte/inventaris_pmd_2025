import React, { useState, useEffect } from 'react';
import { Calendar, Package, ArrowRight } from 'lucide-react';
import { Borrowing, getBorrowings } from '../utils/storage';

const BorrowingHistory: React.FC = () => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);

  useEffect(() => {
    const allBorrowings = getBorrowings();
    const sortedBorrowings = allBorrowings.sort((a, b) => 
      new Date(b.borrow_date).getTime() - new Date(a.borrow_date).getTime()
    );
    setBorrowings(sortedBorrowings);
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Riwayat Peminjaman</h2>

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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-700">
                        <strong>Peminjam:</strong> {borrowing.borrower_name}
                      </p>
                      <p className="text-gray-700">
                        <strong>Jumlah:</strong> {borrowing.quantity}
                      </p>
                      <p className="text-gray-700">
                        <strong>Tujuan:</strong> {borrowing.purpose}
                      </p>
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
import React, { useState, useEffect } from 'react';
import { User } from '../App';
import { X } from 'lucide-react';

interface Borrowing {
  id: number;
  item_name: string;
  item_description: string;
  quantity: number;
  purpose: string;
  borrow_date: string;
  status: string;
}

interface ReturnFormProps {
  user: User;
  onSuccess: () => void;
  onCancel: () => void;
}

const ReturnForm: React.FC<ReturnFormProps> = ({ user, onSuccess, onCancel }) => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [selectedBorrowing, setSelectedBorrowing] = useState('');
  const [conditionNote, setConditionNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const fetchBorrowings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/my-borrowings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const activeBorrowings = data.filter((b: Borrowing) => b.status === 'borrowed');
        setBorrowings(activeBorrowings);
      }
    } catch (err) {
      setError('Kesalahan mengambil data peminjaman');
    }
    setFetchLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/return', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          borrowing_id: selectedBorrowing,
          condition_note: conditionNote,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess();
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Kesalahan koneksi ke server');
    }

    setLoading(false);
  };

  if (fetchLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
          <div className="text-center py-8">Memuat data peminjaman...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Kembalikan Barang</h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {borrowings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Tidak ada barang yang sedang dipinjam</p>
            <button
              onClick={onCancel}
              className="mt-4 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
            >
              Tutup
            </button>
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Pilih Barang yang Dikembalikan
                </label>
                <select
                  value={selectedBorrowing}
                  onChange={(e) => setSelectedBorrowing(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  required
                >
                  <option value="">-- Pilih Barang --</option>
                  {borrowings.map((borrowing) => (
                    <option key={borrowing.id} value={borrowing.id}>
                      {borrowing.item_name} (x{borrowing.quantity}) - {new Date(borrowing.borrow_date).toLocaleDateString('id-ID')}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Kondisi Barang
                </label>
                <textarea
                  value={conditionNote}
                  onChange={(e) => setConditionNote(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                  rows={3}
                  placeholder="Contoh: Kondisi baik, Rusak di bagian layar, Hilang kabel charger, dll."
                  required
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? 'Memproses...' : 'Kembalikan'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ReturnForm;
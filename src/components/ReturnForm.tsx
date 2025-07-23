import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Borrowing, getBorrowings, updateBorrowing, getItems, saveItems } from '../utils/storage';

interface ReturnFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const ReturnForm: React.FC<ReturnFormProps> = ({ onSuccess, onCancel }) => {
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [selectedBorrowing, setSelectedBorrowing] = useState('');
  const [conditionNote, setConditionNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const allBorrowings = getBorrowings();
    const activeBorrowings = allBorrowings.filter(b => b.status === 'borrowed');
    setBorrowings(activeBorrowings);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const borrowingId = parseInt(selectedBorrowing);
      const borrowing = borrowings.find(b => b.id === borrowingId);
      
      if (!borrowing) {
        setError('Data peminjaman tidak ditemukan');
        setLoading(false);
        return;
      }

      // Update borrowing record
      updateBorrowing(borrowingId, {
        return_date: new Date().toISOString(),
        condition_note: conditionNote,
        status: 'returned'
      });

      // Update item stock
      const items = getItems();
      const updatedItems = items.map(item => 
        item.id === borrowing.item_id 
          ? { ...item, stock: item.stock + borrowing.quantity }
          : item
      );
      saveItems(updatedItems);

      onSuccess();
    } catch (err) {
      setError('Terjadi kesalahan saat memproses pengembalian');
    }

    setLoading(false);
  };

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
                      {borrowing.item_name} (x{borrowing.quantity}) - {borrowing.borrower_name} - {new Date(borrowing.borrow_date).toLocaleDateString('id-ID')}
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
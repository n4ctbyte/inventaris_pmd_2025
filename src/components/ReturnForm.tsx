import React, { useState, useEffect } from 'react';
import { X, Minus } from 'lucide-react';
import ReactDOM from 'react-dom';
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

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-md"
        onClick={onCancel}
      />
      
      {/* Modal container */}
      <div className="relative z-10 flex items-center justify-center min-h-full p-4">
        <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-white/20 animate-fade-in-scale">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-200/50">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl p-2 mr-3 shadow-soft">
                <Minus className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Kembalikan Barang
              </h3>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-gray-600 transition-all duration-200 p-2 rounded-xl hover:bg-gray-100/80 shadow-soft"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {borrowings.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full p-4 w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <Minus className="h-10 w-10 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-6">Tidak ada barang yang sedang dipinjam</p>
              <button
                onClick={onCancel}
                className="bg-gray-100/80 text-gray-700 py-3 px-6 rounded-xl hover:bg-gray-200/80 font-semibold transition-all duration-300 shadow-soft hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Tutup
              </button>
            </div>
          ) : (
            <div className="p-6">
              {error && (
                <div className="bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl mb-4 flex items-center shadow-soft animate-slide-in-right">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-3">
                    Pilih Barang yang Dikembalikan
                  </label>
                  <select
                    value={selectedBorrowing}
                    onChange={(e) => setSelectedBorrowing(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-lg font-medium"
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

                <div>
                  <label className="block text-gray-700 text-sm font-semibold mb-3">
                    Kondisi Barang
                  </label>
                  <textarea
                    value={conditionNote}
                    onChange={(e) => setConditionNote(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 resize-none bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-lg font-medium"
                    rows={3}
                    placeholder="Contoh: Kondisi baik, Rusak di bagian layar, Hilang kabel charger, dll."
                    required
                  />
                </div>

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-100/80 text-gray-700 py-3 px-4 rounded-xl hover:bg-gray-200/80 font-semibold transition-all duration-300 min-h-[48px] shadow-soft hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 shadow-xl min-h-[48px] transform hover:-translate-y-0.5 hover:shadow-2xl ripple relative overflow-hidden"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </div>
                    ) : 'Kembalikan'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ReturnForm;
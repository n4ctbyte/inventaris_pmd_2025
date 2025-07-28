import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X, Package, User, Calendar, FileText } from 'lucide-react';
import { Item, addBorrowing, getItems, saveItems } from '../utils/storage';

interface BorrowFormProps {
  item: Item;
  onSuccess: () => void;
  onCancel: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ item, onSuccess, onCancel }) => {
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [borrowerName, setBorrowerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Check if stock is still available
      const currentItems = getItems();
      const currentItem = currentItems.find(i => i.id === item.id);
      
      if (!currentItem || currentItem.stock < quantity) {
        setError('Stok tidak mencukupi');
        setLoading(false);
        return;
      }

      // Add borrowing record
      addBorrowing({
        item_id: item.id,
        item_name: item.name,
        quantity,
        purpose,
        borrower_name: borrowerName
      });

      // Update item stock
      const updatedItems = currentItems.map(i => 
        i.id === item.id 
          ? { ...i, stock: i.stock - quantity }
          : i
      );
      saveItems(updatedItems);

      onSuccess();
    } catch (err) {
      setError('Terjadi kesalahan saat memproses peminjaman');
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
        <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-white/20 animate-fade-in-scale max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-2 pt-2.8 border-b border-gray-200/50 sticky top-0 bg-white rounded-t-3xl">
            <div className="flex items-center">
              <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-2 mr-3 shadow-soft">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Pinjam Barang
              </h3>
            </div>
          </div>

          {/* Item Info */}
          <div className="p-2 border-b border-gray-100/50">
            <div className="bg-gradient-to-r from-purple-50/80 to-violet-50/80 backdrop-blur-sm rounded-2xl p-2 border border-purple-100/50 shadow-soft">
              <h4 className="font-bold text-gray-900 mb-2 text-lg">{item.name}</h4>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-700">
                  <Package className="h-4 w-4 mr-2 text-purple-600" />
                  <span className="font-medium">Stok tersedia: <span className="font-bold text-purple-600">{item.stock}</span></span>
                </div>
                <div className="bg-green-100/80 text-green-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-soft">
                  Tersedia
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mx-6 mt-4 bg-red-50/80 backdrop-blur-sm border border-red-200/50 text-red-700 px-4 py-3 rounded-xl flex items-center shadow-soft animate-slide-in-right">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-2">
              <div>
                <label className="flex items-center text-gray-700 text-sm font-semibold mb-3">
                  <User className="h-4 w-4 mr-2 text-gray-500" />
                  Nama Peminjam
                </label>
                <input
                  type="text"
                  value={borrowerName}
                  onChange={(e) => setBorrowerName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-lg font-medium"
                  placeholder="Masukkan nama lengkap peminjam"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 text-sm font-semibold mb-3">
                  <Package className="h-4 w-4 mr-2 text-gray-500" />
                  Jumlah yang Dipinjam
                </label>
                <input
                  type="number"
                  min="1"
                  max={item.stock}
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-lg font-medium"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-gray-700 text-sm font-semibold mb-3">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  Tujuan Peminjaman
                </label>
                <textarea
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 resize-none bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-lg font-medium"
                  rows={2}
                  placeholder="Contoh: Untuk kegiatan seminar Buddha, presentasi tugas kelompok, dokumentasi acara, dll."
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-8">
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
                className="flex-1 bg-gradient-to-r from-purple-600 to-violet-600 text-white py-3 px-4 rounded-xl hover:from-purple-700 hover:to-violet-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-300 shadow-xl min-h-[48px] transform hover:-translate-y-0.5 hover:shadow-2xl ripple relative overflow-hidden"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  'Pinjam Sekarang'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BorrowForm;
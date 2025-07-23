import React, { useState } from 'react';
import { X, Package, User, Calendar, FileText } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  description: string;
  stock: number;
}

interface BorrowFormProps {
  item: Item;
  onSuccess: () => void;
  onCancel: () => void;
}

const BorrowForm: React.FC<BorrowFormProps> = ({ item, onSuccess, onCancel }) => {
  const [quantity, setQuantity] = useState(1);
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/api/borrow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          item_id: item.id,
          quantity,
          purpose,
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

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-lg p-2 mr-3">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Pinjam Barang</h3>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Item Info */}
        <div className="p-6 border-b border-gray-100">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-semibold text-gray-900 mb-2">{item.name}</h4>
            <p className="text-sm text-gray-600 mb-3">{item.description}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center text-sm text-gray-700">
                <Package className="h-4 w-4 mr-2 text-blue-600" />
                <span>Stok tersedia: <span className="font-semibold text-blue-600">{item.stock}</span></span>
              </div>
              <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                Tersedia
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label className="flex items-center text-gray-700 text-sm font-semibold mb-3">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                Jumlah yang Dipinjam
              </label>
              <input
                type="number"
                min="1"
                max={item.stock}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Maksimal {item.stock} unit</p>
            </div>

            <div>
              <label className="flex items-center text-gray-700 text-sm font-semibold mb-3">
                <FileText className="h-4 w-4 mr-2 text-gray-500" />
                Tujuan Peminjaman
              </label>
              <textarea
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={4}
                placeholder="Contoh: Untuk kegiatan seminar Buddha, presentasi tugas kelompok, dokumentasi acara, dll."
                required
              />
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Tanggal peminjaman: <span className="font-medium text-gray-900">{new Date().toLocaleDateString('id-ID')}</span></span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 font-semibold transition-all duration-200"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-all duration-200 shadow-lg"
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
  );
};

export default BorrowForm;
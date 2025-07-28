import React, { useState, useEffect } from 'react';
import BorrowForm from './BorrowForm';
import ReturnForm from './ReturnForm';
import { Package, Plus, Minus, Search, Filter, Box, Sparkles, TrendingUp, CheckCircle } from 'lucide-react';
import { getItems, Item } from '../utils/storage';

const InventoryList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchItems = () => {
    const itemsData = getItems();
    setItems(itemsData);
    setFilteredItems(itemsData);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  useEffect(() => {
    let filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (stockFilter === 'available') {
      filtered = filtered.filter(item => item.stock > 0);
    } else if (stockFilter === 'unavailable') {
      filtered = filtered.filter(item => item.stock === 0);
    }

    setFilteredItems(filtered);
  }, [items, searchTerm, stockFilter]);

  const handleBorrow = (item: Item) => {
    setSelectedItem(item);
    setShowBorrowForm(true);
  };

  const handleReturn = () => {
    setShowReturnForm(true);
  };

  const handleBorrowSuccess = () => {
    setShowBorrowForm(false);
    setSelectedItem(null);
    fetchItems();
    setSuccessMessage('Barang berhasil dipinjam! 🎉');
    setTimeout(() => setSuccessMessage(''), 2000);
  };

  const handleReturnSuccess = () => {
    setShowReturnForm(false);
    fetchItems();
    setSuccessMessage('Barang berhasil dikembalikan! ✅');
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-fade-in-up">
        <div className="flex items-center">
          <div className="bg-gradient-to-r from-purple-100 to-violet-100 rounded-xl p-3 mr-4">
            <Package className="h-8 w-8 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-1">
              Daftar Inventaris
            </h2>
            <p className="text-gray-600 font-medium">Kelola dan pinjam barang inventaris organisasi</p>
          </div>
        </div>
        <button
          onClick={handleReturn}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 flex items-center font-semibold shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-2xl ripple relative overflow-hidden"
        >
          <Minus className="h-4 w-4 mr-2" />
          Kembalikan Barang
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
  <div className="fixed top-6 justify-items-center bg-green-500/95 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-lg border border-green-400/50 z-[100] animate-slide-in-down flex items-center">
    <CheckCircle className="h-5 w-5 mr-2 animate-pulse" />
    <span className="font-semibold">{successMessage}</span>
  </div>
)}

      {/* Search and Filter */}
      <div className="bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-gray-200/50 shadow-soft animate-slide-in-down">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors duration-200" />
            <input
              type="text"
              placeholder="Cari barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-300 bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-lg font-medium"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="pl-12 pr-10 py-3 border border-gray-300/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 appearance-none bg-white/70 backdrop-blur-sm shadow-soft hover:shadow-lg font-medium transition-all duration-300"
            >
              <option value="all">Semua Barang</option>
              <option value="available">Tersedia</option>
              <option value="unavailable">Tidak Tersedia</option>
            </select>
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-20 animate-fade-in-scale">
          <div className="bg-gradient-to-r from-gray-100 to-gray-200 rounded-full p-6 w-32 h-32 mx-auto mb-6 flex items-center justify-center">
            <Box className="h-16 w-16 text-gray-400" />
          </div>
          <p className="text-gray-500 text-xl mb-4 font-medium">
            {searchTerm || stockFilter !== 'all' ? 'Tidak ada barang yang sesuai filter' : 'Belum ada barang dalam inventaris'}
          </p>
          {(searchTerm || stockFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStockFilter('all');
              }}
              className="text-purple-600 hover:text-purple-700 font-semibold bg-purple-50 px-4 py-2 rounded-lg hover:bg-purple-100 transition-all duration-200"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-soft hover:shadow-xl transition-all duration-300 hover:border-purple-200/50 card-hover animate-fade-in-up relative overflow-hidden group">
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              <div className="flex items-start justify-between mb-4">
                <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-xl p-3 shadow-soft">
                  <Package className="h-6 w-6 text-purple-600 group-hover:scale-110 transition-transform duration-200" />
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.stock > 0 
                    ? 'bg-green-100/80 text-green-800 shadow-soft' 
                    : 'bg-red-100/80 text-red-800 shadow-soft'
                }`}>
                  {item.stock > 0 ? 'Tersedia' : 'Habis'}
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-purple-900 transition-colors duration-200">
                {item.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-700">
                  <div className="bg-gradient-to-r from-gray-100 to-gray-50 rounded-xl px-4 py-2 shadow-soft">
                    <span className="text-sm font-medium">
                      Stok: <span className="font-bold text-purple-600">{item.stock}</span>
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBorrow(item)}
                  disabled={item.stock === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 ${
                    item.stock > 0
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 hover:shadow-xl transform hover:-translate-y-0.5 ripple relative overflow-hidden'
                      : 'bg-gray-200/80 text-gray-500 cursor-not-allowed backdrop-blur-sm'
                  }`}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Pinjam
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {showBorrowForm && selectedItem && (
        <BorrowForm
          item={selectedItem}
          onSuccess={handleBorrowSuccess}
          onCancel={() => {
            setShowBorrowForm(false);
            setSelectedItem(null);
          }}
        />
      )}

      {showReturnForm && (
        <ReturnForm
          onSuccess={handleReturnSuccess}
          onCancel={() => setShowReturnForm(false)}
        />
      )}
    </div>
  );
};

export default InventoryList;
import React, { useState, useEffect } from 'react';
import BorrowForm from './BorrowForm';
import ReturnForm from './ReturnForm';
import { Package, Plus, Minus, Search, Filter, Box } from 'lucide-react';
import { getItems, Item } from '../utils/storage';

const InventoryList: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState('all');

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
  };

  const handleReturnSuccess = () => {
    setShowReturnForm(false);
    fetchItems();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Daftar Inventaris</h2>
          <p className="text-gray-600">Kelola dan pinjam barang inventaris organisasi</p>
        </div>
        <button
          onClick={handleReturn}
          className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 flex items-center font-semibold shadow-lg transition-all duration-200"
        >
          <Minus className="h-4 w-4 mr-2" />
          Kembalikan Barang
        </button>
      </div>

      {/* Search and Filter */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Cari barang..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent appearance-none bg-white"
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
        <div className="text-center py-16">
          <Box className="h-20 w-20 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">
            {searchTerm || stockFilter !== 'all' ? 'Tidak ada barang yang sesuai filter' : 'Belum ada barang dalam inventaris'}
          </p>
          {(searchTerm || stockFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStockFilter('all');
              }}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              Reset Filter
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 hover:border-purple-200">
              <div className="flex items-start justify-between mb-4">
                <div className="bg-purple-50 rounded-lg p-3">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  item.stock > 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.stock > 0 ? 'Tersedia' : 'Habis'}
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{item.name}</h3>
              <p className="text-gray-600 mb-4 text-sm line-clamp-3">{item.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-700">
                  <div className="bg-gray-100 rounded-lg px-3 py-1">
                    <span className="text-sm font-medium">
                      Stok: <span className="font-bold text-gray-900">{item.stock}</span>
                    </span>
                  </div>
                </div>
                
                <button
                  onClick={() => handleBorrow(item)}
                  disabled={item.stock === 0}
                  className={`px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-all duration-200 ${
                    item.stock > 0
                      ? 'bg-gradient-to-r from-purple-600 to-violet-600 text-white hover:from-purple-700 hover:to-violet-700 shadow-md hover:shadow-lg'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
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
import React, { useState, useEffect } from 'react';
import { User } from '../App';
import BorrowForm from './BorrowForm';
import ReturnForm from './ReturnForm';
import { Package, Plus, Minus } from 'lucide-react';

interface Item {
  id: number;
  name: string;
  description: string;
  stock: number;
}

interface InventoryListProps {
  user: User;
}

const InventoryList: React.FC<InventoryListProps> = ({ user }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [showReturnForm, setShowReturnForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/items', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (err) {
      console.error('Error fetching items:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

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

  if (loading) {
    return <div className="text-center py-8">Memuat data inventaris...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Daftar Inventaris</h2>
        <button
          onClick={handleReturn}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center"
        >
          <Minus className="h-4 w-4 mr-2" />
          Kembalikan Barang
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-gray-50 rounded-lg p-6 border">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-700">
                      Stok: <span className="font-semibold">{item.stock}</span>
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleBorrow(item)}
                    disabled={item.stock === 0}
                    className={`px-4 py-2 rounded-md text-sm font-medium flex items-center ${
                      item.stock > 0
                        ? 'bg-blue-600 text-white hover:bg-blue-700'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Pinjam
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">Belum ada barang dalam inventaris</p>
        </div>
      )}

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
          user={user}
          onSuccess={handleReturnSuccess}
          onCancel={() => setShowReturnForm(false)}
        />
      )}
    </div>
  );
};

export default InventoryList;
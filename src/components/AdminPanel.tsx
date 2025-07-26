import React, { useState } from 'react';
import { Package, Users, BarChart3, Shield, Database, Activity, History } from 'lucide-react';
import { getItems, getBorrowings } from '../utils/storage';
import BorrowingHistory from './BorrowingHistory';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const items = getItems();
  const borrowings = getBorrowings();
  const activeBorrowings = borrowings.filter(b => b.status === 'borrowed');
  const totalItems = items.reduce((sum, item) => sum + item.stock, 0);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'borrowings', label: 'Semua Peminjaman', icon: History },
    { id: 'analytics', label: 'Analytics', icon: Activity },
    { id: 'data', label: 'Data Management', icon: Database },
  ];

  return (
    <div>
      <div className="flex items-center mb-8">
        <div className="bg-red-100 rounded-lg p-3 mr-4">
          <Shield className="h-8 w-8 text-red-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Panel Administrator</h2>
          <p className="text-gray-600">Dashboard khusus untuk administrator sistem</p>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-6 border-b-2 font-medium text-sm flex items-center transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600 bg-red-50'
                    : 'border-transparent text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Total Barang</p>
                  <p className="text-3xl font-bold">{items.length}</p>
                </div>
                <Package className="h-12 w-12 text-blue-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">Total Stok</p>
                  <p className="text-3xl font-bold">{totalItems}</p>
                </div>
                <Database className="h-12 w-12 text-green-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Sedang Dipinjam</p>
                  <p className="text-3xl font-bold">{activeBorrowings.length}</p>
                </div>
                <Activity className="h-12 w-12 text-yellow-200" />
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Total Peminjaman</p>
                  <p className="text-3xl font-bold">{borrowings.length}</p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-200" />
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aktivitas Terbaru</h3>
            <div className="space-y-4">
              {borrowings.slice(0, 5).map((borrowing) => (
                <div key={borrowing.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      borrowing.status === 'borrowed' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}></div>
                    <div>
                      <p className="font-medium text-gray-900">{borrowing.item_name}</p>
                      <p className="text-sm text-gray-600">
                        {borrowing.status === 'borrowed' ? 'Dipinjam' : 'Dikembalikan'} oleh {borrowing.borrower_name}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(borrowing.borrow_date).toLocaleDateString('id-ID')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'borrowings' && (
        <div>
          <BorrowingHistory userType="admin" />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistik Peminjaman</h3>
            <div className="space-y-4">
              {items.map((item) => {
                const itemBorrowings = borrowings.filter(b => b.item_id === item.id);
                const borrowCount = itemBorrowings.length;
                const maxBorrows = Math.max(...items.map(i => borrowings.filter(b => b.item_id === i.id).length));
                const percentage = maxBorrows > 0 ? (borrowCount / maxBorrows) * 100 : 0;
                
                return (
                  <div key={item.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-gray-600">{borrowCount} kali dipinjam</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Export Data</h4>
                <p className="text-sm text-blue-700 mb-4">Download data inventaris dan peminjaman</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-sm">
                  Download CSV
                </button>
              </div>
              
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">Reset Data</h4>
                <p className="text-sm text-red-700 mb-4">Reset semua data ke kondisi awal</p>
                <button 
                  onClick={() => {
                    if (confirm('Apakah Anda yakin ingin reset semua data?')) {
                      localStorage.removeItem('inventaris_items');
                      localStorage.removeItem('inventaris_borrowings');
                      localStorage.removeItem('inventaris_next_id');
                      window.location.reload();
                    }
                  }}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm"
                >
                  Reset Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
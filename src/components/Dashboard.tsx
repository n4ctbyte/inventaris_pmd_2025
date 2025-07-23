import React, { useState } from 'react';
import { User } from '../App';
import InventoryList from './InventoryList';
import BorrowingHistory from './BorrowingHistory';
import AdminPanel from './AdminPanel';
import { Package, History, Settings, Sparkles } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { id: 'inventory', label: 'Inventaris', icon: Package, color: 'blue' },
    { id: 'history', label: 'Riwayat', icon: History, color: 'green' },
    ...(user.role === 'admin' ? [{ id: 'admin', label: 'Admin Panel', icon: Settings, color: 'purple' }] : []),
  ];

  const getTabStyles = (tab: any, isActive: boolean) => {
    const colors = {
      blue: isActive 
        ? 'border-blue-500 text-blue-600 bg-blue-50' 
        : 'border-transparent text-gray-500 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50',
      green: isActive 
        ? 'border-green-500 text-green-600 bg-green-50' 
        : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300 hover:bg-green-50',
      purple: isActive 
        ? 'border-purple-500 text-purple-600 bg-purple-50' 
        : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50',
    };
    return colors[tab.color as keyof typeof colors];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Selamat datang, {user.name}! 👋
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  {user.role === 'admin' 
                    ? 'Kelola inventaris dan pantau aktivitas peminjaman' 
                    : 'Pinjam barang yang Anda butuhkan untuk kegiatan'}
                </p>
              </div>
              <div className="hidden sm:block">
                <Sparkles className="h-16 w-16 text-blue-200" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 bg-gray-50">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 border-b-2 font-semibold text-sm flex items-center transition-all duration-200 ${getTabStyles(tab, isActive)}`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {tab.label}
                    {tab.id === 'admin' && (
                      <span className="ml-2 bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full">
                        Admin
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'inventory' && <InventoryList user={user} />}
            {activeTab === 'history' && <BorrowingHistory user={user} />}
            {activeTab === 'admin' && user.role === 'admin' && <AdminPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
import React, { useState } from 'react';
import InventoryList from './InventoryList';
import BorrowingHistory from './BorrowingHistory';
import ItemManagement from './ItemManagement';
import { Package, History, Settings, LogOut, Sparkles } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { id: 'inventory', label: 'Inventaris', icon: Package, color: 'blue' },
    { id: 'history', label: 'Riwayat', icon: History, color: 'green' },
    { id: 'manage', label: 'Kelola Barang', icon: Settings, color: 'purple' },
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
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl border-b border-blue-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 mr-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Inventaris Permuridhis</h1>
                <p className="text-sm text-blue-100 hidden sm:block">Persatuan Mahasiswa-Mahasiswi UNRI Buddhis</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <button
                onClick={onLogout}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg transition-all duration-200 flex items-center font-medium border border-white/20 hover:border-white/30"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  Sistem Inventaris Permuridhis 📦
                </h1>
                <p className="text-blue-100 text-sm sm:text-base">
                  Kelola inventaris organisasi dengan mudah dan efisien
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
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6 sm:p-8">
            {activeTab === 'inventory' && <InventoryList />}
            {activeTab === 'history' && <BorrowingHistory />}
            {activeTab === 'manage' && <ItemManagement />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
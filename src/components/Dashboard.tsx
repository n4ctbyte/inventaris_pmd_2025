import React, { useState } from 'react';
import InventoryList from './InventoryList';
import BorrowingHistory from './BorrowingHistory';
import ItemManagement from './ItemManagement';
import AdminPanel from './AdminPanel';
import { Package, History, Settings, LogOut, Sparkles } from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  userType: 'user' | 'admin';
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout, userType }) => {
  const [activeTab, setActiveTab] = useState('inventory');

  const userTabs = [
    { id: 'inventory', label: 'Inventaris', icon: Package, color: 'blue' },
    { id: 'history', label: 'Riwayat', icon: History, color: 'green' },
    { id: 'manage', label: 'Kelola Barang', icon: Settings, color: 'purple' },
  ];

  const adminTabs = [
    { id: 'inventory', label: 'Inventaris', icon: Package, color: 'blue' },
    { id: 'history', label: 'Riwayat', icon: History, color: 'green' },
    { id: 'manage', label: 'Kelola Barang', icon: Settings, color: 'purple' },
    { id: 'admin', label: 'Panel Admin', icon: Settings, color: 'red' },
  ];

  const tabs = userType === 'admin' ? adminTabs : userTabs;

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
      red: isActive 
        ? 'border-red-500 text-red-600 bg-red-50' 
        : 'border-transparent text-gray-500 hover:text-red-600 hover:border-red-300 hover:bg-red-50',
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
            
            <div className="flex items-center space-x-4">
              {userType === 'admin' && (
                <div className="hidden sm:flex items-center bg-red-500/20 backdrop-blur-sm px-3 py-1 rounded-lg border border-red-400/30">
                  <Settings className="h-4 w-4 mr-2 text-red-200" />
                  <span className="text-sm font-medium text-red-100">Administrator</span>
                </div>
              )}
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
            {activeTab === 'admin' && userType === 'admin' && <AdminPanel />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
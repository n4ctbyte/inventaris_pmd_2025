import React, { useState, Suspense } from 'react';
import { Package, History, Settings, LogOut, Crown } from 'lucide-react';

const InventoryList = React.lazy(() => import('./InventoryList'));
const BorrowingHistory = React.lazy(() => import('./BorrowingHistory'));
const ItemManagement = React.lazy(() => import('./ItemManagement'));
const AdminPanel = React.lazy(() => import('./AdminPanel'));

interface DashboardProps {
  onLogout: () => void;
  userType: 'user' | 'admin';
}

// Komponen Fallback untuk ditampilkan saat komponen sedang diunduh
const TabContentLoading = () => (
  <div className="flex items-center justify-center p-10">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ onLogout, userType }) => {
  const [activeTab, setActiveTab] = useState('inventory');

  const userTabs = [
    { id: 'inventory', label: 'Inventaris', icon: Package, color: 'blue' },
    { id: 'history', label: 'Riwayat', icon: History, color: 'blue' },
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
        ? 'border-purple-500 text-purple-600 bg-purple-50' 
        : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50',
      green: isActive 
        ? 'border-green-500 text-green-600 bg-green-50' 
        : 'border-transparent text-gray-500 hover:text-green-600 hover:border-green-300 hover:bg-green-50',
      purple: isActive 
        ? 'border-violet-500 text-violet-600 bg-violet-50' 
        : 'border-transparent text-gray-500 hover:text-violet-600 hover:border-violet-300 hover:bg-violet-50',
      red: isActive 
        ? 'border-amber-500 text-amber-600 bg-amber-50' 
        : 'border-transparent text-gray-500 hover:text-amber-600 hover:border-amber-300 hover:bg-amber-50',
    };
    return colors[tab.color as keyof typeof colors];
  };

  // Fungsi untuk merender konten tab yang aktif
  const renderTabContent = () => {
    switch (activeTab) {
      case 'inventory':
        return <InventoryList />;
      case 'history':
        return <BorrowingHistory userType={userType} />;
      case 'manage':
        return userType === 'admin' ? <ItemManagement /> : null;
      case 'admin':
        return userType === 'admin' ? <AdminPanel /> : null;
      default:
        return <InventoryList />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50 relative overflow-hidden">
      {/* ... (semua JSX untuk background dan Navbar Anda tetap sama persis) ... */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse-soft"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-violet-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse-soft" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-pulse-soft" style={{animationDelay: '4s'}}></div>
      </div>
      
      <nav className="bg-gradient-to-r from-purple-600 via-purple-700 to-violet-700 text-white shadow-2xl border-b border-purple-500/50 backdrop-blur-xl relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 mr-4 floating shadow-lg">
                <Package className="h-8 w-8 text-white drop-shadow-sm" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-wide">PRIME</h1>
                <p className="text-sm text-purple-100 hidden sm:block font-medium opacity-90">Permuridhis Resource and Inventory Management Ecosystem</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {userType === 'admin' && (
              <>
                <div className="flex sm:hidden items-center bg-amber-500/20 px-2 py-1 rounded-lg border border-amber-400/30 shadow-md">
                  <Crown className="h-4 w-4 text-amber-200" />
                </div>
                <div className="hidden sm:flex items-center bg-amber-500/20 backdrop-blur-sm px-4 py-2 rounded-xl border border-amber-400/30 shadow-lg animate-slide-in-right">
                  <Crown className="h-4 w-4 mr-2 text-amber-200" />
                  <span className="text-sm font-semibold text-amber-100">Administrator</span>
                </div>
              </>
            )}
              <button
                onClick={onLogout}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl transition-all duration-300 flex items-center font-semibold border border-white/20 hover:border-white/30 shadow-lg transform hover:-translate-y-0.5 hover:shadow-xl"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 relative z-10">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden animate-fade-in-scale mt-6">
          <div className="border-b border-gray-200/50 bg-gradient-to-r from-gray-50/80 to-white/80 backdrop-blur-sm">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-6 border-b-2 font-semibold text-sm flex items-center transition-all duration-300 whitespace-nowrap transform hover:-translate-y-0.5 ${getTabStyles(tab, isActive)}`}
                  >
                    <Icon className={`h-5 w-5 mr-2 ${isActive ? 'animate-pulse' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ================================================================== */}
          {/* --- LANGKAH 2: BUNGKUS KONTEN TAB DENGAN <Suspense> --- */}
          {/* ================================================================== */}
          <div className="p-6 sm:p-8 page-transition">
            <Suspense fallback={<TabContentLoading />}>
              {renderTabContent()}
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
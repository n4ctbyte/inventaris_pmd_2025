import React, { useState } from 'react';
import { User } from '../App';
import InventoryList from './InventoryList';
import BorrowingHistory from './BorrowingHistory';
import AdminPanel from './AdminPanel';
import { Package, History, Settings } from 'lucide-react';

interface DashboardProps {
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('inventory');

  const tabs = [
    { id: 'inventory', label: 'Inventaris', icon: Package },
    { id: 'history', label: 'Riwayat', icon: History },
    ...(user.role === 'admin' ? [{ id: 'admin', label: 'Admin', icon: Settings }] : []),
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm flex items-center ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'inventory' && <InventoryList user={user} />}
          {activeTab === 'history' && <BorrowingHistory user={user} />}
          {activeTab === 'admin' && user.role === 'admin' && <AdminPanel />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
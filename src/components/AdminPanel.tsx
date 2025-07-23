import React, { useState } from 'react';
import ItemManagement from './admin/ItemManagement';
import UserManagement from './admin/UserManagement';
import { Package, Users } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('items');

  const tabs = [
    { id: 'items', label: 'Kelola Barang', icon: Package },
    { id: 'users', label: 'Kelola Pengguna', icon: Users },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Panel Administrator</h2>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'items' && <ItemManagement />}
      {activeTab === 'users' && <UserManagement />}
    </div>
  );
};

export default AdminPanel;
import React from 'react';
import { User } from '../App';
import { LogOut, Package } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Package className="h-8 w-8 mr-3" />
            <div>
              <h1 className="text-xl font-bold">Inventaris Permuridhis</h1>
              <p className="text-sm text-blue-200">Persatuan Mahasiswa-Mahasiswi UNRI Buddhis</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-blue-200">
                {user.role === 'admin' ? 'Administrator' : 'Mahasiswa'}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="bg-blue-700 hover:bg-blue-800 px-4 py-2 rounded-md transition-colors flex items-center"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Keluar
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
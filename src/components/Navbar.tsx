import React from 'react';
import { User } from '../App';
import { LogOut, Package, Crown, User as UserIcon } from 'lucide-react';

interface NavbarProps {
  user: User;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-xl border-b border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 mr-4">
              <Package className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">PRIME</h1>
              <p className="text-sm text-blue-100 hidden sm:block">Permuridhis Resource and Inevntory Management Ecosystem</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden sm:block text-right">
              <div className="flex items-center">
                {user.role === 'admin' ? (
                  <Crown className="h-4 w-4 mr-2 text-yellow-300" />
                ) : (
                  <UserIcon className="h-4 w-4 mr-2 text-blue-200" />
                )}
                <div>
                  <p className="font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-blue-200">
                    {user.role === 'admin' ? 'Administrator' : 'Mahasiswa'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="h-8 w-px bg-blue-400"></div>
            
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
  );
};

export default Navbar;
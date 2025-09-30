import React, { useState } from 'react';
import { Menu as MenuIcon, ChevronDown, LogOut, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  username: string;
  balance: number;
  toggleSidebar: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, balance, toggleSidebar, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 lg:hidden">
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block ml-4">Bem-vindo(a), <span className="font-bold">{username}</span></h1>
      </div>
      <div className="flex items-center space-x-6">
        <p className={`text-lg font-semibold ${balance > 0 ? 'text-green-600' : 'text-gray-500'}`}>
          Saldo: {balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        <div className="relative">
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="flex items-center space-x-2">
            <span className="font-medium hidden sm:inline">{username}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-40">
              <Link to="/perfil" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <User className="w-4 h-4 mr-2" />
                Meu Perfil
              </Link>
              <button onClick={onLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

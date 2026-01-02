import React from 'react';
import { Menu as MenuIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BalanceDisplay from './BalanceDisplay';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { profile } = useAuth();

  return (
    <header className="bg-white/90 backdrop-blur border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-30">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="text-gray-600 hover:text-gray-800 lg:hidden">
          <MenuIcon className="w-6 h-6" />
        </button>
        <h1 className="text-gray-800 hidden md:block ml-4 text-base">
          <span className="font-normal">Bem-vindo(a), </span>
          <span className="font-semibold">{profile?.name || 'Usuário'}</span>
        </h1>
      </div>
      <div className="flex items-center space-x-4">
        <Link to="/recarga-creditos" title="Adicionar créditos">
          <BalanceDisplay />
        </Link>
      </div>
    </header>
  );
};

export default Header;

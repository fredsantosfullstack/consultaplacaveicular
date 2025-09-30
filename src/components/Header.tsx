import React from 'react';
import { Menu } from 'lucide-react';

interface HeaderProps {
  username: string;
  balance: number;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, balance, toggleSidebar }) => {
  const isZeroBalance = balance === 0;
  const balanceColor = isZeroBalance ? 'text-gray-500' : 'text-green-600';

  return (
    <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-10">
      <div className="flex items-center">
        <button onClick={toggleSidebar} className="md:hidden mr-4 text-gray-600">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 hidden md:block">Bem-vindo(a), <span className="font-bold">{username}</span></h1>
      </div>
      <div className="flex items-center">
         <p className={`text-lg font-semibold ${balanceColor}`}>
            Saldo: <span className="font-bold">{balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
         </p>
      </div>
    </header>
  );
};

export default Header;

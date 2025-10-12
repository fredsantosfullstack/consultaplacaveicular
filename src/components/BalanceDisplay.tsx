import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const BalanceDisplay: React.FC = () => {
  const { profile } = useAuth();

  const formatBalance = (balance: number | undefined) => {
    if (balance === undefined || balance === null || isNaN(balance)) {
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(0);
    }
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance);
  };

  return (
    <div className="bg-white px-4 py-2 rounded-lg">
      <span className="text-gray-600">Saldo: </span>
      <span className="font-bold text-lg text-[#000042]">{formatBalance(profile?.balance)}</span>
    </div>
  );
};

export default BalanceDisplay;

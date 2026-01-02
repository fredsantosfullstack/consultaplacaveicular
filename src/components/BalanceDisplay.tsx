import React from 'react';
import { Wallet } from 'lucide-react';
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
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <p className="text-[0.72rem] font-semibold uppercase text-gray-500">
        Saldo disponível
      </p>
      <p className="text-[1.55rem] font-bold leading-none text-[#076AC2]">
        {formatBalance(profile?.balance)}
      </p>
    </div>
  );
};

export default BalanceDisplay;

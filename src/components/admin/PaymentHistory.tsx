import React, { useState, useEffect } from 'react';
import { Loader2, Filter, Search } from 'lucide-react';
import api from '../../services/api';

interface Transaction {
  id: number;
  user_id: number;
  user_name: string;
  user_email: string;
  asaas_payment_id: string;
  amount: number;
  credits: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'expired';
  payment_method: string;
  created_at: string;
  paid_at: string | null;
  plan_name: string;
}

const PaymentHistory: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter, searchTerm]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/payments/history/all', {
        params: { 
          status: statusFilter,
          search: searchTerm || undefined
        }
      });
      setTransactions(response.data.transactions);
    } catch (error) {
      console.error('Erro ao buscar histórico:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      confirmed: 'bg-green-100 text-green-700',
      pending: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700',
      expired: 'bg-gray-100 text-gray-700'
    };
    const labels = {
      confirmed: 'Confirmado',
      pending: 'Pendente',
      cancelled: 'Cancelado',
      expired: 'Expirado'
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${badges[status] || badges.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Histórico de Pagamentos</h2>
        <p className="text-gray-500 mt-1">Visualize todas as transações dos usuários.</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#076AC2]"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#076AC2]"
          >
            <option value="all">Todos os Status</option>
            <option value="confirmed">Confirmado</option>
            <option value="pending">Pendente</option>
            <option value="cancelled">Cancelado</option>
            <option value="expired">Expirado</option>
          </select>
        </div>
      </div>

      {/* Tabela */}
      {isLoading ? (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="animate-spin" size={48} />
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center p-10 text-gray-500">
          Nenhuma transação encontrada.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Usuário</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Data</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Plano</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Valor</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Créditos</th>
                <th className="py-3 px-4 text-center text-sm font-semibold text-gray-600">Status</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600">Pagamento</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <p className="text-sm font-medium text-gray-800">{transaction.user_name}</p>
                      <p className="text-xs text-gray-500">{transaction.user_email}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {new Date(transaction.created_at).toLocaleString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-800">
                    {transaction.plan_name}
                  </td>
                  <td className="py-3 px-4 text-sm font-semibold text-gray-800">
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-700">
                    {transaction.credits}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {getStatusBadge(transaction.status)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {transaction.paid_at 
                      ? new Date(transaction.paid_at).toLocaleString('pt-BR')
                      : '-'
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;

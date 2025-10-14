import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Loader2 } from 'lucide-react';
import api from '../src/services/api';

interface Order {
  id: number;
  placa: string;
  renavam: string;
  cpf_cnpj: string;
  uf: string;
  price: number;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  created_at: string;
  updated_at: string;
}

const MyOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('todos');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/crlve-orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNovoPedido = () => {
    navigate('/consulta/crlve');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento':
        return 'bg-blue-100 text-blue-800';
      case 'concluido':
        return 'bg-green-100 text-green-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente':
        return 'Pendente';
      case 'em_andamento':
        return 'Em Andamento';
      case 'concluido':
        return 'Concluído';
      case 'cancelado':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredOrders = statusFilter === 'todos' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Meus Pedidos</h1>

      {/* Filtros e Ações */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-600">Status:</label>
            <select 
              id="status-filter" 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-auto p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:bg-white focus:border-[#000042] focus:outline-none focus:ring-2 focus:ring-[#000042]/30"
            >
              <option value="todos">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
              <option value="cancelado">Cancelado</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleNovoPedido}
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#000042] text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90 transition-all text-sm"
            >
              <Plus size={16} />
              <span>Novo Pedido</span>
            </button>
            <a 
              href="https://wa.me/5579991187607?text=Ol%C3%A1%2C%20vim%20pelo%20painel%20e%20preciso%20de%20suporte%21"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-all text-sm"
            >
              <MessageSquare size={16} />
              <span>Solicitar Suporte</span>
            </a>
          </div>
        </div>
      </div>

      {/* Tabela de Pedidos */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-[#000042]" />
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-[#000042] text-white">
              <tr>
                <th className="px-6 py-3 font-semibold">Placa</th>
                <th className="px-6 py-3 font-semibold">Renavam</th>
                <th className="px-6 py-3 font-semibold">UF</th>
                <th className="px-6 py-3 font-semibold">Valor</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Data</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-gray-500">
                    <p>Nenhum pedido encontrado.</p>
                    <p className="text-xs mt-1">Crie um novo pedido para começar.</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{order.placa}</td>
                    <td className="px-6 py-4 text-gray-600">{order.renavam}</td>
                    <td className="px-6 py-4 text-gray-600">{order.uf}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">
                      R$ {order.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600 text-xs">
                      {formatDate(order.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
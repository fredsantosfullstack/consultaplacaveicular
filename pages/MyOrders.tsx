import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MessageSquare, Filter } from 'lucide-react';

const MyOrders: React.FC = () => {
  const navigate = useNavigate();

  const handleNovoPedido = () => {
    navigate('/consulta/crlve');
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Meus Pedidos</h1>

      {/* Filtros e Ações */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="status-filter" className="text-sm font-medium text-gray-600">Status:</label>
            <select id="status-filter" className="w-auto p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:bg-white focus:border-[#000042] focus:outline-none focus:ring-2 focus:ring-[#000042]/30">
              <option>Todos</option>
              <option>Pendente</option>
              <option>Em Andamento</option>
              <option>Concluído</option>
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
              href="https://wa.me/5583998554839?text=Ol%C3%A1%2C%20vim%20pelo%20painel%20e%20preciso%20de%20suporte%21"
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
        <table className="w-full text-left text-sm">
          <thead className="bg-[#000042] text-white">
            <tr>
              <th className="px-6 py-3 font-semibold">Cliente</th>
              <th className="px-6 py-3 font-semibold">Placa</th>
              <th className="px-6 py-3 font-semibold">Renavam</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Data</th>
              <th className="px-6 py-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={6} className="text-center py-16 text-gray-500">
                <p>Nenhum pedido encontrado.</p>
                <p className="text-xs mt-1">Crie um novo pedido para começar.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
import React from 'react';
import { Calendar, Search, Filter } from 'lucide-react';

const FilterField = ({ label, children }) => (
  <div>
    <label className="text-xs text-gray-500 font-medium">{label}</label>
    <div className="relative mt-1">{children}</div>
  </div>
);

const ConsultationHistory: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Histórico de Consultas</h1>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
          <FilterField label="Tipo de Consulta">
            <select className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:bg-white focus:border-[#000042] focus:outline-none focus:ring-2 focus:ring-[#000042]/30">
              <option>Todos</option>
              {/* Adicionar outros tipos de consulta aqui */}
            </select>
          </FilterField>
          <FilterField label="Data Inicial">
            <input type="date" className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:bg-white focus:border-[#000042] focus:outline-none focus:ring-2 focus:ring-[#000042]/30" />
          </FilterField>
          <FilterField label="Data Final">
            <input type="date" className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:bg-white focus:border-[#000042] focus:outline-none focus:ring-2 focus:ring-[#000042]/30" />
          </FilterField>
          <FilterField label="Mostrar">
            <select className="w-full p-2 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:bg-white focus:border-[#000042] focus:outline-none focus:ring-2 focus:ring-[#000042]/30">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </FilterField>
          <button className="flex items-center justify-center gap-2 w-full bg-[#000042] text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-opacity-90 transition-all text-sm">
            <Filter size={16} />
            <span>Filtrar</span>
          </button>
        </div>
      </div>

      {/* Tabela de Resultados */}
      <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#000042] text-white">
            <tr>
              <th className="px-6 py-3 font-semibold">Placa</th>
              <th className="px-6 py-3 font-semibold">Tipo de Consulta</th>
              <th className="px-6 py-3 font-semibold">Data</th>
              <th className="px-6 py-3 font-semibold">Status</th>
              <th className="px-6 py-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Exemplo de quando não há dados */}
            <tr>
              <td colSpan={5} className="text-center py-16 text-gray-500">
                <p>Nenhuma consulta encontrada.</p>
                <p className="text-xs mt-1">Tente ajustar os filtros ou realize uma nova consulta.</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ConsultationHistory;
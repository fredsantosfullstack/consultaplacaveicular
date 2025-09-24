import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

interface PriceItem {
  id: string;
  name: string;
  price: number;
}

interface PriceTableProps {
  priceData: PriceItem[];
}

const PriceTable: React.FC<PriceTableProps> = ({ priceData }) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-full flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tabela de Preços Padrão</h1>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#0f43aa]">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Nome Exibição
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                  Valor (R$)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priceData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.price.toFixed(2).replace('.', ',')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 bg-[#0f43aa] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0c3688] transition-colors"
          >
            <FaArrowLeft />
            <span>Voltar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PriceTable;
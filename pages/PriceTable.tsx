import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

const priceData = [
  { name: 'Base Estadual', price: 5.00 },
  { name: 'Base Nacional', price: 5.00 },
  { name: 'Consulta ATPV-E', price: 30.00 },
  { name: 'Consulta Cautelar', price: 29.90 },
  { name: 'Consulta Comunicado de Venda', price: 5.00 },
  { name: 'Consulta Gravame', price: 5.00 },
  { name: 'Consulta Leilão Simples', price: 9.99 },
  { name: 'Consulta Rápida por Chassi', price: 3.00 },
  { name: 'Consulta Rápida por Placa', price: 3.00 },
  { name: 'Consulta Renajud', price: 7.00 },
  { name: 'CRLV-E AC', price: 24.90 },
  { name: 'CRLV-E AP', price: 7.00 },
  { name: 'CRLV-E BA', price: 25.00 },
  { name: 'CRLV-E GO', price: 14.90 },
  { name: 'CRLV-E MA', price: 7.00 },
  { name: 'CRLV-E MG', price: 10.00 },
  { name: 'CRLV-E MT', price: 7.00 },
  { name: 'CRLV-E PE', price: 24.90 },
  { name: 'CRLV-E PI', price: 25.00 },
  { name: 'CRLV-E PR', price: 10.00 },
  { name: 'CRLV-E RO', price: 19.90 },
  { name: 'CRLV-E RR', price: 20.00 },
  { name: 'CRLV-E SE', price: 20.00 },
  { name: 'CRLV-E SP', price: 10.00 },
  { name: 'CRLV-E TO', price: 7.00 },
  { name: 'CRV Digital (PDF)', price: 9.99 },
  { name: 'Licenciamento + BIN Nacional', price: 5.00 },
  { name: 'N° CRV + Código de segurança', price: 9.99 },
  { name: 'Validação CRV', price: 0.00 },
];

const PriceTable: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 sm:p-6 md:p-8 bg-gray-100 min-h-full flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6 sm:p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Tabela de Preços Padrão</h1>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-700">
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
              {priceData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
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
            className="flex items-center space-x-2 bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
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
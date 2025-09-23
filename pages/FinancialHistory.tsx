import React from 'react';
import { Page } from '../types';
import { FaArrowLeft } from 'react-icons/fa';

interface FinancialHistoryProps {
  setCurrentPage: (page: Page) => void;
}

const FinancialHistory: React.FC<FinancialHistoryProps> = ({ setCurrentPage }) => {
  const recharges: { client: string, value: string, status: string, date: string }[] = [];

  return (
    <div className="p-8 space-y-6">
      <button onClick={() => setCurrentPage(Page.Dashboard)} className="flex items-center space-x-2 text-blue-600 hover:underline">
        <FaArrowLeft className="w-4 h-4" />
        <span>Voltar</span>
      </button>

      <div className="bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Recargas Realizadas</h1>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead>
                      <tr className="border-b-2 border-gray-200">
                          <th className="py-3 px-4 font-semibold text-gray-600">Cliente</th>
                          <th className="py-3 px-4 font-semibold text-gray-600">Valor</th>
                          <th className="py-3 px-4 font-semibold text-gray-600">Status</th>
                          <th className="py-3 px-4 font-semibold text-gray-600">Data</th>
                      </tr>
                  </thead>
                  <tbody>
                      {recharges.map((recharge, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-3 px-4 text-gray-700">{recharge.client}</td>
                              <td className="py-3 px-4 text-gray-700">{recharge.value}</td>
                              <td className="py-3 px-4">
                                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">{recharge.status}</span>
                              </td>
                              <td className="py-3 px-4 text-gray-700">{recharge.date}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default FinancialHistory;
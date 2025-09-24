import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FinancialHistoryProps {
  // setCurrentPage: (page: Page) => void; // Removed
}

const FinancialHistory: React.FC<FinancialHistoryProps> = () => { // Removed setCurrentPage from props
  const recharges: { client: string, value: string, status: string, date: string }[] = [];
  const navigate = useNavigate();

  return (
    <div className="p-8 space-y-6">
      <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-[#002672] hover:underline">
        <ArrowLeft className="w-4 h-4" />
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
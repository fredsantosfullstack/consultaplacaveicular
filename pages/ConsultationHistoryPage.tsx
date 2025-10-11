import React, { useState, useEffect } from 'react';
import api from '../src/services/api';
import UserLayout from '../src/layouts/UserLayout';
import { Loader2, Search, FileDown } from 'lucide-react';

interface Consultation {
  id: number;
  plate: string;
  consultation_type: string;
  created_at: string;
  status: string;
}

const ConsultationHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/consultations/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Erro ao buscar histórico', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <UserLayout>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-[#000042] text-white px-6 py-4">
          <h1 className="text-lg font-semibold">Histórico de Consultas</h1>
        </div>
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-[#000042]" size={32} />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhuma consulta encontrada.</p>
              <p className="text-sm text-gray-400">Tente realizar uma nova consulta.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#000042] text-white text-sm whitespace-nowrap">
                    <th className="p-3">Placa</th>
                    <th className="p-3">Tipo de Consulta</th>
                    <th className="p-3">Data</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 text-sm">
                      <td className="p-3 font-mono">{item.plate}</td>
                      <td className="p-3">{item.consultation_type}</td>
                      <td className="p-3">{new Date(item.created_at).toLocaleString('pt-BR')}</td>
                      <td className="p-3"><span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.status === 'CONCLUIDA' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{item.status}</span></td>
                      <td className="p-3"><button className="text-[#000042] hover:text-opacity-80"><FileDown size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default ConsultationHistoryPage;

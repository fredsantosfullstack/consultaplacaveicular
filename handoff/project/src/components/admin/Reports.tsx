import React, { useState, useEffect } from 'react';
import { Users, DollarSign, FileText, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface ReportData {
  totalUsers: number;
  totalRevenue: number;
  totalConsultations: number;
}

const Reports: React.FC = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/reports');
        setData(response.data);
      } catch (error) {
        console.error('Falha ao buscar relatórios', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-20">
        <Loader2 className="animate-spin text-[#000042]" size={48} />
      </div>
    );
  }

  if (!data) {
    return <p>Não foi possível carregar os dados do relatório.</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard de Relatórios</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ReportCard 
          icon={<Users size={32} className="text-[#000042]" />} 
          title="Total de Usuários"
          value={data.totalUsers}
        />
        <ReportCard 
          icon={<DollarSign size={32} className="text-[#000042]" />} 
          title="Faturamento Total"
          value={`R$ ${data.totalRevenue.toFixed(2).replace('.', ',')}`}
        />
        <ReportCard 
          icon={<FileText size={32} className="text-[#000042]" />} 
          title="Total de Consultas"
          value={data.totalConsultations}
        />
      </div>
    </div>
  );
};

// Componente auxiliar para os cards
const ReportCard = ({ icon, title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center gap-6">
    <div className="bg-gray-100 p-4 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  </div>
);

export default Reports;

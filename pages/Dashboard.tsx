import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import { supabase } from '../src/supabaseClient';
import { DollarSign, FileText } from 'lucide-react';
import UserLayout from '../src/layouts/UserLayout';
import ConsultationModal from '../src/components/ConsultationModal';
import LoadingSpinner from '../src/components/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [stats, setStats] = useState<any>({ totalConsultas: 0, ultimasConsultas: [] });
  const [availableConsultations, setAvailableConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedConsultation, setSelectedConsultation] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!profile) return;

      setIsLoading(true);
      try {
        const { count, error: countError } = await supabase
          .from('consultations')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', profile.id);

        const { data: recent, error: recentError } = await supabase
          .from('consultations')
          .select('*, prices(service_name)')
          .eq('user_id', profile.id)
          .order('created_at', { ascending: false })
          .limit(5);

        const { data: prices, error: pricesError } = await supabase
          .from('prices')
          .select('*')
          .eq('status', 'active');

        if (countError || recentError || pricesError) {
          throw countError || recentError || pricesError;
        }

        setStats({ totalConsultas: count || 0, ultimasConsultas: recent || [] });
        setAvailableConsultations(prices || []);

      } catch (error: any) {
        console.error('Error fetching dashboard data:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    if (profile) {
      fetchData();
    }
  }, [profile]);

  const handleConsultationSelect = (consultation: any) => {
    setSelectedConsultation(consultation);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading && !profile) {
    return <UserLayout><div className="flex justify-center items-center h-64"><LoadingSpinner /></div></UserLayout>;
  }

  return (
    <UserLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Painel de Controle</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard icon={DollarSign} title="Saldo Atual" value={`R$ ${profile?.balance?.toFixed(2) ?? '0.00'}`} color="green" />
          <StatCard icon={FileText} title="Consultas no Mês" value={stats.totalConsultas} color="blue" />
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Consultas Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableConsultations.map((consult) => (
              <ConsultationCard 
                key={consult.id} 
                {...consult} 
                onSelect={() => handleConsultationSelect(consult)} 
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Histórico Recente</h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {stats.ultimasConsultas.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.ultimasConsultas.map((item: any) => (
                  <li key={item.id} className="py-3 flex justify-between items-center">
                    <div>
                      <p className="font-medium text-gray-800">{item.prices?.service_name || 'Serviço Desconhecido'}</p>
                      <p className="text-sm text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
                    </div>
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {item.status}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">Nenhuma consulta recente.</p>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && selectedConsultation && (
        <ConsultationModal 
          consultation={selectedConsultation} 
          onClose={handleCloseModal} 
        />
      )}
    </UserLayout>
  );
};

const StatCard = ({ icon: Icon, title, value, color }: {icon: React.ElementType, title: string, value: string | number, color: string}) => (
  <div className={`bg-white p-6 rounded-lg shadow-sm flex items-center space-x-4 border-l-4 border-${color}-500`}>
    <div className={`bg-${color}-100 p-3 rounded-full`}>
      <Icon className={`h-6 w-6 text-${color}-600`} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const ConsultationCard = ({ service_name, price, onSelect }: {service_name: string, price: number, onSelect: () => void}) => (
    <div 
        className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer border-l-4 border-transparent hover:border-blue-500 flex flex-col justify-between"
        onClick={onSelect}
    >
        <h3 className="text-xl font-bold text-gray-800 mb-4">{service_name}</h3>
        <p className="text-lg font-semibold text-green-600 self-end">R$ {Number(price).toFixed(2)}</p>
    </div>
);

export default Dashboard;
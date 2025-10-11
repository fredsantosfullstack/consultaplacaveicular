import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, FileText, ShieldCheck, Search, User, Loader2, AlertTriangle } from 'lucide-react';
import api from '../src/services/api';
import { useAuth } from '../src/contexts/AuthContext';

// Mapeamento de ícones para ser usado dinamicamente
const iconMap: { [key: string]: React.ElementType } = {
  Car,
  FileText,
  ShieldCheck,
  User,
  Default: Search // Ícone padrão
};

interface ConsultationCardProps {
  title: string;
  slug: string;
  description: string;
  icon: React.ElementType;
  tag?: string;
  price: number;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ title, slug, description, icon: Icon, tag, price }) => {
  
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="bg-[#000042] text-white px-4 py-3 flex items-center gap-3 min-h-[70px]">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <h3 className="font-semibold text-sm uppercase break-words">{title}</h3>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-xs text-gray-600 min-h-[40px]">{description}</p>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-left">
          <p className="text-xs text-gray-500">Por apenas</p>
          <p className="text-xl font-bold text-gray-800">{price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
        </div>
        
        {tag && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{tag}</span>}
        
        <a 
          href={`http://localhost:3001/consultas/${slug}.html`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-transparent border-2 border-[#000042] text-[#000042] font-bold py-1.5 px-4 rounded-md hover:bg-[#000042] hover:text-white transition-colors duration-300 text-sm text-center"
        >
          Consultar
        </a>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    const fetchConsultations = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/consultations');
        setConsultations(response.data);
      } catch (err) {
        setError('Não foi possível carregar as consultas. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchConsultations();
  }, []);

  const filteredConsultations = consultations.filter(consultation =>
    (consultation.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (consultation.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-10">
        <Loader2 className="animate-spin text-[#000042]" size={48} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-10 bg-red-50 border border-red-200 rounded-lg">
        <AlertTriangle className="text-red-500" size={48} />
        <p className="mt-4 text-red-700 font-semibold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Pesquise por nome ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full py-3 pl-10 pr-4 border-2 border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000042]"
          />
        </div>

        <div id="consultation-cards" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredConsultations.map(consultation => (
            <ConsultationCard
              key={consultation.id}
              title={consultation.name}
              slug={consultation.slug}
              description={consultation.description}
              icon={iconMap[consultation.icon] || iconMap.Default}
              tag={consultation.is_new ? 'NOVO' : undefined}
              price={consultation.price}
            />
          ))}
        </div>

      
          </div>
  );
};

export default Dashboard;
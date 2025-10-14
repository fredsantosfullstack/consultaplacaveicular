import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Car, FileText, ShieldCheck, Search, User, Loader2, AlertTriangle } from 'lucide-react';
import api, { publicApi } from '../src/services/api';
import { useAuth } from '../src/contexts/AuthContext';

// Mapeamento de ícones para ser usado dinamicamente
const iconMap: { [key: string]: React.ElementType } = {
  Car,
  FileText,
  ShieldCheck,
  User,
  Default: Search // Ícone padrão
};

const normalizeSlug = (slug?: string | null) => {
  if (!slug) return '';
  let cleaned = slug.trim();
  cleaned = cleaned.replace(/^https?:\/\/[^/]+/i, '');
  cleaned = cleaned.replace(/^\/+/g, '');
  cleaned = cleaned.replace(/\.html$/i, '');
  if (cleaned.startsWith('consultas/')) {
    cleaned = cleaned.slice('consultas/'.length);
  }
  if (cleaned.startsWith('consulta/')) {
    cleaned = cleaned.slice('consulta/'.length);
  }
  return cleaned;
};

interface ConsultationCardProps {
  title: string;
  slug: string;
  description: string;
  icon: React.ElementType;
  tag?: string;
  price: number;
  priceOnRequest?: boolean;
  states?: Array<{ state_code: string; state_name: string; price: number; is_active: boolean }>;
}

const ConsultationCard: React.FC<ConsultationCardProps> = ({ title, slug, description, icon: Icon, tag, price, priceOnRequest, states }) => {
  const normalizedSlug = normalizeSlug(slug);
  const isDisabled = !normalizedSlug;
  const linkClassName = [
    'bg-transparent border-2 border-[#000042] text-[#000042] font-bold py-1.5 px-4 rounded-md transition-colors duration-300 text-sm text-center inline-block',
    isDisabled ? 'pointer-events-none opacity-60' : 'hover:bg-[#000042] hover:text-white'
  ].join(' ');

  // Filtrar apenas estados ativos
  const activeStates = states?.filter(s => s.is_active) || [];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div className="bg-[#000042] text-white px-4 py-3 flex items-center gap-3 min-h-[70px]">
        <Icon className="w-5 h-5 flex-shrink-0" />
        <h3 className="font-semibold text-sm uppercase break-words">{title}</h3>
      </div>
      <div className="p-4 flex-grow">
        <p className="text-xs text-gray-600 mb-2">{description}</p>
        {activeStates.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-700 mb-2">Estados Disponíveis:</p>
            <div className="grid grid-cols-2 gap-1 text-xs">
              {activeStates.map((state) => (
                <div key={state.state_code} className="flex justify-between items-center py-1">
                  <span className="font-medium text-gray-700">{state.state_code}</span>
                  <span className="text-[#000042] font-bold">{Number(state.price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
        <div className="text-left">
          {priceOnRequest ? (
            <>
              <p className="text-xs text-gray-500">Valor</p>
              <p className="text-lg font-bold text-[#000042]">Sob Consulta</p>
            </>
          ) : (
            <>
              <p className="text-xs text-gray-500">Por apenas</p>
              <p className="text-xl font-bold text-gray-800">{price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
            </>
          )}
        </div>
        
        {tag && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{tag}</span>}
        
        <Link 
          to={normalizedSlug ? `/consulta/${normalizedSlug}` : '#'}
          state={{ price }}
          className={linkClassName}
          aria-disabled={isDisabled}
        >
          Consultar
        </Link>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const [consultations, setConsultations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [crlveTurboStates, setCrlveTurboStates] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchConsultations = async () => {
      setIsLoading(true);
      try {
        const [consultationsRes, statesRes] = await Promise.all([
          api.get('/consultations'),
          publicApi.get('/crlve-orders/states').catch(() => ({ data: [] })) // Busca estados, se falhar retorna array vazio
        ]);
        setConsultations(consultationsRes.data);
        setCrlveTurboStates(statesRes.data || []);
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
              priceOnRequest={consultation.price_on_request}
              states={consultation.slug === 'crlv-e-turbo' ? crlveTurboStates : undefined}
            />
          ))}
        </div>

      
          </div>
  );
};

export default Dashboard;
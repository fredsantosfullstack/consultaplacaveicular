import React from 'react';
import { Check, Search, FileText, MapPin, Shield, FileCheck, Globe } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_highlighted: boolean;
  highlight_label?: string | null;
  icon?: 'search' | 'file' | 'map' | 'globe' | 'shield' | 'doc';
  cta_label?: string;
}

interface ServicesProps {
  services: Service[];
}

const iconMap: Record<string, any> = {
  search: Search,
  file: FileText,
  map: MapPin,
  globe: Globe,
  shield: Shield,
  doc: FileCheck,
  default: Shield
};

const defaultServices: Service[] = [
  {
    id: 1,
    name: 'Consulta Pré-Cautelar',
    description: 'Situação completa, restrições, histórico de leilão e informações avançadas do veículo.',
    price: 0,
    features: ['Débitos e multas', 'Restrições judiciais', 'Histórico completo'],
    is_highlighted: true,
    highlight_label: 'MAIS POPULAR',
    icon: 'search',
    cta_label: 'Consultar agora'
  },
  {
    id: 2,
    name: 'CRLV-e Digital',
    description: 'Emissão digital instantânea do documento para todos os 26 estados brasileiros.',
    price: 0,
    features: ['Todos os estados', 'Download imediato', 'Documento oficial'],
    is_highlighted: false,
    icon: 'doc',
    cta_label: 'Emitir CRLV'
  },
  {
    id: 3,
    name: 'Base Estadual',
    description: 'Consulta completa em base estadual com todas as informações do veículo por estado.',
    price: 0,
    features: ['Informações por estado', 'Dados completos', 'Atualizado'],
    is_highlighted: false,
    icon: 'map',
    cta_label: 'Consultar agora'
  },
  {
    id: 4,
    name: 'Base Nacional',
    description: 'Consulta em base nacional abrangendo todos os estados e informações consolidadas.',
    price: 0,
    features: ['Todos os estados', 'Dados consolidados', 'Abrangência nacional'],
    is_highlighted: false,
    icon: 'globe',
    cta_label: 'Consultar agora'
  },
  {
    id: 5,
    name: 'Gravame',
    description: 'Consulta de restrições de gravame e alienação fiduciária do veículo.',
    price: 0,
    features: ['Restrições financeiras', 'Alienação fiduciária', 'Histórico completo'],
    is_highlighted: false,
    icon: 'shield',
    cta_label: 'Consultar agora'
  },
  {
    id: 6,
    name: 'Comunicado de Venda',
    description: 'Emissão de comunicado de venda para transferência de responsabilidade.',
    price: 0,
    features: ['Transferência de responsabilidade', 'Documento oficial', 'Envio imediato'],
    is_highlighted: false,
    icon: 'file',
    cta_label: 'Emitir agora'
  }
];

const Services: React.FC<ServicesProps> = ({ services }) => {
  const displayedServices = defaultServices;

  return (
    <section id="servicos" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-[1410px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Serviços pensados para cada consulta
          </h2>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            Escolha o relatório certo para analisar histórico, documentos e restrições antes de fechar negócio.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedServices.map((service) => {
            const Icon = iconMap[service.icon || 'default'] || iconMap['default'];
            const isHighlighted = Boolean(service.is_highlighted);

            return (
              <div
                key={service.id}
                className="group relative bg-white rounded-2xl p-8 transition-all duration-300 border border-slate-200 hover:border-blue-400 hover:shadow-lg"
              >
                {isHighlighted && (
                  <div className="absolute -top-3 left-6">
                    <span className="inline-block bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                      MAIS POPULAR
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <div className="inline-flex items-center justify-center w-16 h-16 text-blue-600 mb-4 transition-transform	duration-300 group-hover:scale-110">
                    <Icon className="w-8 h-8" strokeWidth={2.2} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mt-4">{service.name}</h3>
                  <p className="text-sm text-slate-600 mt-2">{service.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex-shrink-0 mt-0.5">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      <span className="text-sm text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => (window.location.href = '/login')}
                  className="w-full py-3 rounded-[10px] font-semibold text-base transition-all duration-300 bg-[#076AC2] text-white hover:bg-[#055a9f] shadow-sm hover:shadow-md"
                >
                  {service.cta_label || 'Consultar agora'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;

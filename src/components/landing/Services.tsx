import React from 'react';
import { Check, Star } from 'lucide-react';

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  features: string[];
  is_highlighted: boolean;
}

interface ServicesProps {
  services: Service[];
}

const Services: React.FC<ServicesProps> = ({ services }) => {
  return (
    <section id="servicos" className="py-16 lg:py-24 bg-white scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título da Seção */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Nossos Serviços
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Soluções completas para consultas veiculares com os melhores preços do mercado
          </p>
        </div>

        {/* Grid de Serviços */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {services.map((service) => (
            <div
              key={service.id}
              className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${
                service.is_highlighted ? 'ring-2 ring-[#076AC2]' : ''
              }`}
            >
              {/* Badge "Mais Popular" */}
              {service.is_highlighted && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  <Star size={12} fill="currentColor" />
                  POPULAR
                </div>
              )}

              <div className="p-8">
                {/* Nome do Serviço */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h3>

                {/* Descrição */}
                <p className="text-gray-600 text-sm mb-6">
                  {service.description}
                </p>

                {/* Preço */}
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[#076AC2]">
                    R$ {service.price.toFixed(2)}
                  </span>
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Botão */}
                <button
                  onClick={() => window.location.href = '/login'}
                  className={`w-full py-3 px-6 rounded-lg font-bold transition-all duration-300 ${
                    service.is_highlighted
                      ? 'bg-[#076AC2] hover:bg-[#055a9f] text-white shadow-lg'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                  }`}
                >
                  Consultar Agora
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;

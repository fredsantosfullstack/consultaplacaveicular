import React from 'react';
import { UserPlus, Search, Download } from 'lucide-react';

interface Step {
  icon: string;
  title: string;
  description: string;
}

interface StepsProps {
  steps: Step[];
}

const Steps: React.FC<StepsProps> = ({ steps }) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'user-plus': UserPlus,
      'search': Search,
      'download': Download,
      'default': UserPlus
    };
    return icons[iconName] || icons['default'];
  };

  return (
    <section id="como-funciona" className="py-16 lg:py-24 bg-gray-50 scroll-mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Título da Seção */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Passo a Passo
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            É rápido e fácil! Veja como funciona nossa plataforma
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => {
            const Icon = getIcon(step.icon);
            return (
              <div key={index} className="relative">
                {/* Linha conectora (apenas entre os cards, não no último) */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-[#076AC2] to-transparent z-0"></div>
                )}

                {/* Card */}
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 z-10">
                  {/* Número do Passo */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#076AC2] text-white rounded-full flex items-center justify-center font-bold text-xl shadow-lg">
                    {index + 1}
                  </div>

                  {/* Ícone */}
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Icon className="w-8 h-8 text-[#076AC2]" />
                  </div>

                  {/* Título */}
                  <h3 className="text-xl font-bold text-gray-900 text-center mb-3">
                    {step.title}
                  </h3>

                  {/* Descrição */}
                  <p className="text-gray-600 text-center text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA Final */}
        <div className="text-center mt-12">
          <button
            onClick={() => window.location.href = '/cadastro'}
            className="inline-flex items-center justify-center px-8 py-4 bg-[#076AC2] hover:bg-[#055a9f] text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            Começar Agora Grátis
          </button>
        </div>
      </div>
    </section>
  );
};

export default Steps;

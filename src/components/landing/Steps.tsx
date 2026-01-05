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
    <section id="como-funciona" className="py-20 bg-white scroll-mt-20">
      <div className="max-w-[1410px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Fluxo em 3 etapas para subir sua operação sem atrito
            </h2>
            <p className="text-base text-slate-500 max-w-3xl">
              Nossa equipe implementa integrações, faz o tuning antifraude e entrega dashboards prontos para decisão.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="hidden lg:block absolute left-8 right-8 top-16 border-t border-dashed border-slate-200"></div>
          <div className="grid gap-8 md:grid-cols-3">
            {steps.slice(0, 3).map((step, index) => {
              const Icon = getIcon(step.icon);
              return (
                <div
                  key={index}
                  className="relative bg-slate-900 text-white rounded-3xl p-8 shadow-2xl shadow-slate-900/20 overflow-hidden"
                >
                  <div className="absolute -top-10 -right-10 w-28 h-28 bg-white/10 blur-3xl"></div>
                  <div className="flex items-center gap-4 mb-6">
                    <span className="flex items-center justify-center w-12 h-12 rounded-full bg-white/15 font-semibold">
                      {index + 1}
                    </span>
                    <div className="p-3 rounded-2xl bg-white/10">
                      <Icon className="w-6 h-6 text-emerald-300" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm text-white/70 mt-3">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-16 bg-slate-900 text-white rounded-[10px] p-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold max-w-2xl">
              Nossa equipe configura fluxos, integrações e dashboards para você focar no cliente final.
            </h3>
          </div>
          <button
            onClick={() => (window.location.href = '/cadastro')}
            className="inline-flex items-center justify-center px-10 py-4 rounded-[10px] bg-[#52c41a] text-white font-semibold shadow-xl hover:-translate-y-0.5 transition-transform text-lg hover:bg-[#3fa813]"
          >
            Quero ativar minha operação agora
          </button>
        </div>
      </div>
    </section>
  );
};

export default Steps;

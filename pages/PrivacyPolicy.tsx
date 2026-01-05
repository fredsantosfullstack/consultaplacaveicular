import React from 'react';
import LandingHeader from '../src/components/landing/LandingHeader';
import LandingFooter from '../src/components/landing/LandingFooter';

const PrivacyPolicy: React.FC = () => {
  const footerLinks = [
    { label: 'Termos de Uso', url: '/termos', category: 'legal' },
    { label: 'Política de Privacidade', url: '/privacidade', category: 'legal' },
    { label: 'LGPD & Compliance', url: '/lgpd', category: 'legal' }
  ];

  return (
    <div className="min-h-screen bg-white">
      <LandingHeader siteName="Consulta Placa Veicular" />
      
      <main className="max-w-[1410px] mx-auto px-5 sm:px-8 lg:px-12 py-24">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">1. Introdução</h2>
              <p>
                A sua privacidade é importante para nós. É política da Consulta Placa Veicular respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Consulta Placa Veicular, e outros sites que possuímos e operamos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">2. Coleta de Dados</h2>
              <p>
                Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">3. Uso de Informações</h2>
              <p>
                Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei. Nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">4. Cookies</h2>
              <p>
                Utilizamos cookies para melhorar sua experiência de navegação. Você pode optar por recusar cookies através das configurações do seu navegador, embora isso possa afetar a funcionalidade de certas partes do site.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">5. Segurança</h2>
              <p>
                Protegemos os dados armazenados dentro de meios comercialmente aceitáveis para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
              </p>
            </section>

            <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Contato</h3>
              <p>
                O uso continuado de nosso site será considerado como aceitação de nossas práticas em torno de privacidade e informações pessoais. Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco.
              </p>
              <p className="mt-4 font-bold text-[#076AC2]">contato@consultaplacaveicular.com.br</p>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter 
        links={footerLinks} 
        siteName="Consulta Placa Veicular"
        footerLogoUrl=""
      />
    </div>
  );
};

export default PrivacyPolicy;

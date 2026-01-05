import React from 'react';
import LandingHeader from '../src/components/landing/LandingHeader';
import LandingFooter from '../src/components/landing/LandingFooter';

const LGPDPage: React.FC = () => {
  // Dados fictícios/padrão para o footer (serão carregados do CMS na LandingPage, aqui usamos estático para simplificar ou poderíamos buscar também)
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
          <h1 className="text-4xl font-bold text-slate-900 mb-8">LGPD & Compliance</h1>
          
          <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Compromisso com a Privacidade</h2>
              <p>
                A Consulta Placa Veicular está totalmente comprometida com a proteção de dados pessoais e com a conformidade com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018 - LGPD). Entendemos que a segurança e a privacidade das informações de nossos usuários e dos dados veiculares processados são fundamentais para a confiança em nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Como Tratamos os Dados</h2>
              <p>
                Nossa plataforma atua como um agregador de informações de fontes públicas e bases de dados oficiais. O tratamento de dados é realizado estritamente para finalidades legítimas, como:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Prevenção a fraudes e segurança em transações comerciais veiculares.</li>
                <li>Verificação de procedência e histórico de veículos.</li>
                <li>Cumprimento de obrigações legais e regulatórias.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Segurança da Informação</h2>
              <p>
                Implementamos medidas técnicas e organizacionais avançadas para proteger os dados contra acessos não autorizados, perda, alteração ou qualquer forma de tratamento inadequado. Isso inclui criptografia de dados, controle de acesso rigoroso e auditorias periódicas em nossa infraestrutura.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">Seus Direitos</h2>
              <p>
                Como titular de dados, você tem direito a confirmar a existência de tratamento, acessar seus dados, corrigir informações incompletas ou desatualizadas, e solicitar a anonimização ou eliminação de dados desnecessários, conforme previsto na LGPD.
              </p>
            </section>

            <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Canal de Atendimento ao Titular (DPO)</h3>
              <p>
                Para exercer seus direitos ou tirar dúvidas sobre nossa política de compliance, entre em contato com nosso Encarregado de Proteção de Dados (DPO) através do e-mail:
              </p>
              <p className="mt-4 font-bold text-[#076AC2]">lgpd@consultaplacaveicular.com.br</p>
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

export default LGPDPage;

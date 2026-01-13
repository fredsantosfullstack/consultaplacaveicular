import { useEffect, useState } from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import { publicApi } from '../services/api';

interface FooterLink {
  label: string;
  url: string;
  category: string;
}

const FALLBACK_SITE_NAME = 'Consulta Placa Veicular';

const PrivacyPage = () => {
  const [config, setConfig] = useState<any>(null);
  const [footerLinks, setFooterLinks] = useState<FooterLink[]>([]);

  useEffect(() => {
    const fetchUiData = async () => {
      try {
        const [configRes, footerRes] = await Promise.all([
          publicApi.get('/cms/config'),
          publicApi.get('/cms/footer-links')
        ]);
        setConfig(configRes.data || {});
        setFooterLinks(Array.isArray(footerRes.data) ? footerRes.data : []);
      } catch (error) {
        console.error('Erro ao carregar dados do layout:', error);
      }
    };

    fetchUiData();
  }, []);

  const siteName = config?.seo_title || FALLBACK_SITE_NAME;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <LandingHeader logoUrl={config?.logo_url} siteName={siteName} />
      <div className="h-20" />

      {/* Content */}
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Política de Privacidade</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">1. Coleta de Informações</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A Consulta Placa Veicular coleta informações fornecidas diretamente pelos usuários no momento do cadastro, como nome, e-mail, CPF/CNPJ, telefone e dados de pagamento. Também podemos coletar dados de navegação, como endereços IP, tipo de navegador e interações com a plataforma.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">2. Uso das Informações</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                As informações coletadas são utilizadas para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fornecer e melhorar nossos serviços de consulta veicular</li>
                <li>Processar pagamentos e gerenciar sua conta</li>
                <li>Enviar notificações sobre atualizações e novos serviços</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Prevenir fraudes e garantir a segurança da plataforma</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Não compartilhamos informações pessoais com terceiros sem o consentimento do usuário, exceto quando exigido por lei ou para cumprir com nossas obrigações contratuais.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">3. Proteção de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A Consulta Placa Veicular adota medidas técnicas e administrativas para proteger as informações dos usuários contra acesso não autorizado, perda, alteração ou divulgação. Utilizamos criptografia SSL/TLS para transmissão de dados e armazenamento seguro em servidores protegidos.
              </p>
              <p className="text-gray-700 leading-relaxed">
                No entanto, nenhuma plataforma é completamente segura, e não podemos garantir a segurança total dos dados transmitidos pela internet.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Podemos compartilhar dados com terceiros nas seguintes situações:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Processadores de pagamento para completar transações</li>
                <li>Provedores de APIs externas para consultas veiculares</li>
                <li>Autoridades governamentais quando exigido por lei</li>
                <li>Parceiros de serviço que nos auxiliam na operação da plataforma</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Todos os parceiros são obrigados a seguir os padrões de segurança e privacidade da Consulta Placa Veicular e da LGPD.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">5. Direitos do Usuário</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                De acordo com a LGPD, você tem os seguintes direitos:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Acessar seus dados pessoais armazenados</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a exclusão de seus dados pessoais</li>
                <li>Revogar o consentimento para tratamento de dados</li>
                <li>Solicitar a portabilidade de seus dados</li>
                <li>Obter informações sobre o compartilhamento de seus dados</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                Para exercer qualquer um desses direitos, entre em contato conosco através do e-mail: contato@consultaplacaveicular.com.br
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">6. Cookies e Tecnologias Similares</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">7. Retenção de Dados</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Mantemos seus dados pessoais pelo tempo necessário para cumprir as finalidades descritas nesta política, salvo se um período de retenção maior for exigido ou permitido por lei.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">8. Alterações na Política de Privacidade</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Esta Política de Privacidade pode ser alterada a qualquer momento. Notificaremos os usuários sobre modificações importantes através do e-mail cadastrado ou por meio de aviso na plataforma. Recomendamos que você consulte periodicamente esta política.
              </p>
            </section>

            <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <p className="text-gray-700">
                <strong>Última atualização:</strong> Janeiro de 2026
              </p>
              <p className="text-gray-700 mt-2">
                📩 <strong>Dúvidas sobre privacidade?</strong> Entre em contato com nosso DPO (Encarregado de Proteção de Dados):{' '}
                <a href="mailto:contato@consultaplacaveicular.com.br" className="text-blue-600 font-semibold hover:underline">
                  contato@consultaplacaveicular.com.br
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <LandingFooter
        links={footerLinks}
        siteName={siteName}
        footerLogoUrl={config?.footer_logo_url}
      />
    </div>
  );
};

export default PrivacyPage;

import { useEffect, useState } from 'react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import { publicApi } from '../services/api';

interface ActiveTerms {
  title: string;
  content: string;
  version: string;
  updated_at: string;
}

interface FooterLink {
  label: string;
  url: string;
  category: string;
}

const FALLBACK_SITE_NAME = 'Consulta Placa Veicular';
const DEFAULT_TERMS: ActiveTerms = {
  title: 'Termos de Uso',
  version: '1.0',
  updated_at: '2026-01-01T00:00:00.000Z',
  content: [
    '1. Aceitação dos Termos',
    'Bem-vindo à Consultaplacaveicular! Ao acessar e utilizar nosso sistema, você concorda com estes Termos de Uso. Caso não concorde com qualquer parte dos termos, pedimos que não utilize nossos serviços.',
    '',
    '2. Acesso ao Sistema',
    'Oferecemos serviços de consulta de informações veiculares como CRLV, consultas por placa e chassi. O acesso exige cadastro prévio e pagamento de eventuais taxas conforme o tipo de serviço contratado.',
    '',
    '3. Responsabilidade do Usuário',
    'O usuário é responsável por fornecer informações corretas e atualizadas. O uso indevido de dados de terceiros para fins fraudulentos é proibido. A Consultaplacaveicular não se responsabiliza por ações de terceiros que utilizem informações de maneira ilegal.',
    '',
    '4. Modificações e Cancelamentos',
    'Reservamo-nos o direito de modificar, suspender ou cancelar serviços a qualquer momento, sem aviso prévio, informando o usuário quando houver impacto nítido na experiência de uso.',
    '',
    '5. Limitação de Responsabilidade',
    'Não nos responsabilizamos por falhas em sistemas externos ou indisponibilidade de APIs de consulta. Trabalhamos para fornecer um serviço de qualidade, mas não podemos garantir 100% de precisão ou disponibilidade.',
    '',
    '6. Propriedade Intelectual',
    'Todos os direitos de propriedade intelectual sobre a Consultaplacaveicular são de titularidade exclusiva da plataforma. É proibido reproduzir, modificar ou distribuir qualquer parte do sistema sem autorização prévia.',
    '',
    '7. Proteção de Dados',
    'O usuário não deve utilizar nossos serviços para tratar dados pessoais de terceiros sem autorização legal e sem respeitar a LGPD. A Consultaplacaveicular não se responsabiliza por usos ilícitos desses dados.',
  ].join('\n')
};

const TermsPage = () => {
  const [term, setTerm] = useState<ActiveTerms>(DEFAULT_TERMS);
  const [termError, setTermError] = useState<string | null>(null);
  const [isTermLoading, setIsTermLoading] = useState(true);
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

    const fetchTerms = async () => {
      setIsTermLoading(true);
      try {
        const response = await publicApi.get('/terms/active');
        setTerm(response.data);
        setTermError(null);
      } catch (err) {
        console.error('Erro ao carregar termos ativos:', err);
        setTermError('Exibindo versão padrão dos termos. Tente novamente mais tarde para ver a versão mais recente do CMS.');
        setTerm(DEFAULT_TERMS);
      } finally {
        setIsTermLoading(false);
      }
    };

    fetchUiData();
    fetchTerms();
  }, []);

  const siteName = config?.seo_title || FALLBACK_SITE_NAME;
  const lastUpdate = term?.updated_at
    ? new Date(term.updated_at).toLocaleDateString('pt-BR')
    : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col">
      <LandingHeader logoUrl={config?.logo_url} siteName={siteName} />
      <div className="h-20" />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {isTermLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-[#076AC2] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600">Carregando termos...</p>
            </div>
          ) : (
            <>
              {termError && (
                <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                  {termError}
                </div>
              )}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{term.title || 'Termos de Uso'}</h1>
                  {term.version && (
                    <p className="text-gray-500 mt-1">Versão {term.version}</p>
                  )}
                </div>
                <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                  Última atualização: {lastUpdate}
                </span>
              </div>

              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                {term.content || 'Nenhum termo cadastrado no momento.'}
              </div>

              <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
                <p className="text-gray-700">
                  📩 <strong>Dúvidas?</strong> Entre em contato conosco pelo e-mail{' '}
                  <a href="mailto:contato@consultaplacaveicular.com.br" className="text-blue-600 font-semibold hover:underline">
                    contato@consultaplacaveicular.com.br
                  </a>
                </p>
              </div>
            </>
          )}
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

export default TermsPage;

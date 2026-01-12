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

const TermsPage = () => {
  const [term, setTerm] = useState<ActiveTerms | null>(null);
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
      } catch (err) {
        console.error('Erro ao carregar termos ativos:', err);
        setTermError('Não foi possível carregar os termos de uso no momento.');
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
          ) : termError ? (
            <div className="text-center">
              <p className="text-red-600">{termError}</p>
              <p className="text-gray-600 mt-4">
                Tente novamente em alguns instantes ou entre em contato pelo e-mail{' '}
                <a href="mailto:contato@consultaplacaveicular.com.br" className="text-blue-600 font-semibold hover:underline">
                  contato@consultaplacaveicular.com.br
                </a>
              </p>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{term?.title || 'Termos de Uso'}</h1>
                  {term?.version && (
                    <p className="text-gray-500 mt-1">Versão {term.version}</p>
                  )}
                </div>
                <span className="px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-sm font-medium">
                  Última atualização: {lastUpdate}
                </span>
              </div>

              <div className="text-gray-700 leading-relaxed whitespace-pre-line text-base">
                {term?.content || 'Nenhum termo cadastrado no momento.'}
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

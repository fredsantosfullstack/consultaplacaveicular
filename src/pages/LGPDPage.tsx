import { useEffect, useState } from 'react';
import { Shield } from 'lucide-react';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import { publicApi } from '../services/api';

interface FooterLink {
  label: string;
  url: string;
  category: string;
}

const FALLBACK_SITE_NAME = 'Consulta Placa Veicular';

const LGPDPage = () => {
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

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center mb-8">
            <Shield className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">LGPD</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Compromisso com a LGPD</h2>
              <p className="text-gray-700 leading-relaxed">
                A Consulta Placa Veicular está comprometida com a proteção de dados pessoais e o cumprimento integral da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Seus Direitos</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Confirmar e acessar seus dados</li>
                <li>Corrigir dados incompletos ou inexatos</li>
                <li>Solicitar anonimização, bloqueio ou eliminação</li>
                <li>Solicitar portabilidade de dados</li>
                <li>Revogar consentimento a qualquer momento</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Segurança</h2>
              <p className="text-gray-700 leading-relaxed">
                Implementamos criptografia, controle de acesso, monitoramento contínuo e backups regulares para proteger seus dados.
              </p>
            </section>

            <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <p className="text-gray-700">
                <strong>DPO:</strong> <a href="mailto:contato@consultaplacaveicular.com.br" className="text-blue-600 font-semibold hover:underline">contato@consultaplacaveicular.com.br</a>
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

export default LGPDPage;

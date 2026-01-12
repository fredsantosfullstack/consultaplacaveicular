import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { publicApi } from '../services/api';

interface ActiveTerms {
  title: string;
  content: string;
  version: string;
  updated_at: string;
}

const TermsPage = () => {
  const [term, setTerm] = useState<ActiveTerms | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response = await publicApi.get('/terms/active');
        setTerm(response.data);
      } catch (err) {
        console.error('Erro ao carregar termos ativos:', err);
        setError('Não foi possível carregar os termos de uso no momento.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTerms();
  }, []);

  const lastUpdate = term?.updated_at
    ? new Date(term.updated_at).toLocaleDateString('pt-BR')
    : '—';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para o início
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          {isLoading ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-[#076AC2] border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-gray-600">Carregando termos...</p>
            </div>
          ) : error ? (
            <div className="text-center">
              <p className="text-red-600">{error}</p>
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

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Consulta Placa Veicular. Todos os direitos reservados.
          </p>
          <div className="mt-4 space-x-6">
            <Link to="/termos-de-uso" className="text-gray-400 hover:text-white">Termos de Uso</Link>
            <Link to="/politica-de-privacidade" className="text-gray-400 hover:text-white">Política de Privacidade</Link>
            <Link to="/lgpd" className="text-gray-400 hover:text-white">LGPD</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;

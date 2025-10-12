import React, { useState, useEffect } from 'react';
import { FileText, Loader2 } from 'lucide-react';
import api from '../src/services/api';

interface TermsData {
  id: number;
  title: string;
  content: string;
  version: string;
  created_at: string;
  updated_at: string;
}

const TermsOfUse: React.FC = () => {
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/terms/active');
      setTerms(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar termos:', error);
      setError(error.response?.data?.msg || 'Erro ao carregar termos de uso.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <FileText className="w-8 h-8 text-[#000042]" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {terms?.title || 'Termos de Uso'}
          </h1>
          {terms && (
            <p className="text-sm text-gray-500 mt-1">
              Versão {terms.version} | Atualizado em{' '}
              {new Date(terms.updated_at).toLocaleDateString('pt-BR')}
            </p>
          )}
        </div>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Loader2 className="animate-spin" size={48} />
          </div>
        ) : error ? (
          <div className="text-center p-10">
            <p className="text-red-500 mb-4">{error}</p>
            <p className="text-gray-600">
              Entre em contato conosco: contato@goldenveicular.com.br
            </p>
          </div>
        ) : terms ? (
          <div className="prose prose-gray max-w-none">
            <div
              className="text-gray-700 leading-relaxed space-y-4"
              dangerouslySetInnerHTML={{ 
                __html: terms.content
                  .replace(/\n\n/g, '</p><p class="mt-4">')
                  .replace(/\n/g, '<br />')
                  .replace(/^(.+)$/, '<p>$1</p>')
              }}
            />
          </div>
        ) : (
          <div className="text-center p-10 text-gray-500">
            <p className="mb-4">Nenhum termo de uso disponível no momento.</p>
            <p className="text-sm">
              📩 Se você tiver dúvidas, entre em contato conosco pelo e-mail:{' '}
              <a href="mailto:contato@goldenveicular.com.br" className="text-[#000042] hover:underline">
                contato@goldenveicular.com.br
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsOfUse;
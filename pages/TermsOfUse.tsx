import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book, Loader2 } from 'lucide-react';
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
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 sm:p-6 md:p-8 space-y-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-3">
              <Book className="w-8 h-8 text-[#0f43aa]" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {terms?.title || 'Termos de Uso'}
              </h1>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-[#0f43aa] hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg text-gray-700">
            {isLoading ? (
              <div className="flex justify-center items-center p-10">
                <Loader2 className="animate-spin" size={48} />
              </div>
            ) : error ? (
              <div className="text-center p-10">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => navigate(-1)}
                  className="text-[#0f43aa] hover:underline"
                >
                  Voltar
                </button>
              </div>
            ) : terms ? (
              <div>
                <div className="mb-4 text-sm text-gray-500">
                  Versão {terms.version} | Atualizado em{' '}
                  {new Date(terms.updated_at).toLocaleDateString('pt-BR')}
                </div>
                <div
                  className="prose prose-gray max-w-none whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: terms.content.replace(/\n/g, '<br />') }}
                />
              </div>
            ) : (
              <div className="text-center p-10 text-gray-500">
                Nenhum termo de uso disponível no momento.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default TermsOfUse;
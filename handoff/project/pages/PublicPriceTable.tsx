import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import api from '../src/services/api';

interface PriceItem {
  id: number;
  name: string;
  price: number;
  category: string;
}

const PublicPriceTable: React.FC = () => {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPriceTable = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/price-table');
        setItems(response.data);
      } catch (err) {
        setError('Não foi possível carregar a tabela de preços.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPriceTable();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com padrão do sistema */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#000042]">Golden Veicular</h1>
              <p className="text-sm text-gray-600 mt-1">Tabela de Preços</p>
            </div>
            <a 
              href="/cadastre-se" 
              className="hidden sm:inline-flex items-center px-4 py-2 bg-[#000042] text-white text-sm font-medium rounded-lg hover:bg-[#000066] transition-colors shadow-sm"
            >
              Criar Conta Grátis
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center p-10 bg-white rounded-xl shadow-sm">
            <Loader2 className="animate-spin text-[#000042]" size={48} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-sm">
            <AlertTriangle className="text-red-500" size={48} />
            <p className="mt-4 text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#000042] text-white">
                  <tr>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-sm">Serviço</th>
                    <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold text-right text-sm">Valor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-800">{item.name}</td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-bold text-gray-800 text-right whitespace-nowrap">
                        {item.price > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price) : 'Grátis'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CTA Mobile */}
        <div className="mt-6 sm:hidden">
          <a 
            href="/cadastre-se" 
            className="block w-full text-center px-4 py-3 bg-[#000042] text-white text-sm font-semibold rounded-lg hover:bg-[#000066] transition-colors shadow-sm"
          >
            Criar Conta Grátis
          </a>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800 text-center">
            <span className="font-semibold">💡 Dica:</span> Crie sua conta gratuitamente e tenha acesso a todos esses serviços de consulta veicular!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-xs text-gray-500 text-center">
            Desenvolvido por{' '}
            <a 
              href="https://agenciadipixel.com.br" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-bold text-gray-600 hover:text-[#000042]"
            >
              Agência DiPixel
            </a>
            {' '}| (79) 98149-9282
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PublicPriceTable;

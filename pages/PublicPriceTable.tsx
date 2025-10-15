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
    <div className="min-h-screen bg-gradient-to-br from-[#000042] to-[#000066] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Golden Veicular</h1>
          <p className="text-gray-300 text-lg">Tabela de Preços</p>
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center p-10 bg-white rounded-xl shadow-2xl">
            <Loader2 className="animate-spin text-[#000042]" size={48} />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-2xl">
            <AlertTriangle className="text-red-500" size={48} />
            <p className="mt-4 text-red-700 font-semibold">{error}</p>
          </div>
        )}

        {/* Table */}
        {!isLoading && !error && (
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#000042] text-white">
                <tr>
                  <th className="px-6 py-4 font-semibold">Serviço</th>
                  <th className="px-6 py-4 font-semibold text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-800">{item.name}</td>
                    <td className="px-6 py-4 font-bold text-gray-800 text-right">
                      {item.price > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price) : 'Grátis'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-white text-sm mb-4">
            Quer ter acesso a todos esses serviços?
          </p>
          <a 
            href="/cadastre-se" 
            className="inline-block bg-white text-[#000042] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors shadow-lg"
          >
            Criar Conta Grátis
          </a>
        </div>
      </div>
    </div>
  );
};

export default PublicPriceTable;

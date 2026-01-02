import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, Share2, Check } from 'lucide-react';
import api from '../src/services/api';

interface PriceItem {
  id: number;
  name: string;
  price: number;
  category: string;
}


const PriceTable: React.FC = () => {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleShareTable = () => {
    const publicUrl = `${window.location.origin}/tabela-precos-publica`;
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Tabela de Preços</h1>
        <button
          onClick={handleShareTable}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#076AC2] text-white rounded-md hover:bg-[#055a9f] transition-colors font-medium text-xs shadow-sm"
        >
          {copied ? (
            <>
              <Check size={14} />
              Copiado!
            </>
          ) : (
            <>
              <Share2 size={14} />
              Encaminhar Tabela
            </>
          )}
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="animate-spin text-[#076AC2]" size={48} />
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center p-10 bg-red-50 border border-red-200 rounded-lg">
          <AlertTriangle className="text-red-500" size={48} />
          <p className="mt-4 text-red-700 font-semibold">{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#076AC2] text-white">
              <tr>
                <th className="px-6 py-4 font-semibold">Serviço</th>
                <th className="px-6 py-4 font-semibold text-right">Valor</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b border-gray-100 last:border-b-0">
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
    </div>
  );
};

export default PriceTable;
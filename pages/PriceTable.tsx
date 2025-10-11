import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
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
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Tabela de Preços</h1>

      {isLoading && (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="animate-spin text-[#000042]" size={48} />
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
            <thead className="bg-[#000042] text-white">
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
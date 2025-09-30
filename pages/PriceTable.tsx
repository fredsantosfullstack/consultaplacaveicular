import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { supabase } from '../src/supabaseClient';
import UserLayout from '../src/layouts/UserLayout';
import LoadingSpinner from '../src/components/LoadingSpinner';

const PriceTable: React.FC = () => {
  const [prices, setPrices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPrices = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('prices')
          .select('*')
          .order('service_name', { ascending: true });

        if (error) throw error;
        setPrices(data || []);
      } catch (error: any) {
        console.error('Error fetching prices:', error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPrices();
  }, []);

  return (
    <UserLayout>
      <div className="space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Tabela de Preços</h1>
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {prices.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.service_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">R$ {Number(item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default PriceTable;
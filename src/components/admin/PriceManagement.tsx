import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';

interface PriceItem {
  id: number;
  service_name: string;
  price: number;
  status: 'active' | 'inactive';
}

interface PriceManagementProps {
  goBack: () => void;
  prices: PriceItem[];
}

const PriceManagement: React.FC<PriceManagementProps> = ({ goBack, prices }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPrices = prices.filter(service => {
        return service.service_name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gerenciar Tabela de Preços</h2>
                    <p className="text-gray-600 mt-1">{prices.length} serviços cadastrados</p>
                </div>
                <button 
                    onClick={goBack} 
                    className="flex items-center space-x-2 text-[#0f43aa] hover:text-[#0c3688] transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    <span>Voltar</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="relative flex-grow mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f43aa] focus:border-[#0f43aa] transition-colors"
                    />
                </div>

                <div className="space-y-2">
                    {filteredPrices.map(service => (
                        <div key={service.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900">{service.service_name}</h3>
                                <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${service.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {service.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <div className="w-24 text-right font-semibold text-gray-800">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(service.price)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PriceManagement;
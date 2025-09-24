import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Truck, Plus, MessageSquare, ArrowLeft } from 'lucide-react';


const MyOrders: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div className="p-4 sm:p-6 md:p-8 space-y-8">
            <div className="flex justify-center items-center space-x-4">
                <Truck className="w-10 h-10 text-blue-500"/>
                <h1 className="text-3xl font-bold text-gray-800">Meus Pedidos</h1>
            </div>

            <div className="flex justify-center items-center space-x-2">
                <label htmlFor="status-filter" className="font-medium text-gray-700">Filtrar por status:</label>
                <select id="status-filter" className="w-auto p-2 border border-gray-300 bg-gray-50 rounded-lg shadow-sm text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors duration-200">
                    <option>Todos</option>
                    <option>Pendente</option>
                    <option>Em Andamento</option>
                    <option>Concluído</option>
                </select>
            </div>

            <div className="flex justify-center items-center flex-wrap gap-2 sm:gap-4">
                 <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 bg-gray-800 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-700 transition-opacity">
                    <ArrowLeft className="w-5 h-5"/>
                    <span>Voltar ao Menu</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-opacity">
                    <Plus className="w-5 h-5"/>
                    <span>Novo Pedido</span>
                </button>
                 <button className="flex items-center space-x-2 bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition-opacity">
                    <MessageSquare className="w-5 h-5"/>
                    <span>Solicitar Suporte</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-800 text-white">
                        <tr>
                            <th scope="col" className="px-6 py-4 font-semibold">Email Cliente</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Placa</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Renavam</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Data</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Documento</th>
                            <th scope="col" className="px-6 py-4 font-semibold">UF</th>
                            <th scope="col" className="px-6 py-4 font-semibold">Ação</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                             <td colSpan={8} className="text-center py-16 text-gray-500 bg-white">
                                Nenhum pedido encontrado.
                             </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default MyOrders;
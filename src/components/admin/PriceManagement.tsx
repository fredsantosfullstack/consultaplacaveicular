import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Pencil, Trash2, Search, DollarSign, Package, TrendingUp } from 'lucide-react';
import { apiService } from '../../services/apiService';
import PriceModal from './PriceModal';

interface PriceItem {
  id: number;
  service_name: string;
  service_code: string;
  price: number;
  status: 'active' | 'inactive';
}

interface PriceManagementProps {
    priceList: any[];
    setPriceList: React.Dispatch<React.SetStateAction<any[]>>;
    goBack: () => void;
}

const PriceManagement: React.FC<PriceManagementProps> = ({ priceList, setPriceList, goBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PriceItem | null>(null);
    const [services, setServices] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [filterCategory, setFilterCategory] = useState<'all' | 'consultas' | 'crlv' | 'outros'>('all');

    // Carregar serviços da API
    useEffect(() => {
        loadServices();
    }, []);

    const loadServices = async () => {
        try {
            setIsLoading(true);
            const response = await apiService.getPrices();
            setServices(response.all_services);
        } catch (error) {
            console.error('Erro ao carregar serviços:', error);
            toast.error('Erro ao carregar lista de preços');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveItem = async (itemData: any) => {
        try {
            if(editingItem) {
                // Atualizar preço existente
                await apiService.updatePrice(editingItem.id, itemData.price);
                setServices(prev => prev.map(i => i.id === editingItem.id ? {...i, ...itemData} : i));
                toast.success("Preço atualizado com sucesso!");
            } else {
                // Criar novo serviço (implementar API se necessário)
                const newService = {
                    id: Date.now(),
                    ...itemData,
                    status: 'active'
                };
                setServices(prev => [newService, ...prev]);
                toast.success("Serviço adicionado com sucesso!");
            }
            setIsModalOpen(false);
            setEditingItem(null);
            loadServices(); // Recarregar lista
        } catch (error: any) {
            toast.error(error.message || 'Erro ao salvar item');
        }
    }

    const openEditModal = (item: PriceItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    }
    
    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    }

    const handleDeleteItem = async (id: number) => {
        if(window.confirm('Tem certeza que deseja excluir este serviço?')) {
            try {
                // Implementar API de exclusão se necessário
                setServices(prev => prev.filter(i => i.id !== id));
                toast.success("Serviço excluído com sucesso!");
                loadServices(); // Recarregar lista
            } catch (error: any) {
                toast.error(error.message || 'Erro ao excluir serviço');
            }
        }
    }

    // Filtrar serviços
    const filteredServices = services.filter(service => {
        const matchesSearch = service.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            service.service_code.toLowerCase().includes(searchTerm.toLowerCase());
        
        let matchesCategory = true;
        if (filterCategory !== 'all') {
            if (filterCategory === 'crlv') {
                matchesCategory = service.service_code.includes('crlv');
            } else if (filterCategory === 'consultas') {
                matchesCategory = ['base-estadual', 'base-nacional', 'cautelar', 'renajud', 'chassi-rapida', 'placa-rapida'].includes(service.service_code);
            } else {
                matchesCategory = !service.service_code.includes('crlv') && 
                                !['base-estadual', 'base-nacional', 'cautelar', 'renajud', 'chassi-rapida', 'placa-rapida'].includes(service.service_code);
            }
        }
        
        return matchesSearch && matchesCategory;
    });

    const getStats = () => {
        const total = services.length;
        const totalValue = services.reduce((sum, s) => sum + s.price, 0);
        const avgPrice = total > 0 ? totalValue / total : 0;
        const freeServices = services.filter(s => s.price === 0).length;
        return { total, totalValue, avgPrice, freeServices };
    };

    const stats = getStats();
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gerenciar Tabela de Preços</h2>
                    <p className="text-gray-600 mt-1">{stats.total} serviços cadastrados</p>
                </div>
                <button 
                    onClick={goBack} 
                    className="flex items-center space-x-2 text-[#0f43aa] hover:text-[#0c3688] transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    <span>Voltar</span>
                </button>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Package className="w-8 h-8 text-blue-500" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-600">Total de Serviços</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <DollarSign className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">R$ {stats.totalValue.toFixed(0)}</p>
                            <p className="text-sm text-gray-600">Valor Total</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <TrendingUp className="w-8 h-8 text-purple-500" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">R$ {stats.avgPrice.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">Preço Médio</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Package className="w-8 h-8 text-orange-500" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.freeServices}</p>
                            <p className="text-sm text-gray-600">Serviços Gratuitos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros e Lista */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                {/* Controles */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou código do serviço..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f43aa] focus:border-[#0f43aa] transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <select
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value as any)}
                            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f43aa] focus:border-[#0f43aa] transition-colors"
                        >
                            <option value="all">Todas as Categorias</option>
                            <option value="consultas">Consultas</option>
                            <option value="crlv">CRLV-E</option>
                            <option value="outros">Outros</option>
                        </select>
                        <button 
                            onClick={openAddModal} 
                            className="bg-[#0f43aa] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0c3688] flex items-center space-x-2 transition-colors"
                        >
                            <Plus className="w-4 h-4"/>
                            <span>Adicionar</span>
                        </button>
                    </div>
                </div>

                {/* Lista de Serviços */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f43aa]"></div>
                        <span className="ml-2 text-gray-600">Carregando serviços...</span>
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="text-center py-8">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Nenhum serviço encontrado</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredServices.map(service => (
                            <div key={service.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{service.service_name}</h3>
                                    <p className="text-sm text-gray-600">Código: {service.service_code}</p>
                                    <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${
                                        service.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {service.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">
                                            {service.price === 0 ? 'GRATUITO' : `R$ ${service.price.toFixed(2)}`}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {service.price === 0 ? 'Sem custo' : 'Por consulta'}
                                        </p>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button 
                                            onClick={() => openEditModal(service)} 
                                            className="text-[#0f43aa] hover:text-[#0c3688] p-2 rounded-full hover:bg-[#0f43aa]/10 transition-colors"
                                            title="Editar preço"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteItem(service.id)} 
                                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                                            title="Excluir serviço"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <PriceModal 
                    item={editingItem} 
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingItem(null);
                    }} 
                    onSave={handleSaveItem} 
                />
            )}
        </div>
    );
};

export default PriceManagement;
import React, { useState } from 'react';
import { showSuccess } from '../../utils/toast';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import PriceModal from './PriceModal';

interface PriceItem {
  id: string;
  name: string;
  price: number;
}

interface PriceManagementProps {
    priceList: PriceItem[];
    setPriceList: React.Dispatch<React.SetStateAction<PriceItem[]>>;
    goBack: () => void;
}

const PriceManagement: React.FC<PriceManagementProps> = ({ priceList, setPriceList, goBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<PriceItem | null>(null);

    const handleSaveItem = (item: PriceItem) => {
        if(editingItem) {
            setPriceList(prev => prev.map(i => i.id === item.id ? item : i));
            showSuccess("Item atualizado com sucesso!");
        } else {
            setPriceList(prev => [item, ...prev]);
            showSuccess("Item adicionado com sucesso!");
        }
        setIsModalOpen(false);
        setEditingItem(null);
    }

    const openEditModal = (item: PriceItem) => {
        setEditingItem(item);
        setIsModalOpen(true);
    }
    
    const openAddModal = () => {
        setEditingItem(null);
        setIsModalOpen(true);
    }

    const handleDeleteItem = (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este item?')) {
            setPriceList(prev => prev.filter(i => i.id !== id));
            showSuccess("Item excluído com sucesso!");
        }
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciar Tabela de Preços</h2>
                <button onClick={goBack} className="flex items-center space-x-2 text-[#0f43aa] hover:underline"><ArrowLeft className="w-4 h-4"/><span>Voltar</span></button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-end mb-4">
                    <button onClick={openAddModal} className="bg-[#0f43aa] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0c3688] flex items-center space-x-2"><Plus className="w-4 h-4"/><span>Adicionar Item</span></button>
                </div>
                <div className="space-y-2">
                    {priceList.map(item => (
                        <div key={item.id} className="flex items-center p-3 border-b last:border-b-0 hover:bg-gray-50">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <div className="flex-grow"></div>
                            <span className="text-gray-600 mr-6">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => openEditModal(item)} className="text-[#0f43aa] p-2 rounded-full hover:bg-[#0f43aa]/10"><Pencil className="w-5 h-5" /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 p-2 rounded-full hover:bg-red-100"><Trash2 className="w-5 h-5" /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && <PriceModal item={editingItem} onClose={() => setIsModalOpen(false)} onSave={handleSaveItem} />}
        </div>
    );
};

export default PriceManagement;
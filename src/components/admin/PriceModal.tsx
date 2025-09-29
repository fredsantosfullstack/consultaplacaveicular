import React, { useState, useEffect } from 'react';
import { showError } from '../../utils/toast';

interface PriceItem {
  id: string;
  name: string;
  price: number;
}

interface PriceModalProps {
    item: PriceItem | null;
    onClose: () => void;
    onSave: (item: PriceItem) => void;
}

const PriceModal: React.FC<PriceModalProps> = ({ item, onClose, onSave }) => {
    const [formData, setFormData] = useState<PriceItem>(item || { id: '', name: '', price: 0 });

    useEffect(() => {
        setFormData(item || { id: new Date().toISOString(), name: '', price: 0 });
    }, [item]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.name) {
            onSave(formData);
        } else {
            showError("O nome do serviço é obrigatório.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg space-y-4">
                <h2 className="text-xl font-bold">{item ? 'Editar Item' : 'Adicionar Novo Item'}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome do Serviço</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                        <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="mt-1 w-full p-2 border rounded" required />
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 p-2 rounded">Cancelar</button>
                        <button type="submit" className="bg-[#0f43aa] text-white p-2 rounded hover:bg-[#0c3688]">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PriceModal;
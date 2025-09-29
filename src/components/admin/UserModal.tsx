import React, { useState, useEffect } from 'react';
import { User } from '../../../types';
import { showError } from '../../utils/toast';
import { X, Save } from 'lucide-react';

interface UserModalProps {
    user: User | null;
    onClose: () => void;
    onSave: (user: User) => void;
}

const UserModal: React.FC<UserModalProps> = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState<User>(user || { id: '', name: '', email: '', role: 'user', status: 'active', avatarUrl: '' });

    useEffect(() => {
        setFormData(user || { id: new Date().toISOString(), name: '', email: '', role: 'user', status: 'active', avatarUrl: '' });
    }, [user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if(formData.name && formData.email) {
            onSave(formData);
        } else {
            showError("Nome e Email são obrigatórios.");
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg space-y-4 animate-scale-in">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">{user ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</h2>
                    <button onClick={onClose}><X className="text-gray-500 hover:text-gray-800"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL da Foto de Perfil</label>
                        <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#0f43aa]" placeholder="https://example.com/avatar.png" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#0f43aa]" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#0f43aa]" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Função</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#0f43aa]">
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#0f43aa]">
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-[#0f43aa] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0c3688] flex items-center space-x-2"><Save className="w-4 h-4"/><span>Salvar</span></button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
import React, { useState } from 'react';
import { User } from '../../../types';
import { showSuccess } from '../../utils/toast';
import { ArrowLeft, UserPlus, Pencil, Trash2 } from 'lucide-react';
import UserModal from './UserModal';

interface UserManagementProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    goBack: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers, goBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleSaveUser = (user: User) => {
        if(editingUser) {
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
            showSuccess("Usuário atualizado com sucesso!");
        } else {
            setUsers(prev => [{...user, id: new Date().toISOString()}, ...prev]);
            showSuccess("Usuário adicionado com sucesso!");
        }
        setIsModalOpen(false);
        setEditingUser(null);
    }

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    }
    
    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    }

    const handleDeleteUser = (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este usuário?')) {
            setUsers(prev => prev.filter(u => u.id !== id));
            showSuccess("Usuário excluído com sucesso!");
        }
    }
    
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciar Usuários</h2>
                <button onClick={goBack} className="flex items-center space-x-2 text-[#0f43aa] hover:underline"><ArrowLeft className="w-4 h-4"/><span>Voltar</span></button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-end mb-4">
                    <button onClick={openAddModal} className="bg-[#0f43aa] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0c3688] flex items-center space-x-2"><UserPlus className="w-4 h-4"/><span>Adicionar Usuário</span></button>
                </div>
                <div className="space-y-1">
                    {users.map(user => (
                        <div key={user.id} className="flex items-center p-3 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 rounded-md">
                            <div className="flex items-center space-x-4">
                                <img 
                                    src={user.avatarUrl || `https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}&background=random&color=fff`} 
                                    alt={user.name} 
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                                <span className="font-medium text-gray-800">{user.name}</span>
                            </div>
                            <div className="flex-grow"></div>
                            <div className="mx-6">
                                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => openEditModal(user)} className="text-[#0f43aa] hover:text-[#0c3688] p-2 rounded-full hover:bg-[#0f43aa]/10 transition-colors">
                                    <Pencil className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors">
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && <UserModal user={editingUser} onClose={() => setIsModalOpen(false)} onSave={handleSaveUser} />}
        </div>
    );
};

export default UserManagement;
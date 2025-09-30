import React, { useState, useEffect } from 'react';
import { User, apiService } from '../../services/apiService';
import toast from 'react-hot-toast';
import { ArrowLeft, UserPlus, Pencil, Trash2, Search, Filter, Users, UserCheck, UserX } from 'lucide-react';
import UserModal from './UserModal';

interface UserManagementProps {
    users: User[];
    setUsers: React.Dispatch<React.SetStateAction<User[]>>;
    goBack: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, setUsers, goBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const usersPerPage = 10;

    // Carregar usuários da API
    useEffect(() => {
        loadUsers();
    }, [currentPage, searchTerm]);

    const loadUsers = async () => {
        try {
            setIsLoading(true);
            const response = await apiService.getUsers(currentPage, usersPerPage, searchTerm);
            setUsers(response.users);
            setTotalPages(response.pagination.pages);
        } catch (error) {
            console.error('Erro ao carregar usuários:', error);
            toast.error('Erro ao carregar usuários');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveUser = async (userData: Partial<User>) => {
        try {
            if(editingUser) {
                // Atualizar usuário existente
                const updatedUser = await apiService.updateProfile(editingUser.id.toString(), userData);
                setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                toast.success("Usuário atualizado com sucesso!");
            } else {
                // Criar novo usuário (implementar API)
                // Por enquanto, simular criação
                const newUser = {
                    ...userData,
                    id: Date.now(),
                    created_at: new Date().toISOString()
                } as User;
                setUsers(prev => [newUser, ...prev]);
                toast.success("Usuário adicionado com sucesso!");
            }
            setIsModalOpen(false);
            setEditingUser(null);
            loadUsers(); // Recarregar lista
        } catch (error: any) {
            toast.error(error.message || 'Erro ao salvar usuário');
        }
    }

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    }
    
    const openAddModal = () => {
        setEditingUser(null);
        setIsModalOpen(true);
    }

    const handleDeleteUser = async (id: number) => {
        if(window.confirm('Tem certeza que deseja excluir este usuário?')) {
            try {
                // Implementar API de exclusão
                // await apiService.deleteUser(id);
                setUsers(prev => prev.filter(u => u.id !== id));
                toast.success("Usuário excluído com sucesso!");
                loadUsers(); // Recarregar lista
            } catch (error: any) {
                toast.error(error.message || 'Erro ao excluir usuário');
            }
        }
    }

    // Filtrar usuários localmente
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStats = () => {
        const total = users.length;
        const active = users.filter(u => u.status === 'active').length;
        const inactive = users.filter(u => u.status === 'inactive').length;
        return { total, active, inactive };
    };

    const stats = getStatusStats();
    
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
                    <p className="text-gray-600 mt-1">{stats.total} usuários cadastrados</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <Users className="w-8 h-8 text-blue-500" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                            <p className="text-sm text-gray-600">Total de Usuários</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <UserCheck className="w-8 h-8 text-green-500" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                            <p className="text-sm text-gray-600">Usuários Ativos</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center space-x-3">
                        <UserX className="w-8 h-8 text-red-500" />
                        <div>
                            <p className="text-2xl font-bold text-gray-900">{stats.inactive}</p>
                            <p className="text-sm text-gray-600">Usuários Inativos</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Buscar por nome ou email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0f43aa] focus:border-[#0f43aa] transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Filter className="w-4 h-4 text-gray-500" />
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value as any)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#0f43aa] focus:border-[#0f43aa] transition-colors"
                            >
                                <option value="all">Todos</option>
                                <option value="active">Ativos</option>
                                <option value="inactive">Inativos</option>
                            </select>
                        </div>
                        <button 
                            onClick={openAddModal} 
                            className="bg-[#0f43aa] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#0c3688] flex items-center space-x-2 transition-colors"
                        >
                            <UserPlus className="w-4 h-4"/>
                            <span>Adicionar</span>
                        </button>
                    </div>
                </div>

                {/* Lista de Usuários */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0f43aa]"></div>
                        <span className="ml-2 text-gray-600">Carregando usuários...</span>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600">Nenhum usuário encontrado</p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        {filteredUsers.map(user => (
                            <div key={user.id} className="flex items-center p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                                <div className="flex items-center space-x-4 flex-1">
                                    <img 
                                        src={user.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=0f43aa&color=fff`} 
                                        alt={user.name} 
                                        className="w-12 h-12 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <p className="text-xs text-gray-500">
                                            {user.role === 'admin' ? 'Administrador' : 'Usuário'} • 
                                            Saldo: R$ {user.balance?.toFixed(2) || '0,00'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                                        user.status === 'active' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {user.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </span>
                                    <div className="flex items-center space-x-1">
                                        <button 
                                            onClick={() => openEditModal(user)} 
                                            className="text-[#0f43aa] hover:text-[#0c3688] p-2 rounded-full hover:bg-[#0f43aa]/10 transition-colors"
                                            title="Editar usuário"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button 
                                            onClick={() => handleDeleteUser(user.id)} 
                                            className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors"
                                            title="Excluir usuário"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Paginação */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600">
                            Página {currentPage} de {totalPages}
                        </p>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && (
                <UserModal 
                    user={editingUser} 
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingUser(null);
                    }} 
                    onSave={handleSaveUser} 
                />
            )}
        </div>
    );
};

export default UserManagement;
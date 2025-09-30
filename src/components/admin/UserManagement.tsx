import React, { useState } from 'react';
import { ArrowLeft, Search, Filter } from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
    role: 'user' | 'admin';
    created_at: string;
    avatar_url?: string;
}

interface UserManagementProps {
  users: User[];
  goBack: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ users, goBack }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user => {
        if (!user.name || !user.email) return false;
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <button onClick={goBack} className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
            </button>

            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
                <p className="text-gray-500 mt-1">Visualize e filtre os usuários do sistema.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                <div className="relative w-full md:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Buscar por nome ou email..." 
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left">Usuário</th>
                            <th className="py-3 px-4 text-left">Role</th>
                            <th className="py-3 px-4 text-left">Saldo</th>
                            <th className="py-3 px-4 text-left">Data de cadastro</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="py-3 px-4 flex items-center">
                                    <img src={user.avatar_url || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-8 h-8 rounded-full mr-3"/>
                                    <div>
                                        <p className="font-medium">{user.name}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                </td>
                                <td className="py-3 px-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="py-3 px-4 font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(user.balance || 0)}</td>
                                <td className="py-3 px-4 text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UserManagement;
import React, { useState, useEffect } from 'react';
import { Search, Edit, Plus, Trash2 } from 'lucide-react';
import api from '../../services/api';
import AdminModal from './AdminModal';

interface User {
    id: string;
    name: string;
    email: string;
    balance: number;
    role: 'user' | 'admin';
    created_at: string;
    avatar?: string;
    password?: string;
    document_type?: string;
    document_number?: string;
    phone?: string;
}

interface UserManagementProps {
  // A prop goBack pode ser removida se a navegação for gerenciada pelo componente pai
}

const UserManagement: React.FC<UserManagementProps> = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

      const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<Partial<User>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err: any) {
      setError('Falha ao buscar usuários.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenModal = (user: User | null) => {
    setModalMode(user ? 'edit' : 'add');
    setCurrentUser(user || { name: '', email: '', password: '', role: 'user', balance: 0 });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = modalMode === 'add' ? 'post' : 'put';
    const url = modalMode === 'add' ? '/users' : `/users/${currentUser.id}`;

    try {
      // Salva os dados do usuário primeiro
      const { data: savedUser } = await api[method](url, currentUser);
      const userId = savedUser.id || currentUser.id;

      // Se houver um arquivo de avatar, faz o upload
      if (avatarFile && userId) {
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        await api.post(`/users/${userId}/avatar`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      handleCloseModal();
      fetchUsers();
    } catch (error) {
      console.error('Falha ao salvar usuário', error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await api.delete(`/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error('Falha ao excluir usuário', error);
      }
    }
  };

    const filteredUsers = users.filter(user => {
        if (!user.name || !user.email) return false;
        return user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               user.email.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h2>
                <p className="text-gray-500 mt-1">Visualize e filtre os usuários do sistema.</p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
                <button onClick={() => handleOpenModal(null)} className="bg-[#000042] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center gap-2 w-full md:w-auto">
                    <Plus size={18} />
                    Adicionar Usuário
                </button>
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

            {isLoading && <p>Carregando usuários...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!isLoading && !error && (
            <>
            <AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalMode === 'add' ? 'Adicionar Novo Usuário' : `Editar Usuário: ${currentUser.name}`}>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="flex flex-col items-center">
                  <img src={avatarFile ? URL.createObjectURL(avatarFile) : (currentUser.avatar || `https://ui-avatars.com/api/?name=${currentUser.name || 'User'}&background=random`)} alt={currentUser.name} className="w-20 h-20 rounded-full mb-2 object-cover"/>
                  <input type="file" id="avatar-upload" className="hidden" onChange={(e) => e.target.files && setAvatarFile(e.target.files[0])} accept="image/*" />
                  <div className="flex gap-2">
                    <label htmlFor="avatar-upload" className="cursor-pointer bg-gray-200 text-gray-800 text-sm font-bold py-2 px-4 rounded-lg hover:bg-gray-300">{modalMode === 'add' ? 'Adicionar Foto' : 'Alterar Foto'}</label>
                    {modalMode === 'edit' && currentUser.avatar && (
                      <button type="button" onClick={async () => {
                        if (window.confirm('Tem certeza que deseja excluir a foto deste usuário?')) {
                          try {
                            await api.delete(`/users/${currentUser.id}/avatar`);
                            setCurrentUser(prev => ({ ...prev, avatar: undefined }));
                            fetchUsers();
                          } catch (error) {
                            console.error('Erro ao excluir foto:', error);
                            alert('Erro ao excluir foto. Tente novamente.');
                          }
                        }
                      }} className="bg-red-500 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-red-600">Excluir Foto</button>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
                  <input type="text" id="name" value={currentUser.name || ''} onChange={(e) => setCurrentUser(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>

                <div className={`grid grid-cols-1 ${modalMode === 'add' ? 'md:grid-cols-2' : ''} gap-4`}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" value={currentUser.email || ''} onChange={(e) => setCurrentUser(prev => ({ ...prev, email: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                  </div>
                  {modalMode === 'add' && (
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                      <input type="password" id="password" onChange={(e) => setCurrentUser(prev => ({ ...prev, password: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" required />
                    </div>
                  )}
                </div>

                {/* Linha 2: Documento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="document_type" className="block text-sm font-medium text-gray-700">Tipo de Documento</label>
                    <select id="document_type" value={currentUser.document_type || 'CPF'} onChange={(e) => setCurrentUser(prev => ({ ...prev, document_type: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option>CPF</option>
                      <option>CNPJ</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="document_number" className="block text-sm font-medium text-gray-700">Número do Documento</label>
                    <input type="text" id="document_number" value={currentUser.document_number || ''} onChange={(e) => setCurrentUser(prev => ({ ...prev, document_number: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>

                {/* Linha 3: Telefone, Cargo, Créditos */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Telefone</label>
                    <input type="text" id="phone" value={currentUser.phone || ''} onChange={(e) => setCurrentUser(prev => ({ ...prev, phone: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700">Cargo</label>
                    <select id="role" value={currentUser.role || 'user'} onChange={(e) => setCurrentUser(prev => ({ ...prev, role: e.target.value as 'user' | 'admin' }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="user">Usuário</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="balance" className="block text-sm font-medium text-gray-700">Saldo (R$)*</label>
                    <input type="number" id="balance" step="0.01" value={currentUser.balance || 0} onChange={(e) => setCurrentUser(prev => ({ ...prev, balance: parseFloat(e.target.value) || 0 }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <p className="text-xs text-gray-500">*Concede saldo diretamente ao usuário. Não gera cobrança.</p>
                  <div>
                    <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">Cancelar</button>
                    <button type="submit" className="bg-[#000042] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Salvar</button>
                  </div>
                </div>
              </form>
            </AdminModal>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="py-3 px-4 text-left">Usuário</th>
                            <th className="py-3 px-4 text-left">Role</th>
                            <th className="py-3 px-4 text-left">Saldo</th>
                            <th className="py-3 px-4 text-left">Data de cadastro</th>
                            <th className="py-3 px-4 text-right">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b">
                                <td className="py-3 px-4 flex items-center">
                                    <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}&background=random`} alt={user.name} className="w-8 h-8 rounded-full mr-3"/>
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
                                <td className="py-3 px-4 font-medium">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(user.balance)}</td>
                                <td className="py-3 px-4 text-gray-600">{new Date(user.created_at).toLocaleDateString()}</td>
                                <td className="py-3 px-4 text-right">
                                    <div className="flex gap-4 justify-end">
                                        <button onClick={() => handleOpenModal(user)} title="Editar" className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                                        <button onClick={() => handleDelete(user.id)} title="Excluir" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </>
            )}
        </div>
    );
};

export default UserManagement;
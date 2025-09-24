import React, { useState, useEffect } from 'react';
import { Notification, User } from '../types';
import { 
    FaArrowLeft, FaUsers, FaChartBar, FaBell, FaPlus, FaTrash, FaPauseCircle, FaPlayCircle, 
    FaEdit, FaUserPlus, FaSearchDollar, FaMoneyBillWave, FaTimes, FaSave, FaFilter, FaCalendarAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../src/utils/toast'; // Import toast utilities

interface AdminProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

const AdminCard: React.FC<{ icon: React.ElementType; title: string; description: string; onClick: () => void }> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <Icon className="w-10 h-10 text-blue-500 flex-shrink-0" />
        <div>
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
            <p className="text-gray-600">{description}</p>
        </div>
    </button>
);

const StatCard: React.FC<{icon: React.ElementType; title: string; value: string; color: string;}> = ({ icon: Icon, title, value, color }) => (
    <div className={`bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 border-l-4 ${color}`}>
        <Icon className="w-10 h-10 text-gray-500"/>
        <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const UserModal: React.FC<{
    user: User | null;
    onClose: () => void;
    onSave: (user: User) => void;
}> = ({ user, onClose, onSave }) => {
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
                    <button onClick={onClose}><FaTimes className="text-gray-500 hover:text-gray-800"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL da Foto de Perfil</label>
                        <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500" placeholder="https://example.com/avatar.png" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Função</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500">
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500">
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><FaSave /><span>Salvar</span></button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const UserManagement: React.FC<{ users: User[], setUsers: React.Dispatch<React.SetStateAction<User[]>>, goBack: () => void }> = ({ users, setUsers, goBack }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleSaveUser = (user: User) => {
        if(editingUser) { // update
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
            showSuccess("Usuário atualizado com sucesso!");
        } else { // create
            setUsers(prev => [user, ...prev]);
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
                <button onClick={goBack} className="flex items-center space-x-2 text-blue-600 hover:underline"><FaArrowLeft /><span>Voltar</span></button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-end mb-4">
                    <button onClick={openAddModal} className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2"><FaUserPlus /><span>Adicionar Usuário</span></button>
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
                                <button onClick={() => openEditModal(user)} className="text-blue-600 hover:text-blue-800 p-2 rounded-full hover:bg-blue-100 transition-colors">
                                    <FaEdit className="w-5 h-5" />
                                </button>
                                <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-100 transition-colors">
                                    <FaTrash className="w-5 h-5" />
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

const ReportDashboard: React.FC<{ goBack: () => void, userCount: number }> = ({ goBack, userCount }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
            <button onClick={goBack} className="flex items-center space-x-2 text-blue-600 hover:underline"><FaArrowLeft /><span>Voltar</span></button>
        </div>
        
        <div className="bg-white p-4 rounded-xl shadow-lg flex flex-wrap items-end gap-4">
            <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-600 mb-1">Data Inicial</label>
                <input type="date" className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500"/>
            </div>
            <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-600 mb-1">Data Final</label>
                <input type="date" className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500"/>
            </div>
            <div className="flex-grow">
                <label className="block text-sm font-medium text-gray-600 mb-1">Tipo de Relatório</label>
                <select className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500">
                    <option>Consultas</option>
                    <option>Receita</option>
                    <option>Usuários</option>
                </select>
            </div>
            <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 flex items-center space-x-2">
                <FaFilter />
                <span>Filtrar</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={FaUsers} title="Total de Usuários" value={userCount.toString()} color="border-blue-500" />
            <StatCard icon={FaSearchDollar} title="Consultas (Hoje)" value="1,204" color="border-green-500" />
            <StatCard icon={FaMoneyBillWave} title="Receita Total" value="R$ 45.890,50" color="border-yellow-500" />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Consultas por Período</h3>
            <div className="h-64 bg-gray-100 flex items-center justify-center text-gray-500 rounded">
                Gráfico de exemplo em breve...
            </div>
        </div>
    </div>
);


const NotificationManagement: React.FC<{
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    goBack: () => void;
}> = ({ notifications, setNotifications, goBack }) => {

    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [frequency, setFrequency] = useState<'once' | 'hourly' | 'daily'>('once');

    const handleAddNotification = (e: React.FormEvent) => {
        e.preventDefault();
        if(!title.trim() || !message.trim()) {
            showError("Título e Mensagem são obrigatórios.");
            return;
        }

        const newNotification: Notification = {
            id: new Date().toISOString(),
            title,
            message,
            status: 'active',
            frequency,
        };
        setNotifications(prev => [newNotification, ...prev]);
        setTitle('');
        setMessage('');
        setFrequency('once');
        showSuccess("Aviso adicionado com sucesso!");
    };

    const handleToggleStatus = (id: string) => {
        setNotifications(prev => prev.map(n => {
            if (n.id === id) {
                const newStatus = n.status === 'active' ? 'paused' : 'active';
                showSuccess(`Aviso ${newStatus === 'active' ? 'reativado' : 'pausado'} com sucesso!`);
                return { ...n, status: newStatus };
            }
            return n;
        }));
    };

    const handleDelete = (id: string) => {
        if(window.confirm('Tem certeza que deseja excluir este aviso?')) {
            setNotifications(prev => prev.filter(n => n.id !== id));
            showSuccess("Aviso excluído com sucesso!");
        }
    };


    return (
         <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Gerenciar Notificações</h2>
                <button onClick={goBack} className="flex items-center space-x-2 text-blue-600 hover:underline">
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                </button>
            </div>
            
            <form onSubmit={handleAddNotification} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                 <h3 className="text-lg font-semibold text-gray-700">Criar Novo Aviso</h3>
                 <div>
                    <label htmlFor="notif-title" className="block text-sm font-medium text-gray-600 mb-1">Título</label>
                    <input id="notif-title" type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Manutenção Programada" className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500"/>
                 </div>
                 <div>
                    <label htmlFor="notif-message" className="block text-sm font-medium text-gray-600 mb-1">Mensagem</label>
                    <textarea id="notif-message" value={message} onChange={e => setMessage(e.target.value)} placeholder="Descreva o aviso para os usuários..." rows={3} className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500"></textarea>
                 </div>
                 <div>
                    <label htmlFor="notif-freq" className="block text-sm font-medium text-gray-600 mb-1">Reaparecer para quem fechar</label>
                    <select id="notif-freq" value={frequency} onChange={e => setFrequency(e.target.value as any)} className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-500">
                        <option value="once">Apenas uma vez</option>
                        <option value="hourly">A cada hora</option>
                        <option value="daily">A cada 24 horas</option>
                    </select>
                 </div>
                 <div className="text-right">
                    <button type="submit" className="inline-flex items-center space-x-2 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700">
                        <FaPlus />
                        <span>Adicionar Aviso</span>
                    </button>
                 </div>
            </form>

            <div className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                 <h3 className="text-lg font-semibold text-gray-700">Avisos Atuais</h3>
                 <div className="space-y-3">
                    {notifications.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Nenhum aviso criado.</p>
                    ) : (
                        notifications.map(n => (
                             <div key={n.id} className={`p-4 rounded-lg flex justify-between items-center ${n.status === 'active' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-yellow-50 border-l-4 border-yellow-500'}`}>
                                <div>
                                    <p className="font-bold text-gray-800">{n.title}</p>
                                    <p className="text-sm text-gray-600">{n.message}</p>
                                    <p className="text-xs text-gray-500 mt-1">Status: <span className="font-semibold">{n.status === 'active' ? 'Ativo' : 'Pausado'}</span></p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => handleToggleStatus(n.id)} title={n.status === 'active' ? 'Pausar' : 'Reativar'} className="p-2 text-gray-600 hover:text-blue-600">
                                        {n.status === 'active' ? <FaPauseCircle /> : <FaPlayCircle />}
                                    </button>
                                    <button onClick={() => handleDelete(n.id)} title="Excluir" className="p-2 text-gray-600 hover:text-red-600">
                                        <FaTrash />
                                    </button>
                                </div>
                             </div>
                        ))
                    )}
                 </div>
            </div>

         </div>
    );
};


const Admin: React.FC<AdminProps> = ({ notifications, setNotifications, users, setUsers }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const navigate = useNavigate();

    const renderDashboard = () => (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Painel do Administrador</h1>
                <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-blue-600 hover:underline">
                    <FaArrowLeft className="w-4 h-4" />
                    <span>Voltar ao Início</span>
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <p className="text-gray-700">
                Bem-vindo ao painel de administração. Aqui você pode gerenciar usuários, visualizar relatórios e configurar o sistema.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AdminCard icon={FaUsers} title="Gerenciar Usuários" description="Adicionar, editar e remover usuários." onClick={() => setActiveSection('users')} />
                <AdminCard icon={FaChartBar} title="Visualizar Relatórios" description="Acompanhe as métricas e o uso do sistema." onClick={() => setActiveSection('reports')} />
                <AdminCard icon={FaBell} title="Gerenciar Notificações" description="Crie e gerencie avisos para os usuários." onClick={() => setActiveSection('notifications')} />
            </div>
        </div>
    );

    const renderSection = () => {
        const goBackToDashboard = () => setActiveSection('dashboard');
        switch (activeSection) {
            case 'notifications':
                return <NotificationManagement notifications={notifications} setNotifications={setNotifications} goBack={goBackToDashboard} />;
            case 'users':
                return <UserManagement users={users} setUsers={setUsers} goBack={goBackToDashboard} />;
            case 'reports':
                return <ReportDashboard goBack={goBackToDashboard} userCount={users.length} />;
            default:
                return renderDashboard();
        }
    }

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      {renderSection()}
    </div>
  );
};

export default Admin;
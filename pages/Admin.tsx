import React, { useState, useEffect } from 'react';
import { Notification, User } from '../types';
import { 
    ArrowLeft, Users, BarChart, Bell, Plus, Trash2, PauseCircle, PlayCircle, 
    Pencil, UserPlus, Search, Landmark, X, Save, Filter, Tags, Palette
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../src/utils/toast';

interface PriceItem {
  id: string;
  name: string;
  price: number;
}

interface AdminProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  priceList: PriceItem[];
  setPriceList: React.Dispatch<React.SetStateAction<PriceItem[]>>;
  setLogoUrl: (url: string) => void;
  setFaviconUrl: (url: string) => void;
}

const AdminCard: React.FC<{ icon: React.ElementType; title: string; description: string; onClick: () => void }> = ({ icon: Icon, title, description, onClick }) => (
    <button onClick={onClick} className="bg-white p-6 rounded-xl shadow-lg flex items-center space-x-4 text-left hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
        <Icon className="w-10 h-10 text-[#002672] flex-shrink-0" />
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
                    <button onClick={onClose}><X className="text-gray-500 hover:text-gray-800"/></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">URL da Foto de Perfil</label>
                        <input type="text" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#002672]" placeholder="https://example.com/avatar.png" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Nome</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#002672]" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#002672]" required />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700">Função</label>
                        <select name="role" value={formData.role} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#002672]">
                            <option value="user">Usuário</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Status</label>
                        <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-[#002672]">
                            <option value="active">Ativo</option>
                            <option value="inactive">Inativo</option>
                        </select>
                    </div>
                    <div className="flex justify-end space-x-3">
                        <button type="button" onClick={onClose} className="bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">Cancelar</button>
                        <button type="submit" className="bg-[#002672] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#001a4d] flex items-center space-x-2"><Save /><span>Salvar</span></button>
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
        if(editingUser) {
            setUsers(prev => prev.map(u => u.id === user.id ? user : u));
            showSuccess("Usuário atualizado com sucesso!");
        } else {
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
                <button onClick={goBack} className="flex items-center space-x-2 text-[#002672] hover:underline"><ArrowLeft /><span>Voltar</span></button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-end mb-4">
                    <button onClick={openAddModal} className="bg-[#002672] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#001a4d] flex items-center space-x-2"><UserPlus /><span>Adicionar Usuário</span></button>
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
                                <button onClick={() => openEditModal(user)} className="text-[#002672] hover:text-[#001a4d] p-2 rounded-full hover:bg-[#002672]/10 transition-colors">
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

const ReportDashboard: React.FC<{ goBack: () => void, userCount: number }> = ({ goBack, userCount }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
            <button onClick={goBack} className="flex items-center space-x-2 text-[#002672] hover:underline"><ArrowLeft /><span>Voltar</span></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={Users} title="Total de Usuários" value={userCount.toString()} color="border-[#002672]" />
            <StatCard icon={Search} title="Consultas (Hoje)" value="1,204" color="border-green-500" />
            <StatCard icon={Landmark} title="Receita Total" value="R$ 45.890,50" color="border-yellow-500" />
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
        const newNotification: Notification = { id: new Date().toISOString(), title, message, status: 'active', frequency };
        setNotifications(prev => [newNotification, ...prev]);
        setTitle(''); setMessage(''); setFrequency('once');
        showSuccess("Aviso adicionado com sucesso!");
    };

    const handleToggleStatus = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, status: n.status === 'active' ? 'paused' : 'active' } : n));
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
                <button onClick={goBack} className="flex items-center space-x-2 text-[#002672] hover:underline"><ArrowLeft /><span>Voltar</span></button>
            </div>
            <form onSubmit={handleAddNotification} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                 <h3 className="text-lg font-semibold text-gray-700">Criar Novo Aviso</h3>
                 <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título" className="w-full p-2 border rounded"/>
                 <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Mensagem" className="w-full p-2 border rounded"></textarea>
                 <select value={frequency} onChange={e => setFrequency(e.target.value as any)} className="w-full p-2 border rounded">
                    <option value="once">Apenas uma vez</option>
                    <option value="hourly">A cada hora</option>
                    <option value="daily">A cada 24 horas</option>
                 </select>
                 <button type="submit" className="bg-[#002672] text-white p-2 rounded hover:bg-[#001a4d]">Adicionar Aviso</button>
            </form>
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-3">
                {notifications.map(n => (
                     <div key={n.id} className="p-4 rounded-lg flex justify-between items-center border">
                        <div>
                            <p className="font-bold">{n.title}</p>
                            <p>{n.message}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button onClick={() => handleToggleStatus(n.id)}>{n.status === 'active' ? <PauseCircle /> : <PlayCircle />}</button>
                            <button onClick={() => handleDelete(n.id)}><Trash2 /></button>
                        </div>
                     </div>
                ))}
            </div>
         </div>
    );
};

const PriceModal: React.FC<{
    item: PriceItem | null;
    onClose: () => void;
    onSave: (item: PriceItem) => void;
}> = ({ item, onClose, onSave }) => {
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
                        <button type="submit" className="bg-[#002672] text-white p-2 rounded hover:bg-[#001a4d]">Salvar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const PriceManagement: React.FC<{ priceList: PriceItem[], setPriceList: React.Dispatch<React.SetStateAction<PriceItem[]>>, goBack: () => void }> = ({ priceList, setPriceList, goBack }) => {
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
                <button onClick={goBack} className="flex items-center space-x-2 text-[#002672] hover:underline"><ArrowLeft /><span>Voltar</span></button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex justify-end mb-4">
                    <button onClick={openAddModal} className="bg-[#002672] text-white font-semibold py-2 px-4 rounded-lg hover:bg-[#001a4d] flex items-center space-x-2"><Plus /><span>Adicionar Item</span></button>
                </div>
                <div className="space-y-2">
                    {priceList.map(item => (
                        <div key={item.id} className="flex items-center p-3 border-b last:border-b-0 hover:bg-gray-50">
                            <span className="font-medium text-gray-800">{item.name}</span>
                            <div className="flex-grow"></div>
                            <span className="text-gray-600 mr-6">R$ {item.price.toFixed(2).replace('.', ',')}</span>
                            <div className="flex items-center space-x-2">
                                <button onClick={() => openEditModal(item)} className="text-[#002672] p-2 rounded-full hover:bg-[#002672]/10"><Pencil /></button>
                                <button onClick={() => handleDeleteItem(item.id)} className="text-red-600 p-2 rounded-full hover:bg-red-100"><Trash2 /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {isModalOpen && <PriceModal item={editingItem} onClose={() => setIsModalOpen(false)} onSave={handleSaveItem} />}
        </div>
    );
};

const AppearanceManagement: React.FC<{
    setLogoUrl: (url: string) => void;
    setFaviconUrl: (url: string) => void;
    goBack: () => void;
}> = ({ setLogoUrl, setFaviconUrl, goBack }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, storageKey: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64String = reader.result as string;
                setter(base64String);
                localStorage.setItem(storageKey, base64String);
                showSuccess("Imagem atualizada com sucesso!");
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">Personalizar Aparência</h2>
                <button onClick={goBack} className="flex items-center space-x-2 text-[#002672] hover:underline"><ArrowLeft /><span>Voltar</span></button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Logo do Sistema</h3>
                    <p className="text-sm text-gray-500 mb-2">Use uma imagem com fundo transparente (PNG) para melhores resultados. Altura recomendada: 64px.</p>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogoUrl, 'customLogo')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#002672]/10 file:text-[#002672] hover:file:bg-[#002672]/20"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Favicon</h3>
                    <p className="text-sm text-gray-500 mb-2">Use uma imagem quadrada (ex: 32x32 ou 64x64 pixels).</p>
                    <input type="file" accept="image/png, image/x-icon, image/svg+xml" onChange={(e) => handleFileChange(e, setFaviconUrl, 'customFavicon')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#002672]/10 file:text-[#002672] hover:file:bg-[#002672]/20"/>
                </div>
            </div>
        </div>
    );
};

const Admin: React.FC<AdminProps> = ({ notifications, setNotifications, users, setUsers, priceList, setPriceList, setLogoUrl, setFaviconUrl }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const navigate = useNavigate();

    const renderDashboard = () => (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">Painel do Administrador</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AdminCard icon={Users} title="Gerenciar Usuários" description="Adicionar, editar e remover usuários." onClick={() => setActiveSection('users')} />
                <AdminCard icon={BarChart} title="Visualizar Relatórios" description="Acompanhe as métricas do sistema." onClick={() => setActiveSection('reports')} />
                <AdminCard icon={Bell} title="Gerenciar Notificações" description="Crie e gerencie avisos para os usuários." onClick={() => setActiveSection('notifications')} />
                <AdminCard icon={Tags} title="Gerenciar Tabela de Preços" description="Edite os serviços e valores." onClick={() => setActiveSection('prices')} />
                <AdminCard icon={Palette} title="Personalizar Aparência" description="Altere o logo e o favicon do sistema." onClick={() => setActiveSection('appearance')} />
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
            case 'prices':
                return <PriceManagement priceList={priceList} setPriceList={setPriceList} goBack={goBackToDashboard} />;
            case 'appearance':
                return <AppearanceManagement setLogoUrl={setLogoUrl} setFaviconUrl={setFaviconUrl} goBack={goBackToDashboard} />;
            default:
                return renderDashboard();
        }
    }

  return (
    <div className="p-8 space-y-6">
      <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-[#002672] hover:underline mb-4">
          <ArrowLeft />
          <span>Voltar ao Início</span>
      </button>
      {renderSection()}
    </div>
  );
};

export default Admin;
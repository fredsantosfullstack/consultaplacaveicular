import React, { useState, useEffect } from 'react';
import { Notification } from '../types';
import { ArrowLeft, Users, BarChart, Bell, Tags, Palette, TrendingUp, DollarSign, Activity, LogOut, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/contexts/AuthContext';
import { apiService, User } from '../src/services/apiService';
import toast from 'react-hot-toast';

import AdminCard from '../src/components/admin/AdminCard';
import UserManagement from '../src/components/admin/UserManagement';
import ReportDashboard from '../src/components/admin/ReportDashboard';
import NotificationManagement from '../src/components/admin/NotificationManagement';
import PriceManagement from '../src/components/admin/PriceManagement';
import AppearanceManagement from '../src/components/admin/AppearanceManagement';
import AdminLoadingState from '../src/components/admin/AdminLoadingState';
import CustomLogo from '../src/components/CustomLogo';

interface PriceItem {
  id: string;
  name: string;
  price: number;
}

interface AdminProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  priceList: PriceItem[];
  setPriceList: React.Dispatch<React.SetStateAction<PriceItem[]>>;
  setLogoUrl: (url: string) => void;
  setFaviconUrl: (url: string) => void;
}

interface DashboardStats {
  totalUsers: number;
  todayConsultations: number;
  totalRevenue: number;
  activeUsers: number;
}

const AdminStandalone: React.FC<AdminProps> = ({ notifications, setNotifications, priceList, setPriceList, setLogoUrl, setFaviconUrl }) => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [users, setUsers] = useState<User[]>([]);
    const [stats, setStats] = useState<DashboardStats>({
        totalUsers: 0,
        todayConsultations: 0,
        totalRevenue: 0,
        activeUsers: 0
    });
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    // Carregar dados imediatamente
    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            console.log('Carregando dados do admin standalone...');
            
            // Dados mockados otimizados
            const mockUsers = [
                { id: 1, name: 'Admin User', email: 'admin@goldenveicular.com.br', role: 'admin', status: 'active', balance: 100 },
                { id: 2, name: 'Usuário Teste', email: 'user@teste.com', role: 'user', status: 'active', balance: 50 },
                { id: 3, name: 'Maria Silva', email: 'maria@teste.com', role: 'user', status: 'active', balance: 75 },
                { id: 4, name: 'João Santos', email: 'joao@teste.com', role: 'user', status: 'inactive', balance: 25 },
                { id: 5, name: 'Ana Costa', email: 'ana@teste.com', role: 'user', status: 'active', balance: 150 }
            ];
            
            setUsers(mockUsers);
            
            const mockStats = {
                totalUsers: mockUsers.length,
                todayConsultations: 18,
                totalRevenue: 742.50,
                activeUsers: mockUsers.filter(u => u.status === 'active').length
            };
            
            setStats(mockStats);
            
            // Tentar carregar dados reais se API disponível
            try {
                const usersData = await apiService.getUsers(1, 100);
                if (usersData && usersData.users) {
                    setUsers(usersData.users);
                    setStats(prev => ({
                        ...prev,
                        totalUsers: usersData.users.length,
                        activeUsers: usersData.users.filter(u => u.status === 'active').length
                    }));
                }
            } catch (apiError) {
                console.log('API não disponível, usando dados mockados');
            }
            
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const renderTopBar = () => (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <CustomLogo 
                        type="menu" 
                        className="h-10 w-auto" 
                        fallbackClassName="h-10 w-auto"
                    />
                    <div className="h-8 w-px bg-gray-300"></div>
                    <h1 className="text-xl font-semibold text-gray-900">Painel Administrativo</h1>
                </div>
                
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">Olá, {user?.name}</span>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={() => navigate('/dashboard')}
                            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Voltar ao Sistema"
                        >
                            <Home className="w-4 h-4" />
                            <span className="text-sm">Sistema</span>
                        </button>
                        <button
                            onClick={logout}
                            className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sair"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="text-sm">Sair</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="space-y-8">
            {/* Métricas Principais */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-600 rounded-lg p-6 text-white border border-blue-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 text-sm font-medium">Total de Usuários</p>
                            <p className="text-3xl font-bold">{stats.totalUsers}</p>
                        </div>
                        <Users className="w-8 h-8 text-blue-200" />
                    </div>
                    <div className="mt-4 flex items-center text-blue-100 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {stats.activeUsers} ativos
                    </div>
                </div>

                <div className="bg-green-600 rounded-lg p-6 text-white border border-green-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-medium">Consultas Hoje</p>
                            <p className="text-3xl font-bold">{stats.todayConsultations}</p>
                        </div>
                        <Activity className="w-8 h-8 text-green-200" />
                    </div>
                    <div className="mt-4 flex items-center text-green-100 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +12% vs ontem
                    </div>
                </div>

                <div className="bg-purple-600 rounded-lg p-6 text-white border border-purple-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-medium">Receita Total</p>
                            <p className="text-3xl font-bold">R$ {stats.totalRevenue.toFixed(2)}</p>
                        </div>
                        <DollarSign className="w-8 h-8 text-purple-200" />
                    </div>
                    <div className="mt-4 flex items-center text-purple-100 text-sm">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        +8% este mês
                    </div>
                </div>

                <div className="bg-orange-600 rounded-lg p-6 text-white border border-orange-700">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-orange-100 text-sm font-medium">Notificações</p>
                            <p className="text-3xl font-bold">{notifications.length}</p>
                        </div>
                        <Bell className="w-8 h-8 text-orange-200" />
                    </div>
                    <div className="mt-4 flex items-center text-orange-100 text-sm">
                        <Activity className="w-4 h-4 mr-1" />
                        {notifications.filter(n => n.status === 'active').length} ativas
                    </div>
                </div>
            </div>

            {/* Menu de Ações */}
            <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Gerenciamento</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AdminCard 
                        icon={Users} 
                        title="Gerenciar Usuários" 
                        description={`${stats.totalUsers} usuários cadastrados`}
                        onClick={() => setActiveSection('users')} 
                    />
                    <AdminCard 
                        icon={BarChart} 
                        title="Relatórios Detalhados" 
                        description="Analytics e métricas avançadas"
                        onClick={() => setActiveSection('reports')} 
                    />
                    <AdminCard 
                        icon={Bell} 
                        title="Notificações" 
                        description={`${notifications.length} notificações criadas`}
                        onClick={() => setActiveSection('notifications')} 
                    />
                    <AdminCard 
                        icon={Tags} 
                        title="Tabela de Preços" 
                        description={`${priceList.length} serviços cadastrados`}
                        onClick={() => setActiveSection('prices')} 
                    />
                    <AdminCard 
                        icon={Palette} 
                        title="Personalização" 
                        description="Logo, favicon e aparência"
                        onClick={() => setActiveSection('appearance')} 
                    />
                </div>
            </div>
        </div>
    );

    const renderSection = () => {
        const goBackToDashboard = () => setActiveSection('dashboard');
        
        if (isLoading) {
            return <AdminLoadingState />;
        }
        
        switch (activeSection) {
            case 'notifications':
                return <NotificationManagement notifications={notifications} setNotifications={setNotifications} goBack={goBackToDashboard} />;
            case 'users':
                return <UserManagement users={users} setUsers={setUsers} goBack={goBackToDashboard} />;
            case 'reports':
                return <ReportDashboard goBack={goBackToDashboard} stats={stats} users={users} />;
            case 'prices':
                return <PriceManagement priceList={priceList} setPriceList={setPriceList} goBack={goBackToDashboard} />;
            case 'appearance':
                return <AppearanceManagement setLogoUrl={setLogoUrl} setFaviconUrl={setFaviconUrl} goBack={goBackToDashboard} />;
            default:
                return renderDashboard();
        }
    };

    // Verificar se usuário é admin
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#0f43aa] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Verificando permissões...</p>
                </div>
            </div>
        );
    }

    if (user.role !== 'admin') {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Acesso Negado</h2>
                    <p className="text-gray-600 mb-4">Você não tem permissão para acessar esta área.</p>
                    <button 
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 bg-[#0f43aa] text-white rounded-lg hover:bg-[#0c3688] transition-colors"
                    >
                        Voltar ao Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {renderTopBar()}
            <div className="p-6 lg:p-8">
                {activeSection !== 'dashboard' && (
                    <button 
                        onClick={() => setActiveSection('dashboard')} 
                        className="flex items-center space-x-2 text-[#0f43aa] hover:text-[#0c3688] transition-colors mb-6 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4"/>
                        <span>Voltar ao Dashboard</span>
                    </button>
                )}
                {renderSection()}
            </div>
        </div>
    );
};

export default AdminStandalone;

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, BarChart, Bell, Tags, Palette, Settings } from 'lucide-react';
import { useAuth } from '../src/contexts/AuthContext';
import { supabase } from '../src/supabaseClient';
import AdminCard from '../src/components/admin/AdminCard';
import UserManagement from '../src/components/admin/UserManagement';
import ReportDashboard from '../src/components/admin/ReportDashboard';
import NotificationManagement from '../src/components/admin/NotificationManagement';
import PriceManagement from '../src/components/admin/PriceManagement';
import AppearanceManagement from '../src/components/admin/AppearanceManagement';
import AdminLoadingState from '../src/components/admin/AdminLoadingState';
import SettingsManagement from '../src/components/admin/SettingsManagement';

const AdminPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState('dashboard');
    const [users, setUsers] = useState<any[]>([]);
    const [prices, setPrices] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [stats, setStats] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const { profile } = useAuth();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: usersData, error: usersError } = await supabase.from('profiles').select('*');
                if (usersError) throw usersError;
                setUsers(usersData || []);

                const { data: pricesData, error: pricesError } = await supabase.from('prices').select('*');
                if (pricesError) throw pricesError;
                setPrices(pricesData || []);

                // const { data: notificationsData, error: notificationsError } = await supabase.from('notifications').select('*');
                // if (notificationsError) throw notificationsError;
                // setNotifications(notificationsData || []);

                const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
                const { count: totalConsultas } = await supabase.from('consultations').select('*', { count: 'exact', head: true });

                setStats({ totalUsers, totalConsultas });

            } catch (error: any) {
                console.error('Erro ao buscar dados do admin:', error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <AdminLoadingState />;
    }

    const renderSection = () => {
        switch (activeSection) {
            case 'user-management':
                return <UserManagement users={users} goBack={() => setActiveSection('dashboard')} />;
            case 'reports':
                return <ReportDashboard goBack={() => setActiveSection('dashboard')} stats={stats} users={users} />;
            case 'notifications':
                return <NotificationManagement goBack={() => setActiveSection('dashboard')} notifications={notifications} />;
            case 'price-management':
                return <PriceManagement goBack={() => setActiveSection('dashboard')} prices={prices} />;
            case 'appearance':
                return <AppearanceManagement goBack={() => setActiveSection('dashboard')} />;
            case 'settings':
                return <SettingsManagement goBack={() => setActiveSection('dashboard')} />;
            default:
                return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        <AdminCard icon={Users} title="Gerenciar Usuários" description={`${users.length} usuários`} onClick={() => setActiveSection('user-management')} />
                        <AdminCard icon={BarChart} title="Relatórios" description="Visão geral de dados" onClick={() => setActiveSection('reports')} />
                        <AdminCard icon={Bell} title="Notificações" description="Enviar alertas" onClick={() => setActiveSection('notifications')} />
                        <AdminCard icon={Tags} title="Tabela de Preços" description="Editar valores" onClick={() => setActiveSection('price-management')} />
                        <AdminCard icon={Palette} title="Aparência" description="Customizar logos" onClick={() => setActiveSection('appearance')} />
                        <AdminCard icon={Settings} title="Configurações" description="Ajustes do sistema" onClick={() => setActiveSection('settings')} />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>
                        {activeSection !== 'dashboard' && (
                            <button onClick={() => setActiveSection('dashboard')} className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Voltar
                            </button>
                        )}
                    </div>
                    <p className="mt-2 text-lg text-gray-500">Bem-vindo, {profile?.name}.</p>
                </header>

                <main>
                    {renderSection()}
                </main>
            </div>
        </div>
    );
};

export default AdminPage;
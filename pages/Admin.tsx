import React, { useState } from 'react';
import { Notification, User } from '../types';
import { ArrowLeft, Users, BarChart, Bell, Tags, Palette } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import AdminCard from '@/src/components/admin/AdminCard';
import UserManagement from '@/src/components/admin/UserManagement';
import ReportDashboard from '@/src/components/admin/ReportDashboard';
import NotificationManagement from '@/src/components/admin/NotificationManagement';
import PriceManagement from '@/src/components/admin/PriceManagement';
import AppearanceManagement from '@/src/components/admin/AppearanceManagement';

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
      <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-[#0f43aa] hover:underline mb-4">
          <ArrowLeft className="w-4 h-4"/>
          <span>Voltar ao Início</span>
      </button>
      {renderSection()}
    </div>
  );
};

export default Admin;
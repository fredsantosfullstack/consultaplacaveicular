import React, { useState, useEffect } from 'react';
import { Users, Settings, BarChart, ArrowLeft, ClipboardList, CreditCard, Tags, DollarSign, FileText, Car } from 'lucide-react';
import AdminCard from '../src/components/admin/AdminCard';
import UserManagement from '../src/components/admin/UserManagement';
import SiteSettings from '../src/components/admin/SiteSettings';
import Reports from '../src/components/admin/Reports';
import ConsultationManagement from '../src/components/admin/ConsultationManagement';
import RechargePlanManagement from '../src/components/admin/RechargePlanManagement';
import PriceTableManagement from '../src/components/admin/PriceTableManagement';
import PaymentHistory from '../src/components/admin/PaymentHistory';
import TermsManagement from '../src/components/admin/TermsManagement';
import CrlveOrdersAdmin from '../src/pages/admin/CrlveOrdersAdmin';

const AdminPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<string | null>(null);

    useEffect(() => {
        const handleGoHome = () => setActiveSection(null);

        window.addEventListener('admin-gohome', handleGoHome);

        // Limpa o listener quando o componente é desmontado
        return () => {
            window.removeEventListener('admin-gohome', handleGoHome);
        };
    }, []); // O array vazio garante que isso rode apenas uma vez

    const handleNavigation = (section: string) => {
        setActiveSection(section);
    };

    const renderSection = () => {
        if (!activeSection) {
            return <AdminDashboard onNavigate={handleNavigation} />;
        }

        let component;
        switch (activeSection) {
            case 'user-management':
                component = <UserManagement onBack={() => setActiveSection(null)} />;
                break;
            case 'site-settings':
                component = <SiteSettings />;
                break;
            case 'reports':
                component = <Reports />;
                break;
            case 'consultation-management':
                component = <ConsultationManagement />;
                break;
            case 'recharge-plan-management':
                component = <RechargePlanManagement />;
                break;
            case 'price-table-management':
                component = <PriceTableManagement />;
                break;
            case 'payment-history':
                component = <PaymentHistory />;
                break;
            case 'terms-management':
                component = <TermsManagement />;
                break;
            case 'crlve-orders':
                component = <CrlveOrdersAdmin />;
                break;
            default:
                component = <AdminDashboard onNavigate={handleNavigation} />;
        }

        return (
            <div>
                <button 
                    onClick={() => setActiveSection(null)}
                    className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-gray-800 mb-4"
                >
                    <ArrowLeft size={16} />
                    Voltar ao Painel
                </button>
                {component}
            </div>
        );
    };

    return (
        <div className="container mx-auto p-4 md:p-6">
            {renderSection()}
        </div>
    );
};

interface AdminDashboardProps {
    onNavigate: (section: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Painel do Administrador</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AdminCard 
                icon={<Users className="w-8 h-8 text-[#000042]" />} 
                title="Gerenciar Usuários" 
                onClick={() => onNavigate('user-management')} 
            />
            <AdminCard 
                icon={<ClipboardList className="w-8 h-8 text-[#000042]" />} 
                title="Gerenciar Consultas" 
                onClick={() => onNavigate('consultation-management')} 
            />
            <AdminCard 
                icon={<CreditCard className="w-8 h-8 text-[#000042]" />} 
                title="Gerenciar Planos" 
                onClick={() => onNavigate('recharge-plan-management')} 
            />
            <AdminCard 
                icon={<Tags className="w-8 h-8 text-[#000042]" />} 
                title="Tabela de Preços" 
                onClick={() => onNavigate('price-table-management')} 
            />
            <AdminCard 
                icon={<Settings className="w-8 h-8 text-[#000042]" />} 
                title="Configurações do Site" 
                onClick={() => onNavigate('site-settings')} 
            />
            <AdminCard 
                icon={<BarChart className="w-8 h-8 text-[#000042]" />} 
                title="Relatórios" 
                onClick={() => onNavigate('reports')} 
            />
            <AdminCard 
                icon={<DollarSign className="w-8 h-8 text-[#000042]" />} 
                title="Histórico de Pagamentos" 
                onClick={() => onNavigate('payment-history')} 
            />
            <AdminCard 
                icon={<FileText className="w-8 h-8 text-[#000042]" />} 
                title="Termos de Uso" 
                onClick={() => onNavigate('terms-management')} 
            />
        </div>
    </div>
);

export default AdminPage;
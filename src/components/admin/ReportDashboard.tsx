import { ArrowLeft, Users, Search, Landmark } from 'lucide-react';
import StatCard from './StatCard';

interface ReportDashboardProps {
    goBack: () => void;
    stats: any;
    users: any[];
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ goBack, stats, users }) => (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-gray-800">Relatórios</h2>
            <button onClick={goBack} className="flex items-center space-x-2 text-[#0f43aa] hover:underline"><ArrowLeft className="w-4 h-4"/><span>Voltar</span></button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard icon={Users} title="Total de Usuários" value={stats.totalUsers || 0} color="border-[#0f43aa]" />
            <StatCard icon={Search} title="Total de Consultas" value={stats.totalConsultas || 0} color="border-green-500" />
        </div>
        {/* Adicionar mais seções de relatório conforme necessário */}
    </div>
);

export default ReportDashboard;
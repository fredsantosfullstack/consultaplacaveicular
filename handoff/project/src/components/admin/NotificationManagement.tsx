import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface Notification {
    id: string;
    title: string;
    message: string;
    status: 'active' | 'inactive';
}

interface NotificationManagementProps {
  goBack: () => void;
  notifications: Notification[];
}

const NotificationManagement: React.FC<NotificationManagementProps> = ({ goBack, notifications }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <button onClick={goBack} className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gerenciar Avisos e Notificações</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <h3 className="font-semibold text-lg mb-2">Criar Novo Aviso</h3>
                <p className="text-sm text-gray-600">A função de criar notificações está em desenvolvimento.</p>
            </div>

            <div>
                <h3 className="font-semibold text-lg mb-2">Avisos Atuais</h3>
                <div className="space-y-3">
                    {notifications.length > 0 ? notifications.map(n => (
                        <div key={n.id} className="bg-white border p-3 rounded-lg flex justify-between items-center">
                            <div>
                                <p className="font-bold">{n.title}</p>
                                <p className="text-sm text-gray-600">{n.message}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                                <span className={`px-3 py-1 text-sm rounded-full ${n.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {n.status === 'active' ? 'Ativo' : 'Inativo'}
                                </span>
                            </div>
                        </div>
                    )) : (
                        <p className="text-gray-500">Nenhum aviso cadastrado.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NotificationManagement;
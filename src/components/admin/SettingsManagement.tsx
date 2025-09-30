import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface SettingsManagementProps {
  goBack: () => void;
}

const SettingsManagement: React.FC<SettingsManagementProps> = ({ goBack }) => {
    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <button onClick={goBack} className="flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6">
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Configurações Gerais</h2>
            <p className="text-gray-600">A funcionalidade de configurações está em desenvolvimento.</p>
        </div>
    );
};

export default SettingsManagement;

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { apiService } from '../../services/apiService';
import { showSuccess, showError } from '../../utils/toast';
import { ArrowLeft, Save } from 'lucide-react';

interface SettingsManagementProps {
    goBack: () => void;
}

const SettingsManagement: React.FC<SettingsManagementProps> = ({ goBack }) => {
    const { user, setUser } = useAuth();
    const [adminName, setAdminName] = useState(user?.name || '');
    const [contactEmail, setContactEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const settings = await apiService.getSettings();
                setContactEmail(settings.contact_email || '');
            } catch (error) {
                showError('Erro ao carregar configurações.');
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Salvar nome do admin
            if (user && adminName !== user.name) {
                const updatedUser = await apiService.updateUser(user.id, { name: adminName });
                setUser(updatedUser); // Atualiza o contexto
            }

            // Salvar e-mail de contato
            await apiService.updateSetting('contact_email', contactEmail);

            showSuccess('Configurações salvas com sucesso!');
            goBack();
        } catch (error) {
            showError('Erro ao salvar configurações.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Configurações Gerais</h2>
                    <p className="text-gray-600 mt-1">Gerencie dados do sistema e do administrador.</p>
                </div>
                <button 
                    onClick={goBack} 
                    className="flex items-center space-x-2 text-[#0f43aa] hover:text-[#0c3688] transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    <span>Voltar</span>
                </button>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                <div>
                    <label htmlFor="adminName" className="block text-sm font-medium text-gray-700">Nome do Administrador</label>
                    <input
                        type="text"
                        id="adminName"
                        value={adminName}
                        onChange={(e) => setAdminName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700">E-mail de Contato (Rodapé)</label>
                    <input
                        type="email"
                        id="contactEmail"
                        value={contactEmail}
                        onChange={(e) => setContactEmail(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400"
                >
                    <Save className="w-5 h-5 mr-2" />
                    {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </div>
    );
};

export default SettingsManagement;

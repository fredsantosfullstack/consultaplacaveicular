import React from 'react';
import { showSuccess } from '../../utils/toast';
import { ArrowLeft } from 'lucide-react';

interface AppearanceManagementProps {
    setLogoUrl: (url: string) => void;
    setFaviconUrl: (url: string) => void;
    goBack: () => void;
}

const AppearanceManagement: React.FC<AppearanceManagementProps> = ({ setLogoUrl, setFaviconUrl, goBack }) => {
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
                <button onClick={goBack} className="flex items-center space-x-2 text-[#0f43aa] hover:underline"><ArrowLeft className="w-4 h-4"/><span>Voltar</span></button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg space-y-6">
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Logo do Sistema</h3>
                    <p className="text-sm text-gray-500 mb-2">Use uma imagem com fundo transparente (PNG) para melhores resultados. Altura recomendada: 64px.</p>
                    <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogoUrl, 'customLogo')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0f43aa]/10 file:text-[#0f43aa] hover:file:bg-[#0f43aa]/20"/>
                </div>
                <div>
                    <h3 className="text-lg font-semibold text-gray-700">Favicon</h3>
                    <p className="text-sm text-gray-500 mb-2">Use uma imagem quadrada (ex: 32x32 ou 64x64 pixels).</p>
                    <input type="file" accept="image/png, image/x-icon, image/svg+xml" onChange={(e) => handleFileChange(e, setFaviconUrl, 'customFavicon')} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#0f43aa]/10 file:text-[#0f43aa] hover:file:bg-[#0f43aa]/20"/>
                </div>
            </div>
        </div>
    );
};

export default AppearanceManagement;
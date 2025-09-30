import React, { useState, useEffect } from 'react';
import { showSuccess, showError } from '../../utils/toast';
import { ArrowLeft, Upload, Trash2, Image } from 'lucide-react';
import { apiService } from '../../services/apiService';

interface AppearanceManagementProps {
    setLogoUrl: (url: string) => void;
    setFaviconUrl: (url: string) => void;
    goBack: () => void;
}

interface LogoState {
    menu_logo: string | null;
    login_logo: string | null;
}

const AppearanceManagement: React.FC<AppearanceManagementProps> = ({ setLogoUrl, setFaviconUrl, goBack }) => {
    const [logos, setLogos] = useState<LogoState>({ menu_logo: null, login_logo: null });
    const [isLoading, setIsLoading] = useState(false);
    const [uploadingType, setUploadingType] = useState<string | null>(null);

    useEffect(() => {
        loadLogos();
    }, []);

    const loadLogos = async () => {
        try {
            const logos = await apiService.getAllLogos();
            setLogos(logos);
        } catch (error) {
            console.log('Erro ao carregar logos, usando localStorage');
            // Fallback para localStorage
            const menuLogo = localStorage.getItem('customLogo');
            const loginLogo = localStorage.getItem('customLoginLogo');
            setLogos({
                menu_logo: menuLogo,
                login_logo: loginLogo
            });
        }
    };

    const handleLogoUpload = async (file: File, type: 'menu_logo' | 'login_logo') => {
        if (!file) return;
        
        // Validar tamanho do arquivo (máx 2MB)
        if (file.size > 2 * 1024 * 1024) {
            showError('Arquivo muito grande. Tamanho máximo: 2MB');
            return;
        }
        
        // Validar tipo do arquivo
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            showError('Formato inválido. Use PNG, JPG, GIF ou SVG');
            return;
        }
        
        setUploadingType(type);
        setIsLoading(true);
        
        try {
            const reader = new FileReader();
            reader.onloadend = async () => {
                try {
                    const base64String = reader.result as string;
                    console.log(`Processando upload de ${type}:`, {
                        fileSize: file.size,
                        fileType: file.type,
                        base64Length: base64String.length
                    });
                    
                    try {
                        // Tentar enviar para API com payload completo
                        await apiService.uploadLogo({
                            type: type,
                            data: base64String,
                            filename: file.name,
                            mime_type: file.type,
                            file_size: file.size
                        });
                        console.log('Upload via API bem-sucedido');
                        
                        setLogos(prev => ({ ...prev, [type]: base64String }));
                        
                        // Atualizar o logo no sistema
                        if (type === 'menu_logo') {
                            setLogoUrl(base64String);
                            localStorage.setItem('customLogo', base64String);
                        } else {
                            localStorage.setItem('customLoginLogo', base64String);
                        }
                        
                        showSuccess(`${type === 'menu_logo' ? 'Logo do Menu' : 'Logo de Login'} atualizado com sucesso!`);
                        
                        // Disparar evento para atualizar componentes
                        window.dispatchEvent(new CustomEvent('logoUpdated', { detail: { type } }));
                    } catch (apiError) {
                        console.log('API não disponível, salvando localmente:', apiError);
                        // Fallback para localStorage (modo demonstração)
                        setLogos(prev => ({ ...prev, [type]: base64String }));
                        
                        if (type === 'menu_logo') {
                            setLogoUrl(base64String);
                            localStorage.setItem('customLogo', base64String);
                        } else {
                            localStorage.setItem('customLoginLogo', base64String);
                        }
                        
                        showSuccess(`${type === 'menu_logo' ? 'Logo do Menu' : 'Logo de Login'} salvo localmente!`);
                        
                        // Disparar evento para atualizar componentes
                        window.dispatchEvent(new CustomEvent('logoUpdated', { detail: { type } }));
                    }
                } catch (error) {
                    console.error('Erro ao processar base64:', error);
                    showError('Erro ao processar imagem');
                } finally {
                    setIsLoading(false);
                    setUploadingType(null);
                }
            };
            
            reader.onerror = () => {
                showError('Erro ao ler o arquivo');
                setIsLoading(false);
                setUploadingType(null);
            };
            
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Erro no upload:', error);
            showError('Erro ao processar imagem');
            setIsLoading(false);
            setUploadingType(null);
        }
    };

    const handleRemoveLogo = async (type: 'menu_logo' | 'login_logo') => {
        setIsLoading(true);
        
        try {
            // Tentar remover da API
            await apiService.deleteLogo(type);
            
            setLogos(prev => ({ ...prev, [type]: null }));
            
            if (type === 'menu_logo') {
                setLogoUrl('');
                localStorage.removeItem('customLogo');
            } else {
                localStorage.removeItem('customLoginLogo');
            }
            
            showSuccess(`${type === 'menu_logo' ? 'Logo do Menu' : 'Logo de Login'} removido com sucesso!`);
            
            // Disparar evento para atualizar componentes
            window.dispatchEvent(new CustomEvent('logoUpdated', { detail: { type } }));
        } catch (error) {
            console.log('API não disponível, removendo localmente');
            // Fallback para localStorage (modo demonstração)
            setLogos(prev => ({ ...prev, [type]: null }));
            
            if (type === 'menu_logo') {
                localStorage.removeItem('customLogo');
                setLogoUrl('');
            } else {
                localStorage.removeItem('customLoginLogo');
            }
            
            showSuccess(`${type === 'menu_logo' ? 'Logo do Menu' : 'Logo de Login'} removido localmente!`);
            
            // Disparar evento para atualizar componentes
            window.dispatchEvent(new CustomEvent('logoUpdated', { detail: { type } }));
        } finally {
            setIsLoading(false);
        }
    };

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

    const LogoUploadCard = ({ type, title, description, currentLogo }: {
        type: 'menu_logo' | 'login_logo';
        title: string;
        description: string;
        currentLogo: string | null;
    }) => (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-sm text-gray-600">{description}</p>
                </div>
                {currentLogo && (
                    <button
                        onClick={() => handleRemoveLogo(type)}
                        disabled={isLoading}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remover logo"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                )}
            </div>
            
            {currentLogo && (
                <div className="flex justify-center p-4 bg-gray-50 rounded-lg">
                    <img 
                        src={currentLogo} 
                        alt={title}
                        className="max-h-16 max-w-48 object-contain"
                    />
                </div>
            )}
            
            <div className="relative">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoUpload(file, type);
                    }}
                    disabled={isLoading}
                    className="hidden"
                    id={`logo-upload-${type}`}
                />
                <label
                    htmlFor={`logo-upload-${type}`}
                    className={`flex items-center justify-center w-full px-4 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                        isLoading && uploadingType === type
                            ? 'border-blue-300 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                >
                    {isLoading && uploadingType === type ? (
                        <div className="flex items-center space-x-2 text-blue-600">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                            <span className="text-sm font-medium">Enviando...</span>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2 text-gray-600">
                            <Upload className="w-5 h-5" />
                            <span className="text-sm font-medium">
                                {currentLogo ? 'Alterar logo' : 'Enviar logo'}
                            </span>
                        </div>
                    )}
                </label>
            </div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Personalizar Aparência</h2>
                    <p className="text-gray-600 mt-1">Gerencie os logotipos e aparência do sistema</p>
                </div>
                <button 
                    onClick={goBack} 
                    className="flex items-center space-x-2 text-[#0f43aa] hover:text-[#0c3688] transition-colors font-medium"
                >
                    <ArrowLeft className="w-4 h-4"/>
                    <span>Voltar</span>
                </button>
            </div>
            
            {/* Seção de Logotipos */}
            <div className="space-y-6">
                <div className="flex items-center space-x-2">
                    <Image className="w-6 h-6 text-[#0f43aa]" />
                    <h3 className="text-xl font-semibold text-gray-800">Logotipos do Sistema</h3>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <LogoUploadCard
                        type="menu_logo"
                        title="Logo do Menu"
                        description="Exibido no menu principal e header do sistema. Altura recomendada: 64px."
                        currentLogo={logos.menu_logo}
                    />
                    
                    <LogoUploadCard
                        type="login_logo"
                        title="Logo de Login"
                        description="Exibido na tela de login. Altura recomendada: 80px."
                        currentLogo={logos.login_logo}
                    />
                </div>
            </div>
            
            {/* Seção de Outros Elementos */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-800">Outros Elementos</h3>
                
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                    <div>
                        <h4 className="text-lg font-semibold text-gray-700 mb-2">Favicon</h4>
                        <p className="text-sm text-gray-500 mb-3">Ícone exibido na aba do navegador. Use uma imagem quadrada (32x32 ou 64x64 pixels).</p>
                        <input 
                            type="file" 
                            accept="image/png, image/x-icon, image/svg+xml" 
                            onChange={(e) => handleFileChange(e, setFaviconUrl, 'customFavicon')} 
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#0f43aa]/10 file:text-[#0f43aa] hover:file:bg-[#0f43aa]/20 transition-colors"
                        />
                    </div>
                </div>
            </div>
            
            
            {/* Informações de Ajuda */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Dicas para melhores resultados:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use imagens PNG com fundo transparente para logotipos</li>
                    <li>• Mantenha proporções adequadas (evite imagens muito largas ou altas)</li>
                    <li>• Teste em diferentes tamanhos de tela</li>
                    <li>• Formatos aceitos: PNG, JPG, JPEG, GIF, SVG</li>
                    <li>• Tamanho máximo recomendado: 2MB por imagem</li>
                </ul>
            </div>
        </div>
    );
};

export default AppearanceManagement;
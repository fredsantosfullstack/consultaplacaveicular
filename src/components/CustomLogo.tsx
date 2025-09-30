import React, { useState, useEffect } from 'react';
import { GoldenVeicularLogo } from '../../components/Icons';
import { apiService } from '../services/apiService';

interface CustomLogoProps {
    type: 'menu' | 'login';
    className?: string;
    fallbackClassName?: string;
}

const CustomLogo: React.FC<CustomLogoProps> = ({ type, className = '', fallbackClassName = '' }) => {
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadLogo();
    }, [type]);
    
    // Escutar mudanças no localStorage
    useEffect(() => {
        const handleStorageChange = () => {
            console.log('Storage changed, reloading logo');
            loadLogo();
        };
        
        window.addEventListener('storage', handleStorageChange);
        
        // Também escutar mudanças customizadas
        window.addEventListener('logoUpdated', handleStorageChange);
        
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('logoUpdated', handleStorageChange);
        };
    }, [type]);

    const loadLogo = async () => {
        try {
            setIsLoading(true);
            
            // Tentar carregar da API primeiro
            const logoType = type === 'menu' ? 'menu_logo' : 'login_logo';
            
            try {
                const logoData = await apiService.getLogo(logoType);
                if (logoData) {
                    console.log(`Logo ${type} carregado da API:`, logoData.substring(0, 50) + '...');
                    setLogoUrl(logoData);
                    return;
                }
            } catch (apiError) {
                console.log(`API não disponível para ${type}, usando localStorage`);
            }
            
            // Fallback para localStorage
            const storageKey = type === 'menu' ? 'customLogo' : 'customLoginLogo';
            const storedLogo = localStorage.getItem(storageKey);
            
            if (storedLogo) {
                console.log(`Logo ${type} carregado do localStorage:`, storedLogo.substring(0, 50) + '...');
                setLogoUrl(storedLogo);
            } else {
                console.log(`Nenhum logo ${type} encontrado`);
                setLogoUrl(null);
            }
        } catch (error) {
            console.error(`Erro ao carregar logo ${type}:`, error);
            setLogoUrl(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Mostrar loading enquanto carrega
    if (isLoading) {
        return (
            <div className={`animate-pulse bg-gray-200 rounded ${className}`}>
                <div className="h-full w-full"></div>
            </div>
        );
    }

    // Se tem logo customizado, mostrar ele
    if (logoUrl) {
        return (
            <img 
                src={logoUrl} 
                alt="Golden Veicular Logo" 
                className={`object-contain ${className}`}
                onError={() => {
                    // Se der erro ao carregar a imagem, remove do estado e localStorage
                    setLogoUrl(null);
                    const storageKey = type === 'menu' ? 'customLogo' : 'customLoginLogo';
                    localStorage.removeItem(storageKey);
                }}
            />
        );
    }

    // Fallback para o logo padrão
    return <GoldenVeicularLogo className={fallbackClassName || className} />;
};

export default CustomLogo;

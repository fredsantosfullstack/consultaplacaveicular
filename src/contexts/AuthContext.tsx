import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import api from '../services/api';

// Tipos que serão mantidos e adaptados para a nova API
export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  document_number?: string | null;
  company?: string | null;
  balance: number;
  avatar?: string | null;
  created_at?: string;
  role?: 'admin' | 'user';
  recovery_email?: string;
}
interface AuthContextType {
  profile: UserProfile | null;
  login: (token: string, rememberMe?: boolean) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateProfile: (data: Partial<UserProfile>) => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Inicia como true para simular a verificação inicial

    const fetchProfile = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setProfile(data);
    } catch (error: any) {
      const status = error?.response?.status;
      if (status === 401 || status === 403) {
        console.error('Authorization error, logging out.');
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        setProfile(null);
      } else {
        console.error('Failed to fetch profile', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) {
      // Configura o header do Axios antes de fazer a chamada
      api.defaults.headers.common = (api.defaults.headers.common || {}) as any;
      (api.defaults.headers.common as any)['Authorization'] = `Bearer ${token}`;
      fetchProfile();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string, rememberMe = false) => {
    console.log('🔐 Login - Salvando token...', { rememberMe, tokenLength: token.length });
    if (rememberMe) {
      localStorage.setItem('token', token);
      console.log('✅ Token salvo no localStorage');
    } else {
      sessionStorage.setItem('token', token);
      console.log('✅ Token salvo no sessionStorage');
    }
    // Garante que a próxima requisição já leve o token
    api.defaults.headers.common = (api.defaults.headers.common || {}) as any;
    (api.defaults.headers.common as any)['Authorization'] = `Bearer ${token}`;
    await fetchProfile();
    console.log('✅ Login completo!');
  };

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
    // Remove header Authorization para evitar uso de token antigo
    if ((api as any).defaults?.headers?.common) {
      delete (api.defaults.headers.common as any)['Authorization'];
    }
    setProfile(null);
    setIsLoading(false);
  };

    const updateProfile = (data: Partial<UserProfile>) => {
    setProfile(prev => prev ? { ...prev, ...data } : null);
  };

  const refreshProfile = async () => {
    console.log('🔄 Atualizando perfil do usuário...');
    await fetchProfile();
    console.log('✅ Perfil atualizado!');
  };

  const value = {
    profile,
    login,
    logout,
    isLoading,
    updateProfile,
    refreshProfile,
  };


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService, User } from '../services/apiService';
import toast from 'react-hot-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar autenticação ao carregar a aplicação
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      if (apiService.isAuthenticated()) {
        try {
          const userData = await apiService.verifyToken();
          setUser(userData);
        } catch (apiError) {
          console.log('API não disponível, usando dados do localStorage');
          // Fallback para dados do localStorage
          const storedUser = apiService.getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Se não há dados válidos, fazer logout
            await logout();
          }
        }
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Token inválido, limpar dados
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      try {
        const { user: userData } = await apiService.login(email, password);
        setUser(userData);
        toast.success('Login realizado com sucesso!');
      } catch (apiError) {
        console.log('API não disponível, usando login local de demonstração');
        
        // Fallback para login local (apenas para demonstração)
        if (email === 'admin@goldenveicular.com.br' && password === 'admin123') {
          const mockUser: User = {
            id: 1,
            name: 'Admin User',
            email: 'admin@goldenveicular.com.br',
            role: 'admin',
            status: 'active',
            balance: 100,
            created_at: new Date().toISOString()
          };
          
          // Salvar no localStorage
          localStorage.setItem('user_data', JSON.stringify(mockUser));
          localStorage.setItem('token', 'demo_token_admin');
          
          setUser(mockUser);
          toast.success('Login realizado com sucesso (modo demonstração)!');
        } else if (email === 'user@teste.com' && password === 'user123') {
          const mockUser: User = {
            id: 2,
            name: 'Usuário Teste',
            email: 'user@teste.com',
            role: 'user',
            status: 'active',
            balance: 50,
            created_at: new Date().toISOString()
          };
          
          // Salvar no localStorage
          localStorage.setItem('user_data', JSON.stringify(mockUser));
          localStorage.setItem('token', 'demo_token_user');
          
          setUser(mockUser);
          toast.success('Login realizado com sucesso (modo demonstração)!');
        } else {
          throw new Error('Credenciais inválidas. Use: admin@goldenveicular.com.br / admin123 ou user@teste.com / user123');
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao fazer login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    // Limpa o estado local e redireciona imediatamente para uma UX instantânea
    setUser(null);
    toast.success('Logout realizado com sucesso!');
    window.location.href = '/login';

    // Tenta fazer o logout da API em segundo plano, sem bloquear o usuário
    // Tenta fazer o logout da API em segundo plano, sem bloquear o usuário
    await apiService.logout().catch(error => {
      console.error('Erro ao invalidar token no servidor:', error);
    });
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  const refreshUser = async () => {
    try {
      if (user) {
        const updatedUser = await apiService.getProfile();
        setUser(updatedUser);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;

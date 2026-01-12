import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../src/services/api';
import { useAuth } from '../src/contexts/AuthContext';
import CustomLogo from '../src/components/CustomLogo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { profile, login } = useAuth();

  useEffect(() => {
    if (profile) {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password, rememberMe });
      if (response.data.token) {
        await login(response.data.token, rememberMe);
      }
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao fazer login.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mt-6 mb-10">
            <CustomLogo type="login" className="w-[260px] h-auto" />
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full p-3 pl-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 transition-all duration-300"
                  placeholder="seu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">Senha</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full p-3 pl-12 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 transition-all duration-300 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden"
                  placeholder="Sua senha"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-[#055a9f]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="h-4 w-4 border-gray-300 rounded accent-[#076AC2] focus:ring-[#076AC2]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-gray-800">Lembrar de mim</label>
              </div>
              <div>
                <Link
                  to="/recuperar-senha"
                  className="font-medium text-[#076AC2] hover:text-[#00A788] hover:underline"
                >
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center font-medium">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-[#076AC2] hover:bg-[#055a9f] disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#076AC2]"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Não tem uma conta?{' '}
              <Link
                to="/cadastre-se"
                className="font-bold text-[#076AC2] hover:text-[#00A788] hover:underline"
              >
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>
        
        <p className="mt-6 text-center text-xs text-gray-500">
          Ao entrar, você concorda com nossos{' '}
          <a href="/termos-de-uso" target="_blank" rel="noreferrer" className="font-medium text-gray-600 hover:underline">Termos de Uso</a>
          {' e '}
          <a href="/politica-de-privacidade" target="_blank" rel="noreferrer" className="font-medium text-gray-600 hover:underline">Política de Privacidade</a>.
        </p>
      </div>
    </div>
  );
};

export default Login;

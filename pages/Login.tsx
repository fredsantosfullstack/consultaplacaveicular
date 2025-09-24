import React, { useState } from 'react';
import { GoldenVeicularLogo } from '../components/Icons';
import { Mail, Lock, ArrowRight } from 'lucide-react';

interface LoginProps {
  onLogin: (username: string) => void;
}

const SuccessModal = () => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center z-50 animate-fade-in">
    <div className="bg-white rounded-lg shadow-2xl p-8 max-w-sm w-full text-center transform transition-all duration-300 ease-out animate-scale-in">
       <div className="mx-auto mb-4 w-20 h-20">
            <svg className="checkmark-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
                <circle className="checkmark-circle" cx="26" cy="26" r="25"/>
                <path className="checkmark-check" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
            </svg>
       </div>
      <h2 className="text-2xl font-bold text-gray-800 mt-4">Login realizado com sucesso!</h2>
      <p className="text-gray-600 mt-2">Você será redirecionado em instantes...</p>
    </div>
  </div>
);

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (username && password) {
      setIsLoading(true);
      setTimeout(() => {
        setShowSuccess(true);
        setTimeout(() => {
          onLogin(username);
        }, 2000);
      }, 500);

    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200/80 p-8 sm:p-10 space-y-6">
        <div className="text-center mb-4">
            <div className="flex justify-center">
                <GoldenVeicularLogo className="h-20 w-auto" />
            </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <fieldset disabled={isLoading} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
                  placeholder="seu@email.com"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors duration-200"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Lembrar-me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Esqueceu sua senha?
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-0.5"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            </div>
          </fieldset>
        </form>

        <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200 space-y-1">
          <p>
            Não tem uma conta?{' '}
            <a href="#" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              Cadastre-se
            </a>
          </p>
          <p className="text-xs text-gray-500">
            Entre em contato com o suporte para criar seu acesso.
          </p>
        </div>
      </div>
    </div>
    {showSuccess && <SuccessModal />}
    </>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';
import { useAuth } from '../src/contexts/AuthContext';
import CustomLogo from '../src/components/CustomLogo';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { session } = useAuth();

  useEffect(() => {
    // Se já houver uma sessão ativa, redireciona para o dashboard
    if (session) {
      navigate('/dashboard');
    }
  }, [session, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        throw error;
      }
      // O AuthContext cuidará do redirecionamento no sucesso
    } catch (error: any) {
      let message = 'Erro ao fazer login.';
      const raw = (error?.message || '').toString();
      const l = raw.toLowerCase();
      if (l.includes('email not confirmed')) {
        message = 'E-mail não confirmado. Verifique sua caixa de entrada (ou spam) e confirme seu cadastro.';
      } else if (l.includes('invalid login credentials') || l.includes('invalid_grant')) {
        message = 'Credenciais inválidas. Verifique o e-mail e a senha.';
      } else if (raw) {
        message = raw;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200/80 p-8 sm:p-10 space-y-6">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <CustomLogo 
              type="login" 
              className="w-[150px] h-auto"
              fallbackClassName="w-[150px] h-auto"
            />
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#0f43aa] focus:outline-none focus:ring-2 focus:ring-[#0f43aa]/20 transition-colors duration-200"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-4 py-2.5 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-[#0f43aa] focus:outline-none focus:ring-2 focus:ring-[#0f43aa]/20 transition-colors duration-200"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <div className="text-sm">
                <Link to="/recuperar-senha" className="font-medium text-[#0f43aa] hover:text-[#0c3688] transition-colors">
                  Esqueceu sua senha?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button
                type="submit"
                className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#0f43aa] hover:bg-[#0c3688] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0f43aa] disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-[#0f43aa]/30 transform hover:-translate-y-0.5"
              >
                {isLoading ? 'Entrando...' : 'Entrar'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />}
              </button>
            </div>
          </fieldset>
        </form>

        <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200 space-y-4">
          <div>
            <p>
              Não tem uma conta?{' '}
              <Link to="/cadastre-se" className="font-medium text-[#0f43aa] hover:text-[#0c3688] transition-colors">
                Cadastre-se
              </Link>
            </p>
          </div>
          <p className="text-xs text-gray-500">
            Ao clicar em Entrar você concorda com os{' '}
            <Link to="/termos-de-uso" target="_blank" className="font-medium text-[#0f43aa] hover:text-[#0c3688]">
              Termos de Uso
            </Link>{' '}
            e{' '}
            <Link to="/termos-de-uso" target="_blank" className="font-medium text-[#0f43aa] hover:text-[#0c3688]">
              Política de Privacidade
            </Link>{' '}
            da Golden Veicular.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

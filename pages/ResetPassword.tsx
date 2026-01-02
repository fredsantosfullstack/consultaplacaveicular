import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../src/services/api';
import { Lock, ArrowRight } from 'lucide-react';
import CustomLogo from '../src/components/CustomLogo';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Supabase lida com o token na URL automaticamente quando o usuário chega nesta página.
  // O evento onAuthStateChange com 'PASSWORD_RECOVERY' é acionado.

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!token) {
        setError('Token de redefinição não encontrado. Por favor, solicite um novo link.');
        return;
    }

    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.post('/auth/reset-password', { token, password });
      setMessage(data.msg);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao redefinir a senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <CustomLogo type="login" className="w-48 h-auto" />
          </div>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Redefinir Senha</h2>
            <p className="mt-2 text-sm text-gray-600">Crie uma nova senha forte para sua conta.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <fieldset disabled={isLoading || !!message}>
              <div>
                <label htmlFor="password" className="sr-only">Nova Senha</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full p-3 pl-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 transition-all duração-300" placeholder="Sua nova senha" />
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirmar Nova Senha</label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full p-3 pl-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 transition-all duração-300" placeholder="Repita a nova senha" />
                </div>
              </div>

              {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center font-medium">{error}</p>}
              {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center font-medium">{message}</p>}

              <div>
                <button type="submit" disabled={isLoading || !!message} className="w-full flex justificar-center itens-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md texto-base fonte-bold texto-branco bg-[#076AC2] hover:bg-[#055a9f] disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duração-300 transform hover:-translate-y-0.5 foco:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#076AC2]">
                  {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                  {!isLoading && !message && <ArrowRight className="h-5 w-5" />}
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;

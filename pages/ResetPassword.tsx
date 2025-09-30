import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight } from 'lucide-react';
import CustomLogo from '../src/components/CustomLogo';
import { apiService } from '../src/services/apiService';
import toast from 'react-hot-toast';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
    } else {
      setError('Token de redefinição não encontrado ou inválido.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (!token) {
      setError('Token inválido.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await apiService.resetPassword(token, password);
      toast.success('Senha redefinida com sucesso! Você já pode fazer o login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao redefinir a senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <CustomLogo type="login" className="h-20 w-auto" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Redefinir Senha</h2>
          <p className="mt-2 text-sm text-gray-600">Crie uma nova senha para sua conta.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <fieldset disabled={isLoading || !token}>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Nova Senha</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-4 py-2.5" placeholder="Sua nova senha" />
              </div>
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Nova Senha</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="confirm-password" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-4 py-2.5" placeholder="Repita a nova senha" />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={isLoading || !token} className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#0f43aa] hover:bg-[#0c3688]">
                {isLoading ? 'Redefinindo...' : 'Redefinir Senha'}
                {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
              </button>
            </div>
          </fieldset>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

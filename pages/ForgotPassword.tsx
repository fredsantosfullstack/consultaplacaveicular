import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import CustomLogo from '../src/components/CustomLogo';
import { supabase } from '../src/supabaseClient';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setError('');
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/resetar-senha`,
      });
      if (error) throw error;
      setMessage('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha. Verifique sua caixa de entrada e spam.');
    } catch (error: any) {
      setError(error.message || 'Erro ao solicitar redefinição de senha.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <CustomLogo type="login" className="w-[150px] h-auto" fallbackClassName="w-[150px] h-auto" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Recuperar Senha</h2>
          <p className="mt-2 text-sm text-gray-600">Digite seu e-mail para receber o link de redefinição.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 pl-12 pr-4 py-2.5" placeholder="seu@email.com" />
            </div>
          </div>

          {message && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
              {message}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="pt-4">
            <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#0f43aa] hover:bg-[#0c3688] disabled:opacity-70">
              {isLoading ? 'Enviando...' : 'Enviar Link de Recuperação'}
              {!isLoading && <ArrowRight className="ml-2 h-5 w-5" />}
            </button>
          </div>
        </form>

        <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
          <p>
            Lembrou a senha?{' '}
            <Link to="/login" className="font-medium text-[#0f43aa] hover:text-[#0c3688]">
              Faça o login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

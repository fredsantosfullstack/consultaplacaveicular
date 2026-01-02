import React, { useState } from 'react';
import api from '../src/services/api';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';
import CustomLogo from '../src/components/CustomLogo';

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
      const { data } = await api.post('/auth/forgot-password', { email });
      setMessage(data.msg);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao solicitar redefinição.');
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
            <h2 className="text-2xl font-bold text-gray-800">Recuperar Senha</h2>
            <p className="mt-2 text-sm text-gray-600">Sem problemas! Digite seu e-mail abaixo.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full p-3 pl-12 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 transition-all duration-300" placeholder="seu@email.com" />
              </div>
            </div>

            {message && <p className="bg-green-100 text-green-700 p-3 rounded-lg text-sm text-center font-medium">{message}</p>}
            {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center font-medium">{error}</p>}

            <div>
              <button type="submit" disabled={isLoading || !!message} className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-[#076AC2] hover:bg-[#055a9f] disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#076AC2]">
                {isLoading ? 'Enviando...' : 'Enviar Link'}
                {!isLoading && !message && <ArrowRight className="h-5 w-5" />}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center text-sm">
            <p className="text-gray-600">
              Lembrou a senha?{' '}
              <Link to="/login" className="font-bold text-[#076AC2] hover:text-[#055a9f] hover:underline">Faça login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

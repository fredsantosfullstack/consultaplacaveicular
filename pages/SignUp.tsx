import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, FileText, Phone, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '../src/services/api';

const InputField = ({ icon: Icon, type, ...props }) => (
  <div className="relative">
    {Icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5"><Icon className="h-5 w-5 text-gray-400" /></div>}
    <input 
      {...props} 
      type={type}
      autoComplete={type === 'password' ? 'new-password' : undefined}
      className={`w-full p-3 ${Icon ? 'pl-12' : 'pl-4'} border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 transition-all duration-300 ${type === 'password' ? '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden' : ''}`} 
    />
  </div>
);

const SignUp: React.FC = () => {
  const [documentType, setDocumentType] = useState('cpf');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name, email, password, documentType, documentNumber, phone
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Conta Criada com Sucesso!</h2>
          <p className="text-gray-600 mb-6">Você já pode fazer login na plataforma.</p>
          <Link to="/login" className="w-full flex items-center justify-center gap-2 bg-[#076AC2] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#055a9f] transition-all transform hover:-translate-y-0.5">
            <ArrowLeft size={16} />
            <span>Ir para o Login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Crie sua Conta</h1>
          <p className="text-gray-500">Rápido e fácil, vamos começar.</p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-5">
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center font-medium">{error}</p>}

          <InputField icon={User} type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="Nome Completo" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <select value={documentType} onChange={e => setDocumentType(e.target.value)} className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 appearance-none">
                <option value="cpf">Pessoa Física (CPF)</option>
                <option value="cnpj">Pessoa Jurídica (CNPJ)</option>
              </select>
            </div>
            <InputField icon={FileText} type="text" value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} required placeholder={`Número do ${documentType.toUpperCase()}`} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={Mail} type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Seu melhor e-mail" />
            <InputField icon={Phone} type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="(XX) XXXXX-XXXX" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={Lock} type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="Senha (mín. 6 dígitos)" />
            <InputField icon={Lock} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} placeholder="Confirmar Senha" />
          </div>

          <div className="pt-2">
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-[#076AC2] hover:bg-[#055a9f] disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#076AC2]">
              {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Já tem uma conta?{' '}
            <Link to="/login" className="font-bold text-[#076AC2] hover:text-[#00A788] hover:underline">Faça login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

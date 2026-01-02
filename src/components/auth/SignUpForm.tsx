import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import FormField from '../common/FormField';
import { User, Mail, Lock, Phone, FileText } from 'lucide-react';

const SignUpForm: React.FC = () => {
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
      await api.post('/auth/register', { name, email, password, documentType, documentNumber, phone });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold text-green-400 mb-4">Conta Criada!</h2>
        <p>Sua conta foi criada com sucesso.</p>
        <p className="mt-4">Agora você pode fazer o login.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignUp} className="space-y-6">
      {error && <p className="bg-red-500/30 text-white p-3 rounded text-sm text-center">{error}</p>}

      <FormField id="name" label="Nome Completo" type="text" value={name} onChange={e => setName(e.target.value)} icon={User} required />
      <FormField id="email-signup" label="Seu melhor e-mail" type="email" value={email} onChange={e => setEmail(e.target.value)} icon={Mail} required />
      <FormField id="phone" label="(XX) XXXXX-XXXX" type="tel" value={phone} onChange={e => setPhone(e.target.value)} icon={Phone} required />
      <div className="flex gap-4">
        <select onChange={(e) => setDocumentType(e.target.value)} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#076AC2] focus:border-[#076AC2] block w-1/3 p-2.5">
          <option value="cpf">CPF</option>
          <option value="cnpj">CNPJ</option>
        </select>
        <div className="w-2/3">
          <FormField id="documentNumber" label="Número do Documento" type="text" value={documentNumber} onChange={e => setDocumentNumber(e.target.value)} icon={FileText} required />
        </div>
      </div>
      <FormField id="password-signup" label="Senha (mín. 6 dígitos)" type="password" value={password} onChange={e => setPassword(e.target.value)} icon={Lock} required />
      <FormField id="confirmPassword" label="Confirmar Senha" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} icon={Lock} required />

      <p className="text-center text-xs text-red-400 pt-4">
        É crime a inserção de dados falsos em sistema de informações, conforme o art. 313-A do Código Penal Brasileiro.
      </p>

      <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-[#076AC2] rounded-full text-white font-semibold hover:bg-[#055a9f] disabled:opacity-50 transition-all duration-300 transform hover:scale-105">
        {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
      </button>
    </form>
  );
};

export default SignUpForm;

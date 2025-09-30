import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, FileText, Phone } from 'lucide-react';
import CustomLogo from '../src/components/CustomLogo';
import { apiService } from '../src/services/apiService';
import toast from 'react-hot-toast';
import InputMask from 'react-input-mask';

const SignUp: React.FC = () => {
  const [documentType, setDocumentType] = useState('CPF');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
        setError('A senha deve ter no mínimo 6 dígitos.');
        return;
    }

    setIsLoading(true);
    try {
      await apiService.register({ 
          name, 
          email, 
          password, 
          document_type: documentType, 
          document_number: documentNumber.replace(/\D/g, ''), // Remove non-digit characters
          phone: phone.replace(/\D/g, '')
      });
      toast.success('Cadastro realizado com sucesso! Faça o login para continuar.');
      navigate('/login');
    } catch (err: any) {
      setError(err.message || 'Erro ao realizar o cadastro.');
    } finally {
      setIsLoading(false);
    }
  };

  const documentMask = documentType === 'CPF' ? '999.999.999-99' : '99.999.999/9999-99';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <CustomLogo type="login" className="h-20 w-auto" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Crie sua Conta</h2>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <fieldset disabled={isLoading}>
            <div>
              <label htmlFor="documentType" className="block text-sm font-medium text-gray-700">Tipo de Cadastro</label>
              <select id="documentType" value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                <option>CPF</option>
                <option>CNPJ</option>
              </select>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome Completo</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="Seu nome completo" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="seu@email.com" />
            </div>

            <div>
              <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700">Número do {documentType}</label>
              <InputMask mask={documentMask} value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder={`Informe o ${documentType}`} />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">DD+Telefone</label>
              <InputMask mask="(99) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" placeholder="(99) 99999-9999" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha (mínimo 6 dígitos)</label>
              <input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="group w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#0f43aa] hover:bg-[#0c3688]">
                {isLoading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </div>
          </fieldset>
        </form>

        <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            <p className="mb-4">Já tem uma conta? <Link to="/login" className="font-medium text-[#0f43aa] hover:text-[#0c3688]">Login</Link></p>
            <p className="text-xs text-red-600">É crime a inserção de dados falsos em sistema de informações, conforme o art. 313-A do Código Penal Brasileiro.</p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../src/supabaseClient';
import CustomLogo from '../src/components/CustomLogo';
import InputMask from 'react-input-mask';

const SignUp: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [documentType, setDocumentType] = useState('cpf');
  const [documentNumber, setDocumentNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            name: name,
            document_type: documentType,
            document_number: documentNumber,
            phone: phone,
          },
        },
      });

      if (error) {
        throw error;
      }
      
      if (data.user && data.user.identities && data.user.identities.length === 0) {
         setError('Este e-mail já está cadastrado.');
      } else {
        setSuccess(true);
      }

    } catch (err: any) {
      setError(err.message || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
    }
  };

  const documentMask = documentType === 'cpf' ? '999.999.999-99' : '99.999.999/9999-99';

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 text-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
          <h2 className="text-2xl font-bold text-green-600 mb-4">Verifique seu e-mail!</h2>
          <p className="text-gray-700 mb-6">Enviamos um link de confirmação para <strong>{email}</strong>. Por favor, clique no link para ativar sua conta.</p>
          <Link to="/login" className="font-medium text-[#0f43aa] hover:text-[#0c3688]">
            Voltar para o Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-200/80 p-8 sm:p-10 space-y-6">
        <div className="text-center mb-4">
          <div className="flex justify-center">
            <CustomLogo type="login" className="w-[150px] h-auto" fallbackClassName="w-[150px] h-auto" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-gray-800">Crie sua conta</h2>
          <p className="mt-2 text-sm text-gray-600">Comece a usar nossos serviços de consulta.</p>
        </div>
        
        <form onSubmit={handleSignUp} className="space-y-4">
          <fieldset disabled={isLoading} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Nome Completo</label>
              <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5" placeholder="Seu nome completo" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">E-mail</label>
              <input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5" placeholder="seu@email.com" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="documentType" className="block text-sm font-medium text-gray-700 mb-1.5">Tipo</label>
                    <select id="documentType" value={documentType} onChange={(e) => setDocumentType(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5">
                        <option value="cpf">CPF</option>
                        <option value="cnpj">CNPJ</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="documentNumber" className="block text-sm font-medium text-gray-700 mb-1.5">Número do Documento</label>
                    <InputMask mask={documentMask} value={documentNumber} onChange={(e) => setDocumentNumber(e.target.value)} required className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5" placeholder={documentMask} />
                </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Celular com DDD</label>
              <InputMask mask="(99) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)} required className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5" placeholder="(99) 99999-9999" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">Senha</label>
                    <input id="password" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5" />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirmar Senha</label>
                    <input id="confirmPassword" type="password" required minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5" />
                </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="pt-4">
              <button type="submit" disabled={isLoading} className="group w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-lg text-white bg-[#0f43aa] hover:bg-[#0c3688] disabled:opacity-70">
                {isLoading ? 'Criando conta...' : 'Criar Conta'}
              </button>
            </div>
          </fieldset>
        </form>

        <div className="text-center text-sm text-gray-600 pt-4 border-t border-gray-200">
            <p>Já tem uma conta? <Link to="/login" className="font-medium text-[#0f43aa] hover:text-[#0c3688]">Faça login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;

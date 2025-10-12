import React, { useState, useEffect } from 'react';
import { Save, Eye, EyeOff, Loader2, Mail, Key, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../services/api';

interface ApiCredentials {
  api_email: string;
  api_password: string;
}

const ApiSettings: React.FC = () => {
  const [credentials, setCredentials] = useState<ApiCredentials>({ api_email: '', api_password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCredentials();
  }, []);

  const fetchCredentials = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/admin/api-settings');
      setCredentials(response.data);
    } catch (error) {
      console.error('Erro ao buscar credenciais:', error);
      setMessage({ type: 'error', text: 'Erro ao carregar configurações da API.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setMessage(null);
  };

  const handleSave = async () => {
    if (!credentials.api_email || !credentials.api_password) {
      setMessage({ type: 'error', text: 'Por favor, preencha todos os campos.' });
      return;
    }

    setIsSaving(true);
    setMessage(null);
    try {
      await api.put('/admin/api-settings', credentials);
      setMessage({ type: 'success', text: 'Credenciais da API atualizadas com sucesso!' });
    } catch (error: any) {
      console.error('Erro ao salvar credenciais:', error);
      setMessage({ type: 'error', text: error.response?.data?.msg || 'Erro ao salvar configurações.' });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md flex justify-center items-center min-h-[300px]">
        <Loader2 className="animate-spin text-[#000042]" size={48} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Credenciais da API de Consultas</h2>
        <p className="text-gray-500">Configure o email e senha usados para autenticação na API externa de consultas veiculares.</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <span>{message.text}</span>
        </div>
      )}

      <div className="space-y-4">
        {/* Email da API */}
        <div>
          <label htmlFor="api_email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline w-4 h-4 mr-1" />
            Email da API
          </label>
          <input
            type="email"
            id="api_email"
            name="api_email"
            value={credentials.api_email}
            onChange={handleInputChange}
            placeholder="exemplo@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Email com créditos ilimitados na API externa</p>
        </div>

        {/* Senha da API */}
        <div>
          <label htmlFor="api_password" className="block text-sm font-medium text-gray-700 mb-2">
            <Key className="inline w-4 h-4 mr-1" />
            Senha da API
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="api_password"
              name="api_password"
              value={credentials.api_password}
              onChange={handleInputChange}
              placeholder="••••••••"
              className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Senha de autenticação na API externa</p>
        </div>
      </div>

      <div className="flex justify-end items-center pt-4 border-t border-gray-200">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#000042] text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Salvando...
            </>
          ) : (
            <>
              <Save size={18} />
              Salvar Configurações
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ApiSettings;

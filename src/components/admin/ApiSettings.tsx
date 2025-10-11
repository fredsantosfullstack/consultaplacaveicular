import React, { useState } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import api from '../../services/api';

interface TestResult {
  asaas: boolean | null;
  consultation: boolean | null;
}

const ApiSettings: React.FC = () => {
  const [keys, setKeys] = useState({ asaasApiKey: '', consultationApiKey: '' });
  const [results, setResults] = useState<TestResult>({ asaas: null, consultation: null });
  const [isTesting, setIsTesting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeys({ ...keys, [e.target.name]: e.target.value });
  };

  const handleTest = async () => {
    setIsTesting(true);
    setResults({ asaas: null, consultation: null });
    try {
      const response = await api.post('/api-keys/test', keys);
      setResults(response.data);
    } catch (error) {
      console.error('Erro ao testar chaves', error);
      alert('Ocorreu um erro ao se comunicar com o servidor.');
    }
    setIsTesting(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Configurações de API</h2>
        <p className="text-gray-500">Insira as chaves de API para testar a conexão com os serviços. As chaves não são salvas no banco de dados.</p>
      </div>

      <div className="space-y-4">
        <ApiKeyInput 
          label="Asaas API Key"
          name="asaasApiKey"
          value={keys.asaasApiKey}
          onChange={handleInputChange}
          result={results.asaas}
        />
        <ApiKeyInput 
          label="API de Consulta Key"
          name="consultationApiKey"
          value={keys.consultationApiKey}
          onChange={handleInputChange}
          result={results.consultation}
        />
      </div>

      <div className="flex justify-end items-center pt-4">
        <button 
          onClick={handleTest}
          disabled={isTesting}
          className="bg-[#000042] text-white font-bold py-2 px-6 rounded-lg flex items-center gap-2 disabled:bg-gray-400"
        >
          {isTesting ? <Loader2 className="animate-spin" /> : 'Testar Conexão'}
        </button>
      </div>
    </div>
  );
};

// Componente auxiliar
const ApiKeyInput = ({ label, name, value, onChange, result }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      <input
        type="password"
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="block w-full pr-10 p-2 border rounded-md"
      />
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        {result === true && <CheckCircle className="h-5 w-5 text-green-500" />}
        {result === false && <XCircle className="h-5 w-5 text-red-500" />}
      </div>
    </div>
  </div>
);

export default ApiSettings;

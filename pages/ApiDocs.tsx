import React, { useState } from 'react';
import { ArrowLeft, FileText, Copy, Check, TriangleAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


interface ApiDocsProps {
  // setCurrentPage: (page: Page) => void; // Removed
}

const CodeBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <pre className="bg-gray-100 text-gray-800 p-4 rounded-md text-sm overflow-x-auto border border-gray-200">
        <code>{children}</code>
    </pre>
);

const ApiDocs: React.FC<ApiDocsProps> = () => { // Removed setCurrentPage from props
  const [requestExample, setRequestExample] = useState('');
  const navigate = useNavigate();
  
  const handleShowExample = () => {
      setRequestExample(
`{
  "placa": "XXX0000",
  "renavam": "00000000000",
  "chassi": "00000000000000000"
}`
      );
  };
  
  return (
    <div className="p-8 space-y-6">
      <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-blue-500 hover:underline">
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar</span>
      </button>

      <div className="flex items-center space-x-3 text-2xl font-bold text-gray-800">
          <FileText className="w-8 h-8 text-blue-500" />
          <h1>Documentação das APIs - CRV / CRLV</h1>
      </div>
      <p className="text-gray-600">Solicite sua chave de acesso no menu inicial, via WhatsApp do suporte.</p>
      
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <Copy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-xl font-semibold text-gray-700">Autenticação</h2>
          </div>
          <p className="text-gray-600">Para todas as requisições, você deve incluir o seguinte cabeçalho:</p>
          <CodeBlock>
{`{
  "Content-Type": "application/json",
  "chaveacesso": "SUA_CHAVE_AQUI"
}`}
          </CodeBlock>
      </div>

       <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-700">Endpoints disponíveis</h2>
          </div>
          <p className="text-gray-600">Use o menu abaixo para escolher o tipo de consulta que deseja Integrar.</p>
      </div>
      
       <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <FileText className="w-6 h-6 text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-700">Guia de Requisições API</h2>
          </div>
          <div className="space-y-4">
            <label htmlFor="consulta-tipo" className="block text-sm font-medium text-gray-700">Escolha o tipo de consulta:</label>
            <select id="consulta-tipo" className="w-full p-2 border border-gray-300 bg-gray-50 rounded-lg text-gray-900 focus:bg-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 transition-colors duration-200">
                <option>Consulta Base Estadual (POST)</option>
                <option>Consulta CRLV-E (POST)</option>
                <option>Consulta Débitos (POST)</option>
            </select>
            <button onClick={handleShowExample} className="bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-400 transition-colors duration-200">
                Mostrar exemplo de request
            </button>
            {requestExample && <CodeBlock>{requestExample}</CodeBlock>}
          </div>
      </div>

       <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <Check className="w-6 h-6 text-green-500" />
            <h2 className="text-xl font-semibold text-gray-700">Respostas comuns</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><span className="font-bold">200 - Sucesso.</span> A resposta pode retornar um arquivo PDF com cabeçalho <code className="text-sm bg-gray-200 p-1 rounded">content-type: application/pdf</code>.</li>
          </ul>
      </div>

       <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="flex items-center space-x-3">
            <TriangleAlert className="w-6 h-6 text-red-500" />
            <h2 className="text-xl font-semibold text-gray-700">Erros comuns</h2>
          </div>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            <li><span className="font-bold">400</span> - Saldo insuficiente, dados incompletos ou inválidos.</li>
            <li><span className="font-bold">401</span> - A chave está errada, vencida ou faltando.</li>
            <li><span className="font-bold">404</span> - Endpoint errado (ex: escrever <code className="text-sm bg-gray-200 p-1 rounded">consulta</code> ao invés de <code className="text-sm bg-gray-200 p-1 rounded">consultar</code>).</li>
            <li><span className="font-bold">500</span> - Problema no servidor da API.</li>
          </ul>
      </div>
      
    </div>
  );
};

export default ApiDocs;
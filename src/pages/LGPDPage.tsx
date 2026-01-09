import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

const LGPDPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para o início
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="flex items-center mb-8">
            <Shield className="w-12 h-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">LGPD</h1>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Compromisso com a LGPD</h2>
              <p className="text-gray-700 leading-relaxed">
                A Consulta Placa Veicular está comprometida com a proteção de dados pessoais e o cumprimento integral da Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Seus Direitos</h2>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Confirmar e acessar seus dados</li>
                <li>Corrigir dados incompletos ou inexatos</li>
                <li>Solicitar anonimização, bloqueio ou eliminação</li>
                <li>Solicitar portabilidade de dados</li>
                <li>Revogar consentimento a qualquer momento</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Segurança</h2>
              <p className="text-gray-700 leading-relaxed">
                Implementamos criptografia, controle de acesso, monitoramento contínuo e backups regulares para proteger seus dados.
              </p>
            </section>

            <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <p className="text-gray-700">
                <strong>DPO:</strong> <a href="mailto:privacidade@consultaplacaveicular.com.br" className="text-blue-600 font-semibold hover:underline">privacidade@consultaplacaveicular.com.br</a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Consulta Placa Veicular</p>
          <div className="mt-4 space-x-6">
            <Link to="/termos-de-uso" className="text-gray-400 hover:text-white">Termos</Link>
            <Link to="/politica-de-privacidade" className="text-gray-400 hover:text-white">Privacidade</Link>
            <Link to="/lgpd" className="text-gray-400 hover:text-white">LGPD</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LGPDPage;

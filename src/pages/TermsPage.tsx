import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar para o início
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Termos de Uso</h1>
          
          <div className="prose prose-lg max-w-none">
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Bem-vindo à Consulta Placa Veicular! Ao acessar e utilizar nosso sistema, você concorda com os seguintes Termos de Uso. Caso não concorde com qualquer parte dos termos, pedimos que não utilize nossos serviços.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">2. Acesso ao Sistema</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                O sistema Consulta Placa Veicular oferece serviços de consulta de informações veiculares, como CRLV, consultas por placa, chassi, entre outros. O acesso a essas funcionalidades está sujeito a um cadastro prévio e ao pagamento de eventuais taxas conforme o tipo de serviço.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">3. Responsabilidade do Usuário</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                O usuário é responsável por fornecer informações corretas e atualizadas ao utilizar o sistema. O uso indevido de dados de terceiros para fins fraudulentos é estritamente proibido. A Consulta Placa Veicular não se responsabiliza por ações de terceiros que utilizem informações de maneira ilegal.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">4. Modificações e Cancelamentos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A Consulta Placa Veicular se reserva o direito de modificar, suspender ou cancelar serviços a qualquer momento, sem aviso prévio, sendo que o usuário será informado de eventuais alterações que impactem sua experiência no sistema.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">5. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A Consulta Placa Veicular não se responsabiliza por falhas nos sistemas de consulta que estão fora do seu controle, como falhas em APIs externas. Nosso objetivo é fornecer um serviço de qualidade, mas não podemos garantir 100% de precisão ou disponibilidade.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">6. Propriedade Intelectual</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Todos os direitos de propriedade intelectual sobre a Consulta Placa Veicular são de titularidade exclusiva da plataforma. O usuário não pode reproduzir, modificar ou distribuir qualquer parte do sistema sem autorização prévia.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">7. Proibição de Uso Indevido de Dados Pessoais</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                O usuário não deve utilizar os serviços para o tratamento de dados pessoais de terceiros sem a devida autorização legal e sem respeitar a Lei Geral de Proteção de Dados (LGPD). A Consulta Placa Veicular não se responsabiliza por qualquer uso ilícito desses dados.
              </p>
            </section>

            <div className="mt-12 p-6 bg-blue-50 border-l-4 border-blue-600 rounded-r-lg">
              <p className="text-gray-700">
                <strong>Última atualização:</strong> Janeiro de 2026
              </p>
              <p className="text-gray-700 mt-2">
                📩 <strong>Dúvidas?</strong> Entre em contato conosco pelo e-mail:{' '}
                <a href="mailto:contato@consultaplacaveicular.com.br" className="text-blue-600 font-semibold hover:underline">
                  contato@consultaplacaveicular.com.br
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Consulta Placa Veicular. Todos os direitos reservados.
          </p>
          <div className="mt-4 space-x-6">
            <Link to="/termos-de-uso" className="text-gray-400 hover:text-white">Termos de Uso</Link>
            <Link to="/politica-de-privacidade" className="text-gray-400 hover:text-white">Política de Privacidade</Link>
            <Link to="/lgpd" className="text-gray-400 hover:text-white">LGPD</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TermsPage;

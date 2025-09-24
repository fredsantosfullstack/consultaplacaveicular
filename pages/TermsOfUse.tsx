import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Book } from 'lucide-react';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
    <div className="space-y-2">{children}</div>
  </section>
);

const TermsOfUse: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <Book className="w-8 h-8 text-blue-500" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Termos de Uso e Política de Privacidade</h1>
        </div>
        <button onClick={() => navigate('/dashboard')} className="flex items-center space-x-2 text-blue-500 hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar</span>
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-8 text-gray-700">
        
        <Section title="1. Termos de Uso">
            <p>Bem-vindo à Golden Veicular! Ao acessar e utilizar nosso sistema, você concorda com os seguintes Termos de Uso. Caso não concorde com qualquer parte dos termos, pedimos que não utilize nossos serviços.</p>
            
            <h3 className="text-lg font-semibold text-gray-800 pt-2">1.1. Acesso ao Sistema</h3>
            <p>O sistema Golden Veicular oferece serviços de consulta de informações veiculares, como CRLV, consultas por placa, entre outros. O acesso a essas funcionalidades está sujeito a um cadastro prévio e ao pagamento de eventuais taxas conforme o tipo de serviço.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">1.2. Responsabilidade do Usuário</h3>
            <p>O usuário é responsável por fornecer informações corretas e atualizadas ao utilizar o sistema. O uso indevido de dados de terceiros para fins fraudulentos é estritamente proibido. A Golden Veicular não se responsabiliza por ações de terceiros que utilizem informações de maneira ilegal.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">1.3. Modificações e Cancelamentos</h3>
            <p>A Golden Veicular se reserva o direito de modificar, suspender ou cancelar serviços a qualquer momento, sem aviso prévio, sendo que o usuário será informado de eventuais alterações que impactem sua experiência no sistema.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">1.4. Limitação de Responsabilidade</h3>
            <p>A Golden Veicular não se responsabiliza por falhas nos sistemas de consulta que estão fora do seu controle, como falhas em APIs externas. Nosso objetivo é fornecer um serviço de qualidade, mas não podemos garantir 100% de precisão ou disponibilidade.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">1.5. Propriedade Intelectual</h3>
            <p>Todos os direitos de propriedade intelectual sobre a Golden Veicular são de titularidade exclusiva da plataforma. O usuário não pode reproduzir, modificar ou distribuir qualquer parte do sistema sem autorização prévia.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">1.6. Proibição de Uso Indevido de Dados Pessoais</h3>
            <p>O usuário não deve utilizar os serviços para o tratamento de dados pessoais de terceiros sem a devida autorização legal e sem respeitar a Lei Geral de Proteção de Dados (LGPD). A Golden Veicular não se responsabiliza por qualquer uso ilícito desses dados.</p>
        </Section>

        <Section title="2. Política de Privacidade">
            <h3 className="text-lg font-semibold text-gray-800 pt-2">2.1. Coleta de Informações</h3>
            <p>A Golden Veicular coleta informações fornecidas diretamente pelos usuários no momento do cadastro, como nome, e-mail, dados de pagamento e informações de uso do sistema. Também podemos coletar dados de navegação, como endereços IP e interações com a plataforma.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">2.2. Uso das Informações</h3>
            <p>As informações coletadas são utilizadas para fornecer nossos serviços, processar pagamentos, melhorar a experiência do usuário e enviar notificações sobre atualizações e novos serviços. Não compartilhamos informações pessoais com terceiros sem o consentimento do usuário, exceto quando exigido por lei ou para cumprir com nossas obrigações contratuais.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">2.3. Proteção de Dados</h3>
            <p>A Golden Veicular adota medidas técnicas e administrativas para proteger as informações dos usuários contra acesso não autorizado, perda ou alteração. No entanto, nenhuma plataforma é completamente segura, e não podemos garantir a segurança total dos dados.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">2.4. Compartilhamento de Informações</h3>
            <p>O sistema pode compartilhar dados com terceiros para fins específicos, como processamento de pagamentos ou integração com APIs externas, mas esses parceiros são obrigados a seguir os padrões de segurança e privacidade da Golden Veicular.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">2.5. Direitos do Usuário</h3>
            <p>O usuário pode a qualquer momento acessar, corrigir ou excluir suas informações pessoais na plataforma. Além disso, pode solicitar a exclusão de sua conta, o que será realizado de acordo com as políticas de retenção de dados.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">2.6. Alterações na Política de Privacidade</h3>
            <p>Esta Política de Privacidade pode ser alterada a qualquer momento, e os usuários serão notificados sobre modificações importantes. Recomendamos que você consulte periodicamente nossa política para estar ciente de como protegemos suas informações.</p>

            <h3 className="text-lg font-semibold text-gray-800 pt-2">2.7. Dados de Pesquisa</h3>
            <p>Em caso de pesquisas que envolvam dados pessoais, a Golden Veicular não realiza o tratamento de dados pessoais, não armazenando nem acessando os dados pessoais da pesquisa. O usuário deve garantir que sua pesquisa seja realizada de acordo com as hipóteses legais previstas na LGPD.</p>
        </Section>
        
        <p className="pt-4">📩 Se você tiver dúvidas, entre em contato conosco pelo e-mail: contato@goldenveicular.com.br</p>
      </div>
    </div>
  );
};

export default TermsOfUse;
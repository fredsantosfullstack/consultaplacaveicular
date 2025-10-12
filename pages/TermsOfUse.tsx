import React, { useState, useEffect } from 'react';
import { FileText, Loader2, AlertCircle } from 'lucide-react';
import api from '../src/services/api';

interface TermsData {
  id: number;
  title: string;
  content: string;
  version: string;
  created_at: string;
  updated_at: string;
}

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mb-6">
    <h2 className="text-xl font-bold text-[#000042] mb-3 pb-2 border-b-2 border-[#D2AE6D]">
      {title}
    </h2>
    <div className="space-y-3 text-gray-700 leading-relaxed">
      {children}
    </div>
  </div>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="ml-4 mb-4">
    <h3 className="text-base font-semibold text-gray-800 mb-2">
      {title}
    </h3>
    <p className="text-gray-700 leading-relaxed">
      {children}
    </p>
  </div>
);

const TermsOfUse: React.FC = () => {
  const [terms, setTerms] = useState<TermsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/terms/active');
      setTerms(response.data);
    } catch (error: any) {
      console.error('Erro ao buscar termos:', error);
      setError(error.response?.data?.msg || 'Erro ao carregar termos de uso.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (!terms) return null;

    return (
      <>
        <Section title="1. Termos de Uso">
          <p className="mb-4">
            Bem-vindo à Golden Veicular! Ao acessar e utilizar nosso sistema, você concorda com os seguintes Termos de Uso. Caso não concorde com qualquer parte dos termos, pedimos que não utilize nossos serviços.
          </p>

          <SubSection title="1.1. Acesso ao Sistema">
            O sistema Golden Veicular oferece serviços de consulta de informações veiculares, como CRLV, consultas por placa, entre outros. O acesso a essas funcionalidades está sujeito a um cadastro prévio e ao pagamento de eventuais taxas conforme o tipo de serviço.
          </SubSection>

          <SubSection title="1.2. Responsabilidade do Usuário">
            O usuário é responsável por fornecer informações corretas e atualizadas ao utilizar o sistema. O uso indevido de dados de terceiros para fins fraudulentos é estritamente proibido. A Golden Veicular não se responsabiliza por ações de terceiros que utilizem informações de maneira ilegal.
          </SubSection>

          <SubSection title="1.3. Modificações e Cancelamentos">
            A Golden Veicular se reserva o direito de modificar, suspender ou cancelar serviços a qualquer momento, sem aviso prévio, sendo que o usuário será informado de eventuais alterações que impactem sua experiência no sistema.
          </SubSection>

          <SubSection title="1.4. Limitação de Responsabilidade">
            A Golden Veicular não se responsabiliza por falhas nos sistemas de consulta que estão fora do seu controle, como falhas em APIs externas. Nosso objetivo é fornecer um serviço de qualidade, mas não podemos garantir 100% de precisão ou disponibilidade.
          </SubSection>

          <SubSection title="1.5. Propriedade Intelectual">
            Todos os direitos de propriedade intelectual sobre a Golden Veicular são de titularidade exclusiva da plataforma. O usuário não pode reproduzir, modificar ou distribuir qualquer parte do sistema sem autorização prévia.
          </SubSection>

          <SubSection title="1.6. Proibição de Uso Indevido de Dados Pessoais">
            O usuário não deve utilizar os serviços para o tratamento de dados pessoais de terceiros sem a devida autorização legal e sem respeitar a Lei Geral de Proteção de Dados (LGPD). A Golden Veicular não se responsabiliza por qualquer uso ilícito desses dados.
          </SubSection>
        </Section>

        <Section title="2. Política de Privacidade">
          <SubSection title="2.1. Coleta de Informações">
            A Golden Veicular coleta informações fornecidas diretamente pelos usuários no momento do cadastro, como nome, e-mail, dados de pagamento e informações de uso do sistema. Também podemos coletar dados de navegação, como endereços IP e interações com a plataforma.
          </SubSection>

          <SubSection title="2.2. Uso das Informações">
            As informações coletadas são utilizadas para fornecer nossos serviços, processar pagamentos, melhorar a experiência do usuário e enviar notificações sobre atualizações e novos serviços. Não compartilhamos informações pessoais com terceiros sem o consentimento do usuário, exceto quando exigido por lei ou para cumprir com nossas obrigações contratuais.
          </SubSection>

          <SubSection title="2.3. Proteção de Dados">
            A Golden Veicular adota medidas técnicas e administrativas para proteger as informações dos usuários contra acesso não autorizado, perda ou alteração. No entanto, nenhuma plataforma é completamente segura, e não podemos garantir a segurança total dos dados.
          </SubSection>

          <SubSection title="2.4. Compartilhamento de Informações">
            O sistema pode compartilhar dados com terceiros para fins específicos, como processamento de pagamentos ou integração com APIs externas, mas esses parceiros são obrigados a seguir os padrões de segurança e privacidade da Golden Veicular.
          </SubSection>

          <SubSection title="2.5. Direitos do Usuário">
            O usuário pode a qualquer momento acessar, corrigir ou excluir suas informações pessoais na plataforma. Além disso, pode solicitar a exclusão de sua conta, o que será realizado de acordo com as políticas de retenção de dados.
          </SubSection>

          <SubSection title="2.6. Alterações na Política de Privacidade">
            Esta Política de Privacidade pode ser alterada a qualquer momento, e os usuários serão notificados sobre modificações importantes. Recomendamos que você consulte periodicamente nossa política para estar ciente de como protegemos suas informações.
          </SubSection>

          <SubSection title="2.7. Dados de Pesquisa">
            Em caso de pesquisas que envolvam dados pessoais, a Golden Veicular não realiza o tratamento de dados pessoais, não armazenando nem acessando os dados pessoais da pesquisa. O usuário deve garantir que sua pesquisa seja realizada de acordo com as hipóteses legais previstas na LGPD.
          </SubSection>
        </Section>

        <div className="mt-8 p-4 bg-blue-50 border-l-4 border-[#000042] rounded-r-lg">
          <p className="text-sm text-gray-700">
            📩 <strong>Dúvidas?</strong> Entre em contato conosco pelo e-mail:{' '}
            <a href="mailto:contato@goldenveicular.com.br" className="text-[#000042] font-semibold hover:underline">
              contato@goldenveicular.com.br
            </a>
          </p>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center space-x-4">
          <div className="bg-[#000042] p-3 rounded-lg">
            <FileText className="w-8 h-8 text-[#D2AE6D]" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Termos de Uso e Política de Privacidade
            </h1>
            {terms && (
              <p className="text-sm text-gray-500 mt-1">
                Versão {terms.version} | Última atualização:{' '}
                {new Date(terms.updated_at).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {isLoading ? (
          <div className="flex flex-col justify-center items-center p-16">
            <Loader2 className="animate-spin text-[#000042] mb-4" size={48} />
            <p className="text-gray-600">Carregando termos de uso...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center p-16 text-center">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <AlertCircle className="text-red-600" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Erro ao Carregar</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <p className="text-gray-600 mb-6">
              Por favor, tente novamente mais tarde ou entre em contato com o suporte.
            </p>
            <a 
              href="mailto:contato@goldenveicular.com.br"
              className="bg-[#000042] text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-all font-semibold"
            >
              Entrar em Contato
            </a>
          </div>
        ) : terms ? (
          renderContent()
        ) : (
          <div className="text-center p-16">
            <div className="bg-gray-100 p-4 rounded-full inline-block mb-4">
              <FileText className="text-gray-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Nenhum Termo Disponível</h3>
            <p className="text-gray-600 mb-6">
              Os termos de uso ainda não foram configurados.
            </p>
            <p className="text-sm text-gray-500">
              📩 Dúvidas? Entre em contato:{' '}
              <a href="mailto:contato@goldenveicular.com.br" className="text-[#000042] hover:underline font-semibold">
                contato@goldenveicular.com.br
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TermsOfUse;
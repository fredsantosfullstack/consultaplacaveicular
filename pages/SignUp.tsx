import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, FileText, Phone, CheckCircle, ArrowLeft, Info, X } from 'lucide-react';
import api from '../src/services/api';

const InputField = ({ icon: Icon, type, ...props }) => (
  <div className="relative">
    {Icon && (
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
        <Icon className="h-5 w-5 text-gray-400" />
      </div>
    )}
    <input
      {...props}
      type={type}
      autoComplete={type === 'password' ? 'new-password' : undefined}
      className={`w-full p-3 ${Icon ? 'pl-12' : 'pl-4'} border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 transition-all duration-300 ${
        type === 'password'
          ? '[&::-ms-reveal]:hidden [&::-ms-clear]:hidden [&::-webkit-credentials-auto-fill-button]:hidden [&::-webkit-contacts-auto-fill-button]:hidden'
          : ''
      }`}
    />
  </div>
);

const TermsAndPrivacy = () => (
  <div className="space-y-6 text-sm leading-relaxed text-gray-700">
    <section>
      <h3 className="text-lg font-semibold text-gray-900">1. Termos de Uso</h3>
      <p>
        Bem-vindo a Consulta Placa Veicular. Ao criar sua conta e usar nossos recursos, voce concorda com os termos
        abaixo. Caso nao concorde, interrompa o cadastro e fale conosco.
      </p>

      <p className="mt-4 font-semibold text-gray-900">1.1. Acesso ao sistema</p>
      <p>Nossa plataforma disponibiliza consultas e relatorios como:</p>
      <ul className="ml-6 list-disc space-y-1">
        <li>CRLV Digital, CRV e outros documentos oficiais</li>
        <li>Consultas por placa ou chassi em bases estaduais e nacionais</li>
        <li>Consulta cautelar, gravame, historico de leilao e Renajud</li>
        <li>Comunicacao de venda, SPC/CRED MAX e indicadores antifraude</li>
      </ul>
      <p className="mt-2">O acesso depende de cadastro aprovado e pagamento conforme a tabela vigente.</p>

      <p className="mt-4 font-semibold text-gray-900">1.2. Planos de pagamento</p>
      <p className="font-medium text-gray-800">Plano pre-pago</p>
      <ul className="ml-6 list-disc space-y-1">
        <li>Recarga antecipada de creditos com descontos progressivos</li>
        <li>Saldo liberado apos confirmacao do pagamento</li>
        <li>Consultas debitadas do saldo disponivel</li>
      </ul>
      <p className="mt-2 font-medium text-gray-800">Plano pos-pago</p>
      <ul className="ml-6 list-disc space-y-1">
        <li>Uso com faturamento mensal e limite definido por analise</li>
        <li>Bloqueio automatico em caso de inadimplencia</li>
      </ul>
      <p className="mt-2 text-gray-600">
        Em ambos os planos aplicamos a tabela atualizada, nao ha estorno de consultas executadas e qualquer migracao
        depende de avaliacao.
      </p>

      <p className="mt-4 font-semibold text-gray-900">1.3. Responsabilidades</p>
      <p>
        Voce deve fornecer informacoes verdadeiras, usar o sistema apenas para fins legitimos e manter sigilo das
        informacoes obtidas. E proibido revender relatorios, consultar dados de terceiros sem autorizacao ou utilizar os
        dados para finalidades ilegais.
      </p>

      <p className="mt-4 font-semibold text-gray-900">1.4. Modificacoes e cancelamentos</p>
      <p>
        Podemos ajustar, suspender ou cancelar recursos para garantir seguranca e disponibilidade, comunicando
        alteracoes relevantes sempre que possivel.
      </p>

      <p className="mt-4 font-semibold text-gray-900">1.5. Limitacao de responsabilidade</p>
      <p>
        Atuamos como intermediadores de dados de parceiros. Nao garantimos atualizacao em tempo real nem nos
        responsabilizamos por decisoes baseadas nas consultas. Valide informacoes oficialmente antes de transacoes
        criticas.
      </p>

      <p className="mt-4 font-semibold text-gray-900">1.6. Propriedade intelectual</p>
      <p>
        Todo o conteudo da Consulta Placa Veicular pertence exclusivamente a plataforma. E proibida a reproducao sem
        autorizacao.
      </p>

      <p className="mt-4 font-semibold text-gray-900">1.7. Uso de dados pessoais</p>
      <p>
        Tratamos dados com base em consentimento, execucao contratual, obrigacao legal e interesse legitimo para
        prevencao de fraudes. Voce pode solicitar acesso, correcao, portabilidade ou revogacao do consentimento a
        qualquer momento. O uso indevido de dados de terceiros e de responsabilidade do usuario.
      </p>
    </section>

    <section>
      <h3 className="text-lg font-semibold text-gray-900">2. Politica de Privacidade</h3>
      <p className="mt-2 font-semibold text-gray-900">2.1. Coleta</p>
      <p>
        Coletamos dados fornecidos no cadastro, informacoes de uso, historico de consultas, dados de pagamento e registros
        de suporte.
      </p>

      <p className="mt-4 font-semibold text-gray-900">2.2. Uso</p>
      <p>
        Utilizamos os dados para prestar os servicos, processar cobrancas, aprimorar a experiencia e enviar comunicados
        operacionais. Compartilhamos informacoes apenas com parceiros essenciais (consultas, meios de pagamento,
        antifraude) ou quando exigido por lei.
      </p>

      <p className="mt-4 font-semibold text-gray-900">2.3. Protecao e compartilhamento</p>
      <p>
        Adotamos controles tecnicos e administrativos para proteger os dados, embora nenhuma plataforma seja totalmente
        imune a incidentes. Incentivamos boas praticas de seguranca por parte dos usuarios.
      </p>

      <p className="mt-4 font-semibold text-gray-900">2.4. Retencao</p>
      <ul className="ml-6 list-disc space-y-1">
        <li>Dados de cadastro: enquanto a conta estiver ativa</li>
        <li>Historico de consultas e dados financeiros: 5 anos</li>
        <li>Logs de acesso: 6 meses para fins de seguranca</li>
      </ul>

      <p className="mt-4 font-semibold text-gray-900">2.5. Direitos do usuario</p>
      <p>
        Voce pode solicitar acesso, correcao, exclusao ou portabilidade, alem de revogar consentimento. Duvidas podem
        ser enviadas para <a href="mailto:contato@consultaplacaveicular.com.br" className="font-semibold text-[#076AC2]">contato@consultaplacaveicular.com.br</a>.
      </p>

      <p className="mt-4 font-semibold text-gray-900">2.6. Atualizacoes</p>
      <p>
        Ajustes podem ocorrer para refletir mudancas legais ou de produto. Comunicaremos alteracoes relevantes e manteremos
        a versao mais recente publicada no site.
      </p>
    </section>

    <p className="text-xs text-gray-500">
      IMPORTANTE: Ao continuar voce declara que leu e concorda com os Termos de Uso e a Politica de Privacidade.
      Ultima atualizacao: Dezembro/2024.
    </p>
  </div>
);

const SignUp: React.FC = () => {
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [modalError, setModalError] = useState('');

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setModalError('');

    if (password !== confirmPassword) {
      setError('As senhas nao coincidem.');
      return;
    }

    setShowTermsModal(true);
  };

  const handleCancelTerms = () => {
    if (isLoading) return;
    setShowTermsModal(false);
    setAcceptTerms(false);
    setModalError('');
  };

  const handleConfirmTerms = async () => {
    if (!acceptTerms) {
      setModalError('Confirme a leitura e aceite os termos para continuar.');
      return;
    }

    setIsLoading(true);
    setModalError('');

    try {
      await api.post('/auth/register', {
        name,
        email,
        password,
        documentType,
        documentNumber,
        phone
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.responsei.datai.msg || 'Erro ao criar conta.');
    } finally {
      setIsLoading(false);
      setShowTermsModal(false);
      setAcceptTerms(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Conta criada com sucesso!</h2>
          <p className="text-gray-600 mb-6">Voce ja pode fazer login na plataforma.</p>
          <Link
            to="/login"
            className="w-full flex items-center justify-center gap-2 bg-[#076AC2] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#055a9f] transition-all transform hover:-translate-y-0.5"
          >
            <ArrowLeft size={16} />
            <span>Ir para o login</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Crie sua conta</h1>
          <p className="text-gray-500">Rapido e facil: preencha os dados para comecar.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-5">
          {error && <p className="bg-red-100 text-red-700 p-3 rounded-lg text-sm text-center font-medium">{error}</p>}

          <InputField icon={User} type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nome completo" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:border-[#076AC2] focus:outline-none focus:ring-2 focus:ring-[#076AC2]/30 appearance-none"
              >
                <option value="cpf">Pessoa fisica (CPF)</option>
                <option value="cnpj">Pessoa juridica (CNPJ)</option>
              </select>
            </div>
            <InputField
              icon={FileText}
              type="text"
              value={documentNumber}
              onChange={(e) => setDocumentNumber(e.target.value)}
              required
              placeholder={`Numero do ${documentType.toUpperCase()}`}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={Mail} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="Seu melhor e-mail" />
            <InputField icon={Phone} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required placeholder="(XX) XXXXX-XXXX" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField icon={Lock} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} placeholder="Senha (min. 6 digitos)" />
            <InputField icon={Lock} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} placeholder="Confirmar senha" />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-base font-bold text-white bg-[#076AC2] hover:bg-[#055a9f] disabled:bg-opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#076AC2]"
            >
              {isLoading ? 'Criando conta...' : 'Cadastrar'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>
            Ja tem uma conta?{' '}
            <Link to="/login" className="font-bold text-[#076AC2] hover:text-[#00A788] hover:underline">
              Faca login
            </Link>
          </p>
        </div>
      </div>

      {showTermsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="w-full max-w-3xl bg-white rounded-2xl shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8F2FF]">
                  <Info className="h-6 w-6 text-[#076AC2]" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Termos de Uso e Politica de Privacidade</p>
                  <p className="text-xs text-gray-500">Leia atentamente antes de concluir seu cadastro.</p>
                </div>
              </div>
              <button onClick={handleCancelTerms} className="text-gray-500 hover:text-gray-700" type="button">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              <TermsAndPrivacy />
            </div>

            <div className="border-t px-6 py-4 space-y-4">
              {modalError && <p className="text-sm text-red-600 font-medium">{modalError}</p>}
              <label className="flex items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-[#076AC2] focus:ring-[#076AC2]"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                <span>
                  Li e aceito os <strong>Termos de Uso</strong> e a <strong>Politica de Privacidade</strong> da Consulta Placa Veicular.
                </span>
              </label>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={handleCancelTerms}
                  disabled={isLoading}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 disabled:opacity-60"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmTerms}
                  disabled={!acceptTerms || isLoading}
                  className="px-5 py-2.5 rounded-lg bg-[#076AC2] text-white font-semibold shadow hover:bg-[#055a9f] disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Finalizando...' : 'Aceitar e cadastrar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;

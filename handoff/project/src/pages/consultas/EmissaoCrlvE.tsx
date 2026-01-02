import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, AlertCircle, Info, Loader2, X } from 'lucide-react';
import api from '../../services/api';

interface State {
  state_code: string;
  state_name: string;
  price: number;
}

interface Settings {
  title: string;
  description: string;
  warning_text: string;
  delivery_text: string;
  modal_title: string;
  modal_text: string;
  is_active: boolean;
}

export default function EmissaoCrlvE() {
  const navigate = useNavigate();
  const [states, setStates] = useState<State[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form data
  const [placa, setPlaca] = useState('');
  const [renavam, setRenavam] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [selectedUf, setSelectedUf] = useState('');
  
  // Modals
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statesRes, settingsRes] = await Promise.all([
        api.get('/crlve-orders/states'),
        api.get('/crlve-orders/settings')
      ]);
      setStates(statesRes.data);
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setErrorMessage('Erro ao carregar a página. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const selectedState = states.find(s => s.state_code === selectedUf);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setShowConfirmModal(false);

    try {
      await api.post('/crlve-orders/create', {
        placa: placa.toUpperCase(),
        renavam,
        cpf_cnpj: cpfCnpj,
        uf: selectedUf
      });

      setShowSuccessModal(true);
      // Limpar formulário
      setPlaca('');
      setRenavam('');
      setCpfCnpj('');
      setSelectedUf('');
    } catch (error: any) {
      setErrorMessage(error.response?.data?.msg || 'Erro ao criar pedido.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#000042]" />
      </div>
    );
  }

  if (!settings?.is_active) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-center mb-2">Serviço Temporariamente Indisponível</h2>
          <p className="text-gray-600 text-center">
            Este serviço está temporariamente desativado. Por favor, tente novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#000042] text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3">
            <Car className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">{settings?.title}</h1>
              <p className="text-gray-300 text-sm mt-1">{settings?.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Aviso */}
          {settings?.warning_text && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-6 rounded-r-lg">
              <div className="flex items-start">
                <AlertCircle className="w-6 h-6 text-blue-500 mr-3 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-lg font-bold text-blue-900 mb-3">Atenção:</h3>
                  <div className="text-sm text-gray-700 whitespace-pre-line">
                    {settings.warning_text}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Erro */}
          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Placa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Placa do Veículo: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                placeholder="ABC1234"
                required
                maxLength={7}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
              />
            </div>

            {/* Renavam */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Renavam: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={renavam}
                onChange={(e) => setRenavam(e.target.value)}
                placeholder="12345678901"
                required
                maxLength={11}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
              />
            </div>

            {/* CPF/CNPJ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documento CPF ou CNPJ: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={cpfCnpj}
                onChange={(e) => setCpfCnpj(e.target.value)}
                placeholder="000.000.000-00"
                required
                maxLength={18}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
              />
            </div>

            {/* UF (Estado) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                UF (Estado): <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedUf}
                onChange={(e) => setSelectedUf(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
              >
                <option value="">Selecione o Estado</option>
                {states.map((state) => (
                  <option key={state.state_code} value={state.state_code}>
                    {state.state_name} R$ {parseFloat(state.price).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>

            {/* Prazo de Entrega */}
            {selectedUf && settings?.delivery_text && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium">
                  {settings.delivery_text}
                </p>
              </div>
            )}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : (
                  'Solicitar CRLV-e'
                )}
              </button>
              <button
                type="button"
                onClick={() => window.history.back()}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                Voltar
              </button>
            </div>
          </form>

          {/* Botão Ver Meus Pedidos */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/meus-pedidos')}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center justify-center gap-2 mx-auto"
            >
              📋 Ver Meus Pedidos
            </button>
          </div>
        </div>
      </div>

      {/* Modal de Confirmação */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Info className="w-8 h-8 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                {settings?.modal_title || 'Confirmar Solicitação'}
              </h2>
              <p className="text-gray-600 mb-6">
                {settings?.modal_text}
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Deseja continuar com a solicitação?
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={handleConfirm}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sim, continuar
                </button>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Pedido Enviado com Sucesso!
              </h2>
              <p className="text-gray-600 mb-6">
                Seu pedido foi recebido e está sendo processado. Você pode acompanhar o status em "Meus Pedidos".
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => navigate('/meus-pedidos')}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Ver Meus Pedidos
                </button>
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

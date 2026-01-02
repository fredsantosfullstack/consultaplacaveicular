import React, { useState, useEffect } from 'react';
import { QrCode, Loader2, AlertTriangle, Star, Copy, CheckCircle, XCircle } from 'lucide-react';
import api from '../src/services/api';
import { useAuth } from '../src/contexts/AuthContext';

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  credits: number;
  is_popular: boolean;
}

interface PaymentData {
  transactionId: string;
  qrCode: string;
  payload: string;
  amount: number;
  credits: number;
  expiresAt: string;
}

const CreditRecharge: React.FC = () => {
    const { profile, refreshProfile } = useAuth();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStatus, setPaymentStatus] = useState<'pending' | 'confirmed' | 'error'>('pending');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            setIsLoading(true);
            try {
                const response = await api.get('/recharge-plans');
                setPlans(response.data);
                console.log('Dados recebidos da API:', response.data);
                // Pré-seleciona o plano popular
                const popularPlan = response.data.find(p => p.is_popular);
                if (popularPlan) setSelectedPlan(popularPlan);

            } catch (err) {
                setError('Não foi possível carregar as opções de recarga.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handlePlanClick = (plan: Plan) => {
        setSelectedPlan(plan);
        setPaymentData(null);
        setPaymentStatus('pending');
    };

    const handleGeneratePayment = async () => {
        if (!selectedPlan) return;

        setIsProcessing(true);
        setError(null);

        try {
            const response = await api.post('/payments/create-charge', {
                planId: selectedPlan.id
            });

            setPaymentData(response.data);
            setPaymentStatus('pending');
            
            // Iniciar polling para verificar status
            startPaymentPolling(response.data.transactionId);

        } catch (err: any) {
            setError(err.response?.data?.msg || 'Erro ao gerar pagamento. Tente novamente.');
            setPaymentStatus('error');
        } finally {
            setIsProcessing(false);
        }
    };

    const startPaymentPolling = (transactionId: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await api.get(`/payments/status/${transactionId}`);
                
                if (response.data.status === 'confirmed') {
                    setPaymentStatus('confirmed');
                    clearInterval(interval);
                    
                    // Atualizar saldo do usuário - forçar atualização
                    console.log('💰 Atualizando saldo do usuário...');
                    await refreshProfile();
                    console.log('✅ Saldo atualizado!');
                    
                    // Resetar após 3 segundos
                    setTimeout(() => {
                        setPaymentData(null);
                        setSelectedPlan(null);
                        setPaymentStatus('pending');
                    }, 3000);
                }
            } catch (error) {
                console.error('Erro ao verificar status:', error);
            }
        }, 5000); // Verifica a cada 5 segundos

        // Limpar após 30 minutos
        setTimeout(() => clearInterval(interval), 30 * 60 * 1000);
    };

    const copyToClipboard = () => {
        if (paymentData?.payload) {
            navigator.clipboard.writeText(paymentData.payload);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };
    
    return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold text-gray-800">Recarga de Créditos</h1>

      <div className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-lg space-y-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">Escolha o Valor da Recarga</h2>
          <p className="text-gray-600 mt-2">Selecione um dos valores abaixo para gerar seu QR Code Pix.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-10"><Loader2 className="animate-spin text-[#000042]" size={48} /></div>
        ) : error ? (
          <div className="text-center text-red-500 p-10">{error}</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map(plan => (
              <div 
                key={plan.id} 
                onClick={() => handlePlanClick(plan)}
                className={`relative border-2 rounded-xl text-center cursor-pointer transition-all duration-300 overflow-hidden ${selectedPlan?.id === plan.id ? 'border-[#000042] bg-blue-50 scale-105 shadow-lg' : 'border-gray-200 bg-white hover:border-gray-300'}`}>

                {Boolean(plan.is_popular) && (
                  <div className="absolute top-2.5 -right-9 bg-yellow-400 text-black text-[10px] font-bold px-8 py-0.5 transform rotate-45 z-10">
                    <span>POPULAR</span>
                  </div>
                )}
                
                <div className="p-6">
                  <p className="text-4xl font-extrabold text-[#000042]">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}</p>
                  <p className="text-sm font-normal text-green-600 mt-2">e receba {plan.credits} créditos</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!paymentData ? (
          <div className="pt-4">
            <button 
              onClick={handleGeneratePayment}
              className="w-full flex items-center justify-center gap-2 bg-[#000042] text-white text-base font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-gray-400 disabled:cursor-not-allowed" 
              disabled={!selectedPlan || isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Gerando QR Code...</span>
                </>
              ) : (
                <>
                  <QrCode className="w-5 h-5" />
                  <span>Pagar {selectedPlan ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedPlan.price) : ''} com Pix</span>
                </>
              )}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {paymentStatus === 'confirmed' ? (
              <div className="bg-green-50 border-2 border-green-500 rounded-xl p-6 text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-700 mb-2">Pagamento Confirmado!</h3>
                <p className="text-green-600">Seus créditos foram adicionados com sucesso.</p>
                <p className="text-sm text-gray-600 mt-2">Novo saldo: R$ {profile?.balance ? Number(profile.balance).toFixed(2) : '0.00'}</p>
              </div>
            ) : paymentStatus === 'error' ? (
              <div className="bg-red-50 border-2 border-red-500 rounded-xl p-6 text-center">
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-red-700 mb-2">Erro no Pagamento</h3>
                <p className="text-red-600">{error}</p>
              </div>
            ) : (
              <>
                <div className="bg-blue-50 border-2 border-blue-500 rounded-xl p-6">
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                    <h3 className="text-xl font-bold text-blue-700">Aguardando Pagamento...</h3>
                  </div>
                  <p className="text-center text-blue-600 text-sm">Escaneie o QR Code ou copie o código PIX</p>
                </div>

                <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center">
                  <h3 className="text-lg font-bold text-gray-800 mb-4">QR Code PIX</h3>
                  <div className="flex justify-center mb-4">
                    <img 
                      src={`data:image/png;base64,${paymentData.qrCode}`} 
                      alt="QR Code PIX" 
                      className="w-64 h-64 border-4 border-gray-300 rounded-lg"
                    />
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-600 mb-2">Código PIX (Copia e Cola):</p>
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        value={paymentData.payload} 
                        readOnly 
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-xs font-mono"
                      />
                      <button 
                        onClick={copyToClipboard}
                        className="bg-[#000042] text-white px-4 py-2 rounded hover:bg-opacity-90 flex items-center gap-2"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? 'Copiado!' : 'Copiar'}
                      </button>
                    </div>
                  </div>

                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Valor:</strong> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(paymentData.amount)}</p>
                    <p><strong>Créditos:</strong> {paymentData.credits}</p>
                    <p className="text-xs text-gray-500 mt-2">O pagamento será confirmado automaticamente</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setPaymentData(null);
                    setSelectedPlan(null);
                  }}
                  className="w-full bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreditRecharge;
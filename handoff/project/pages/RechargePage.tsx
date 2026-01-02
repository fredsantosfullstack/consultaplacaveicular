import React, { useState, useEffect } from 'react';
import api from '../src/services/api';
import { Loader2, Star, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Plan {
  id: number;
  name: string;
  description?: string;
  price: number;
  credits: number;
  is_popular: boolean;
}

const RechargePage: React.FC = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);
  const [pixData, setPixData] = useState<{ payload: string; qrCode: string; value: number } | null>(null);
  const navigate = useNavigate();

  const handlePurchase = async (planId: number) => {
    setIsProcessing(planId);
    try {
      const response = await api.post('/payments/create-charge', { planId });
      const { payload, qrCode, value } = response.data;
      setPixData({ payload, qrCode, value, paymentId: response.data.paymentId });
    } catch (error) {
      console.error('Erro ao iniciar compra', error);
      alert('Ocorreu um erro ao processar seu pedido.');
    } finally {
      setIsProcessing(null);
    }
  };

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await api.get('/recharge-plans');
        setPlans(response.data);
      } catch (error) {
        console.error('Falha ao buscar planos', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPlans();
  }, []);

    useEffect(() => {
    if (!pixData?.paymentId) return;

    const interval = setInterval(async () => {
      try {
        const response = await api.get(`/payments/status/${pixData.paymentId}`);
        if (response.data.status === 'CONFIRMED' || response.data.status === 'RECEIVED') {
          clearInterval(interval);
          setPixData(prev => prev ? { ...prev, status: 'PAID' } : null);
          setTimeout(() => navigate('/dashboard'), 3000); // Redireciona após 3s
        }
      } catch (error) {
        console.error('Erro ao verificar status do pagamento', error);
      }
    }, 3000); // Verifica a cada 3 segundos

    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, [pixData?.paymentId, navigate]);

  if (isLoading) {
    return <div className="flex justify-center p-10"><Loader2 className="animate-spin" size={48} /></div>;
  }

  if (pixData) {
    return <PixPaymentScreen data={pixData} />;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Recarga de Créditos</h1>
        <p className="text-gray-500 mt-2">Escolha um de nossos planos e continue consultando.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-white rounded-lg shadow-lg p-6 flex flex-col text-center transition-transform transform hover:-translate-y-2 ${plan.is_popular ? 'border-4 border-[#000042]' : 'border-4 border-transparent'}`}>
            {plan.is_popular && <div className="absolute top-0 -right-2 bg-[#000042] text-white text-xs font-bold px-3 py-1 rounded-full transform rotate-12">POPULAR</div>}
            <h2 className="text-2xl font-bold text-gray-800">{plan.name}</h2>
            <p className="text-5xl font-extrabold text-[#000042] my-4">{plan.credits}<span className="text-xl font-medium"> créditos</span></p>
            <p className="text-gray-500 mb-6 h-10">{plan.description}</p>
            <div className="mt-auto">
              <p className="text-lg font-semibold text-gray-600 mb-4">Por apenas <span className="text-2xl text-black">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}</span></p>
              <button 
                onClick={() => handlePurchase(plan.id)}
                disabled={isProcessing === plan.id}
                className="w-full bg-[#000042] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 flex justify-center items-center disabled:bg-gray-400"
              >
                {isProcessing === plan.id ? <Loader2 className="animate-spin" /> : 'Comprar Agora'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PixPaymentScreen = ({ data }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.payload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (data.status === 'PAID') {
    return (
      <div className="text-center p-10">
        <CheckCircle className="mx-auto text-green-500" size={64} />
        <h2 className="text-2xl font-bold mt-4">Pagamento Confirmado!</h2>
        <p className="text-gray-600">Seus créditos foram adicionados. Redirecionando...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-md max-w-lg mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Pagamento PIX</h2>
        <p className="text-gray-600 mb-6">Pague para liberar seus créditos.</p>
        
        <div className="mb-4">
          <img src={`data:image/png;base64,${data.qrCode}`} alt="QR Code PIX" className="mx-auto rounded-md border-2 border-gray-300" />
        </div>

        <p className="text-gray-500 text-sm">Ou copie o código abaixo:</p>
        <textarea 
          readOnly
          className="w-full bg-gray-100 p-2 rounded-md text-xs text-gray-700 break-all my-2 h-24 resize-none"
          value={data.payload}
        />

        <button 
          onClick={handleCopy}
          className={`w-full font-bold py-3 rounded-lg transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-[#000042] text-white hover:bg-opacity-90'}`}
        >
          {copied ? 'Copiado!' : 'Copiar Chave Pix'}
        </button>

        <p className="text-sm text-gray-500 mt-4">Após o pagamento, aguarde a confirmação.</p>
      </div>
    </div>
  );
};

export default RechargePage;

import { useState, useEffect, ReactNode } from 'react';
import { Loader2, Download } from 'lucide-react';
import api from '../services/api';
import ModalSucesso from './ModalSucesso';
import ModalErro from './ModalErro';
import ModalSaldoInsuficiente from './ModalSaldoInsuficiente';
import PDFViewer from './PDFViewer';

interface ConsultaFormProps {
  titulo: string;
  descricao: string;
  preco?: number; // Agora é opcional, será buscado do banco
  slug: string;
  campos: CampoFormulario[];
  icon?: ReactNode;
  avisoPersonalizado?: ReactNode;
  textoBotao?: string;
}

interface CampoFormulario {
  name: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  maxLength?: number;
}

export default function ConsultaForm({ 
  titulo, 
  descricao, 
  preco: precoInicial, 
  slug, 
  campos,
  icon,
  avisoPersonalizado,
  textoBotao = 'Consultar'
}: ConsultaFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [preco, setPreco] = useState<number>(precoInicial || 0);
  const [loadingPreco, setLoadingPreco] = useState(!precoInicial);
  
  // Modals
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [modalSaldo, setModalSaldo] = useState(false);
  const [modalPDF, setModalPDF] = useState(false);
  
  // Estados
  const [mensagemErro, setMensagemErro] = useState('');
  const [saldoAtual, setSaldoAtual] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  // Buscar preço do banco de dados se não foi fornecido
  useEffect(() => {
    if (!precoInicial) {
      const fetchPreco = async () => {
        try {
          const response = await api.get(`/consultations/details/${slug}`);
          setPreco(parseFloat(response.data.price));
        } catch (error) {
          console.error('Erro ao buscar preço:', error);
          setPreco(0);
        } finally {
          setLoadingPreco(false);
        }
      };
      fetchPreco();
    }
  }, [slug, precoInicial]);

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post(`/consultations/execute/${slug}`, formData, {
        responseType: 'blob',
        timeout: 60000 // 60 segundos
      });

      // Sucesso - criar URL do PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfFileName(`${slug}-${formData.placa || 'consulta'}.pdf`);
      
      // Limpar campos do formulário
      const clearedData: Record<string, string> = {};
      campos.forEach(campo => {
        clearedData[campo.name] = '';
      });
      setFormData(clearedData);
      
      // Mostrar modal de sucesso
      setModalSucesso(true);
    } catch (error: any) {
      if (error.response?.status === 402) {
        // Saldo insuficiente
        const errorData = error.response.data;
        setSaldoAtual(parseFloat(errorData.balance));
        setModalSaldo(true);
      } else if (error.response?.status === 401) {
        // Token expirado
        setMensagemErro('Sessão expirada. Faça login novamente.');
        setModalErro(true);
        setTimeout(() => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          window.location.href = '/';
        }, 2000);
      } else {
        // Outro erro
        const errorMsg = error.response?.data?.msg || 'Erro ao processar consulta. Tente novamente.';
        setMensagemErro(errorMsg);
        setModalErro(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = () => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = pdfFileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-[#000042] text-white py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center gap-3">
            {icon && <div className="w-8 h-8">{icon}</div>}
            <div>
              <h1 className="text-2xl font-bold">{titulo}</h1>
              <p className="text-gray-300 text-sm mt-1">{descricao}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Aviso Personalizado */}
          {avisoPersonalizado && (
            <div className="mb-6">
              {avisoPersonalizado}
            </div>
          )}

          {/* Preço */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-sm text-gray-600">Valor da consulta</p>
            <p className="text-2xl font-bold text-[#000042]">
              {loadingPreco ? (
                <span className="text-gray-400">Carregando...</span>
              ) : (
                `R$ ${preco.toFixed(2)}`
              )}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {campos.map((campo) => (
              <div key={campo.name}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {campo.label}
                  {campo.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                
                {campo.type === 'text' ? (
                  <input
                    type="text"
                    value={formData[campo.name] || ''}
                    onChange={(e) => handleInputChange(campo.name, e.target.value)}
                    placeholder={campo.placeholder}
                    required={campo.required}
                    maxLength={campo.maxLength}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
                  />
                ) : (
                  <select
                    value={formData[campo.name] || ''}
                    onChange={(e) => handleInputChange(campo.name, e.target.value)}
                    required={campo.required}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
                  >
                    <option value="">Selecione uma opção</option>
                    {campo.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            ))}

            {/* Botões */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={loading || loadingPreco}
                className="flex-1 bg-[#000042] text-white py-3 rounded-lg hover:bg-[#000052] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processando...
                  </>
                ) : loadingPreco ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Carregando preço...
                  </>
                ) : (
                  textoBotao
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

          {/* Botão Download PDF e Visualizador Inline */}
          {pdfUrl && (
            <div className="mt-6 space-y-4">
              {/* Botão Download */}
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-[#4f46e5] text-white py-3 rounded-lg hover:bg-[#4338ca] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>

              {/* Visualizador PDF Inline */}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <iframe
                  src={pdfUrl}
                  className="w-full h-[600px]"
                  title="Visualizador de PDF"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <ModalSucesso 
        isOpen={modalSucesso} 
        onClose={() => setModalSucesso(false)}
      />
      <ModalErro 
        isOpen={modalErro} 
        onClose={() => setModalErro(false)}
        mensagem={mensagemErro}
      />
      <ModalSaldoInsuficiente 
        isOpen={modalSaldo} 
        onClose={() => setModalSaldo(false)}
        saldoAtual={saldoAtual}
        valorConsulta={preco}
      />
      <PDFViewer 
        isOpen={modalPDF} 
        onClose={() => setModalPDF(false)}
        pdfUrl={pdfUrl}
        fileName={pdfFileName}
      />
    </div>
  );
}

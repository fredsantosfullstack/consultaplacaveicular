import { useState, useEffect } from 'react';
import { FileText, Loader2, AlertTriangle, Info, Download } from 'lucide-react';
import api from '../../services/api';
import ModalSucesso from '../../components/ModalSucesso';
import ModalErro from '../../components/ModalErro';
import ModalSaldoInsuficiente from '../../components/ModalSaldoInsuficiente';

export default function ReemissaoAtpvE() {
  const [tipoConsulta, setTipoConsulta] = useState<'placa' | 'chassi'>('placa');
  const [placa, setPlaca] = useState('');
  const [renavam, setRenavam] = useState('');
  const [chassi, setChassi] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPreco, setLoadingPreco] = useState(true);
  const [preco, setPreco] = useState(0);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  
  // Modals
  const [modalSucesso, setModalSucesso] = useState(false);
  const [modalErro, setModalErro] = useState(false);
  const [modalSaldo, setModalSaldo] = useState(false);
  const [mensagemErro, setMensagemErro] = useState('');
  const [saldoAtual, setSaldoAtual] = useState(0);

  useEffect(() => {
    const fetchPreco = async () => {
      try {
        const response = await api.get('/consultations/details/reemissao-atpv-e');
        setPreco(parseFloat(response.data.price));
      } catch (error) {
        console.error('Erro ao buscar preço:', error);
        setPreco(0);
      } finally {
        setLoadingPreco(false);
      }
    };
    fetchPreco();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = tipoConsulta === 'placa' 
        ? { placa: placa.toUpperCase(), renavam }
        : { chassi: chassi.toUpperCase() };

      const response = await api.post('/consultations/execute/reemissao-atpv-e', data, {
        responseType: 'blob',
        timeout: 60000
      });

      // Sucesso - criar URL do PDF
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      setPdfUrl(url);
      setPdfFileName(`reemissao-atpv-e-${tipoConsulta === 'placa' ? placa : chassi}.pdf`);
      
      // Limpar campos
      setPlaca('');
      setRenavam('');
      setChassi('');
      
      setModalSucesso(true);
    } catch (error: any) {
      if (error.response?.status === 402) {
        const errorData = error.response.data;
        setSaldoAtual(parseFloat(errorData.balance));
        setModalSaldo(true);
      } else if (error.response?.status === 401) {
        setMensagemErro('Sessão expirada. Faça login novamente.');
        setModalErro(true);
        setTimeout(() => {
          localStorage.removeItem('token');
          sessionStorage.removeItem('token');
          window.location.href = '/';
        }, 2000);
      } else {
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
            <FileText className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">Reemissão ATPV-E</h1>
              <p className="text-gray-300 text-sm mt-1">Autorização para Transferência de Propriedade de Veículo Eletrônica</p>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Info Box */}
          <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Não achou pela placa? Sem problemas, tente pelo chassi para ter certeza.
              </p>
            </div>
          </div>

          {/* Alert Box */}
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 font-medium">
                <strong>Atenção:</strong> Se existir comunicado de venda, não é possível realizar a Reemissão do ATPV-e.
              </p>
            </div>
          </div>

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
            {/* Select Tipo de Consulta */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de consulta <span className="text-red-500">*</span>
              </label>
              <select
                value={tipoConsulta}
                onChange={(e) => setTipoConsulta(e.target.value as 'placa' | 'chassi')}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
              >
                <option value="placa">Placa</option>
                <option value="chassi">Chassi</option>
              </select>
            </div>

            {/* Campos Condicionais - PLACA */}
            {tipoConsulta === 'placa' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Placa do Veículo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={placa}
                    onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                    placeholder="ABC1D23"
                    required
                    maxLength={7}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    RENAVAM <span className="text-red-500">*</span>
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
              </>
            )}

            {/* Campos Condicionais - CHASSI */}
            {tipoConsulta === 'chassi' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número do Chassi <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={chassi}
                  onChange={(e) => setChassi(e.target.value.toUpperCase())}
                  placeholder="9BWZZZ377VT004251"
                  required
                  maxLength={17}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
                />
              </div>
            )}

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
                ) : (
                  'Consultar'
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

          {/* Visualizador PDF */}
          {pdfUrl && (
            <div className="mt-6 space-y-4">
              <button
                onClick={handleDownloadPDF}
                className="w-full bg-[#4f46e5] text-white py-3 rounded-lg hover:bg-[#4338ca] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download PDF
              </button>
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
    </div>
  );
}

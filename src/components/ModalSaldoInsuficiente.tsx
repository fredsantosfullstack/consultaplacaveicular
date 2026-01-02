import { AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModalSaldoInsuficienteProps {
  isOpen: boolean;
  onClose: () => void;
  saldoAtual: number;
  valorConsulta: number;
}

export default function ModalSaldoInsuficiente({ 
  isOpen, 
  onClose, 
  saldoAtual, 
  valorConsulta 
}: ModalSaldoInsuficienteProps) {
  const navigate = useNavigate();
  
  if (!isOpen) return null;

  const saldoSeguro = isNaN(saldoAtual) || saldoAtual === null || saldoAtual === undefined ? 0 : saldoAtual;
  const valorSeguro = isNaN(valorConsulta) || valorConsulta === null || valorConsulta === undefined ? 0 : valorConsulta;
  const faltam = valorSeguro - saldoSeguro;

  const handleRecarregar = () => {
    navigate('/recarga-creditos');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Ícone de Aviso */}
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Saldo Insuficiente
          </h3>

          {/* Mensagem */}
          <p className="text-gray-600 mb-6">
            Você não possui créditos suficientes para realizar esta consulta.
          </p>

          {/* Detalhes */}
          <div className="w-full bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Saldo atual:</span>
              <span className="font-semibold text-gray-900">
                R$ {Number(saldoSeguro).toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Valor da consulta:</span>
              <span className="font-semibold text-gray-900">
                R$ {Number(valorSeguro).toFixed(2)}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between text-sm">
              <span className="text-gray-600">Faltam:</span>
              <span className="font-bold text-red-600">
                R$ {Number(faltam).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleRecarregar}
              className="flex-1 px-4 py-2 bg-[#076AC2] text-white rounded-lg hover:bg-[#055a9f] transition-colors font-medium"
            >
              Recarregar Créditos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

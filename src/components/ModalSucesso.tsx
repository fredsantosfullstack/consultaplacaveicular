import { Check } from 'lucide-react';

interface ModalSucessoProps {
  isOpen: boolean;
  onClose: () => void;
  onViewPDF: () => void;
}

export default function ModalSucesso({ isOpen, onClose, onViewPDF }: ModalSucessoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Ícone de Sucesso */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <Check className="w-8 h-8 text-green-600" />
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Sucesso!
          </h3>

          {/* Mensagem */}
          <p className="text-gray-600 mb-6">
            Consulta realizada com sucesso! O PDF está pronto para visualização.
          </p>

          {/* Botões */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              Fechar
            </button>
            <button
              onClick={onViewPDF}
              className="flex-1 px-4 py-2 bg-[#000042] text-white rounded-lg hover:bg-[#000052] transition-colors font-medium"
            >
              Ver PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

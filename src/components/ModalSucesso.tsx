import { Check } from 'lucide-react';

interface ModalSucessoProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalSucesso({ isOpen, onClose }: ModalSucessoProps) {
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
            Consulta realizada com sucesso! O PDF está disponível abaixo.
          </p>

          {/* Botão OK */}
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-[#6366f1] text-white rounded-lg hover:bg-[#5558e3] transition-colors font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

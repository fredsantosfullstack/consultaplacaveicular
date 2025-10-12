import { X } from 'lucide-react';

interface ModalErroProps {
  isOpen: boolean;
  onClose: () => void;
  mensagem: string;
}

export default function ModalErro({ isOpen, onClose, mensagem }: ModalErroProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-xl">
        <div className="flex flex-col items-center text-center">
          {/* Ícone de Erro */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>

          {/* Título */}
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Erro!
          </h3>

          {/* Mensagem */}
          <p className="text-gray-600 mb-6">
            {mensagem}
          </p>

          {/* Botão */}
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

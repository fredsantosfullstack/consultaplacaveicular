import React from 'react';
import { Lock } from 'lucide-react';

const Maintenance: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 sm:p-12 text-center border border-white/20 shadow-2xl">
          {/* Ícone */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-500/20 p-4 rounded-full">
              <Lock className="w-12 h-12 text-red-400" />
            </div>
          </div>

          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">
            🔒 Acesso Temporariamente Suspenso
          </h1>

          {/* Mensagem */}
          <p className="text-gray-300 text-base sm:text-lg mb-8">
            O sistema está indisponível.
          </p>

          {/* Linha decorativa */}
          <div className="w-20 h-1 bg-gradient-to-r from-red-500 to-orange-500 mx-auto rounded-full"></div>
        </div>

        {/* Rodapé */}
        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Golden Veicular
        </p>
      </div>
    </div>
  );
};

export default Maintenance;

import React, { useState } from 'react';
import { MessageCircle } from 'lucide-react';

const WhatsAppButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  const handleClick = () => {
    window.open(
      'https://wa.me/5579991187607?text=Ol%C3%A1%2C%20vim%20pelo%20painel%20e%20preciso%20de%20suporte%21',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap shadow-lg animate-fade-in">
          Qualquer coisa, é só chamar!
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-800"></div>
        </div>
      )}

      {/* Botão WhatsApp */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center group"
        aria-label="Contato via WhatsApp"
      >
        <MessageCircle size={28} className="group-hover:animate-pulse" />
      </button>
    </div>
  );
};

export default WhatsAppButton;

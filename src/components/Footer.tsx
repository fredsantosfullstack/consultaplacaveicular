import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 p-4 text-gray-600 text-sm">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-screen-xl mx-auto px-4">
        <div className="text-center sm:text-left mb-2 sm:mb-0">
          &copy; 2025 Golden Veicular | E-mail: contato@goldenveicular.com.br
        </div>
        <div className="text-center sm:text-right">
          Desenvolvido por{' '}
          <a
            href="https://fredsonluz.dev.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#002672] hover:underline"
          >
            Fredson Luz
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
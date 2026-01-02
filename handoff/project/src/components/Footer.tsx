import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-gray-200 text-gray-700 text-sm h-12">
      <div className="flex justify-between items-center h-full max-w-screen-xl mx-auto px-4">
        <div>
          &copy; 2025. Golden Veicular
        </div>
        <div className="text-center sm:text-right">
          Desenvolvido por{' '}
          <a
            href="https://agenciadipixel.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-[#0f43aa] hover:underline"
          >
            Agência DiPixel
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
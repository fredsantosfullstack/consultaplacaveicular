import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LandingHeaderProps {
  logoUrl?: string;
  siteName: string;
}

const SIGNUP_URL = 'https://www.consultaplacaveicular.com.br/cadastre-se';

const LandingHeader: React.FC<LandingHeaderProps> = ({ logoUrl, siteName }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleMobileLinkClick = () => setIsMobileMenuOpen(false);

  const menuItems = [
    { label: 'Serviços', id: 'servicos' },
    { label: 'Como Funciona', id: 'como-funciona' },
    { label: 'Contato', id: 'contato' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 backdrop-blur-sm'
      }`}
    >
      <div className="max-w-[1410px] mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center" aria-label="Voltar para a página inicial">
            {logoUrl ? (
              <img src={logoUrl} alt={siteName} className="h-10 w-auto" />
            ) : (
              <span className="text-2xl font-bold text-[#076AC2]">{siteName}</span>
            )}
          </a>

          {/* Menu Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                className="text-gray-700 hover:text-[#076AC2] font-medium transition-colors text-[16px]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Botões de Ação */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/login"
              className="px-6 py-2 text-[#076AC2] font-semibold border-2 border-[#076AC2] rounded-lg hover:bg-[#076AC2] hover:text-white transition-all"
            >
              Entrar
            </Link>
            <a
              href={SIGNUP_URL}
              className="px-6 py-2 bg-[#52c41a] text-white font-semibold rounded-lg hover:bg-[#3fa813] transition-all shadow-md hover:shadow-lg"
            >
              Criar conta gratuita
            </a>
          </div>

          {/* Botão Mobile Menu */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-[#076AC2]"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <nav className="max-w-[1410px] mx-auto px-5 py-4 space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.id}
                href={`/#${item.id}`}
                onClick={handleMobileLinkClick}
                className="block w-full text-left px-4 py-2 text-gray-700 hover:text-[#076AC2] hover:bg-gray-50 rounded-lg font-medium transition-colors text-[16px]"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 space-y-2">
              <Link
                to="/login"
                onClick={handleMobileLinkClick}
                className="block w-full text-center px-6 py-3 text-[#076AC2] font-semibold border-2 border-[#076AC2] rounded-lg hover:bg-[#076AC2] hover:text-white transition-all"
              >
                Entrar
              </Link>
              <a
                href={SIGNUP_URL}
                onClick={handleMobileLinkClick}
                className="block w-full text-center px-6 py-3 bg-[#52c41a] text-white font-semibold rounded-lg hover:bg-[#3fa813] transition-all"
              >
                Criar conta gratuita
              </a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default LandingHeader;

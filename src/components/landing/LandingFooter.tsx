import React from 'react';

interface FooterLink {
  label: string;
  url: string;
  category: string;
}

interface LandingFooterProps {
  links: FooterLink[];
  siteName: string;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ links, siteName }) => {
  const menuLinks = links.filter(link => link.category === 'menu');
  const legalLinks = links.filter(link => link.category === 'legal');

  const scrollToSection = (url: string) => {
    if (url.startsWith('#')) {
      const sectionId = url.substring(1);
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    } else {
      window.location.href = url;
    }
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Coluna 1 - Sobre */}
          <div>
            <h3 className="text-xl font-bold mb-4">{siteName}</h3>
            <p className="text-gray-400 text-sm">
              Plataforma completa de consultas veiculares. Rápido, seguro e confiável.
            </p>
          </div>

          {/* Coluna 2 - Links Rápidos */}
          {menuLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Links Rápidos</h3>
              <ul className="space-y-2">
                {menuLinks.map((link, index) => (
                  <li key={index}>
                    <button
                      onClick={() => scrollToSection(link.url)}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Coluna 3 - Legal */}
          {legalLinks.length > 0 && (
            <div>
              <h3 className="text-lg font-bold mb-4">Legal</h3>
              <ul className="space-y-2">
                {legalLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="text-gray-400 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Linha divisória */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} {siteName}. Todos os direitos reservados.
            </p>
            <p className="text-gray-400 text-xs text-center md:text-right">
              Desenvolvido por{' '}
              <a
                href="https://agenciadipixel.com.br"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-gray-300 hover:text-white transition-colors"
              >
                Agência DiPixel
              </a>
              {' '}| (79) 98149-9282
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

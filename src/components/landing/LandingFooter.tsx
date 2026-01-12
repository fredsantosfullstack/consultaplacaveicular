import React from 'react';

interface FooterLink {
  label: string;
  url: string;
  category: string;
}

interface LandingFooterProps {
  links: FooterLink[];
  siteName: string;
  footerLogoUrl?: string;
}

const LandingFooter: React.FC<LandingFooterProps> = ({ links, siteName, footerLogoUrl }) => {
  // Deduplicar links por URL E Label para evitar repetições indesejadas
  const deduplicate = (list: FooterLink[]) => {
    const seen = new Set<string>();
    return list.filter(link => {
      const key = `${link.label.toLowerCase().trim()}|${link.url.toLowerCase().trim()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };

  const normalizeLegalUrl = (url: string) => {
    const cleanUrl = url.toLowerCase().trim();
    const mapping: Record<string, string> = {
      '/privacidade': '/politica-de-privacidade',
      '/privacidade.html': '/politica-de-privacidade',
      '/politica': '/politica-de-privacidade',
      '/politica-privacidade': '/politica-de-privacidade',
      '/termos': '/termos-de-uso',
      '/termos.html': '/termos-de-uso',
      '/termo': '/termos-de-uso'
    };
    return mapping[cleanUrl] || cleanUrl;
  };

  const menuLinks = deduplicate(links.filter((link) => link.category === 'menu'));
  const legalLinks = deduplicate(
    links
      .filter((link) => link.category === 'legal')
      .map(link => ({ ...link, url: normalizeLegalUrl(link.url) }))
  );

  // Adicionar links manuais se não existirem
  const finalMenuLinks = [...menuLinks];
  if (!finalMenuLinks.some(l => l.url === '/login' || l.url === '/cadastro')) {
    finalMenuLinks.push({ label: 'Entrar', url: '/login', category: 'menu' });
  }

  const finalLegalLinks = [...legalLinks];
  const addIfMissing = (label: string, url: string) => {
    if (!finalLegalLinks.some(l => l.url === url || l.label === label)) {
      finalLegalLinks.push({ label, url, category: 'legal' });
    }
  };

  addIfMissing('Termos de Uso', '/termos-de-uso');
  addIfMissing('Política de Privacidade', '/politica-de-privacidade');
  addIfMissing('LGPD', '/lgpd');

  const scrollToSection = (url: string) => {
    if (url.startsWith('#')) {
      if (window.location.pathname !== '/') {
        window.location.href = `/${url}`;
        return;
      }
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
    <footer className="bg-slate-950 text-white">
      <div className="max-w-[1410px] mx-auto px-5 sm:px-8 lg:px-12 py-12 space-y-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr,1fr,1fr]">
          <div className="space-y-4">
            {footerLogoUrl ? (
              <a href="/" className="inline-flex" aria-label="Voltar para a página inicial">
                <img src={footerLogoUrl} alt={siteName} className="h-10 w-auto" />
              </a>
            ) : (
              <a href="/" className="text-2xl font-semibold hover:text-white transition-colors">
                {siteName}
              </a>
            )}
            <div className="text-sm text-gray-400 leading-relaxed space-y-1">
              <p>Plataforma profissional de consultas veiculares.</p>
              <p>Segurança, rapidez e confiabilidade para suas decisões.</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Consultas</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {finalMenuLinks.map((link, index) => (
                <li key={`${link.url}-${index}`}>
                  {link.url.startsWith('#') ? (
                    <button onClick={() => scrollToSection(link.url)} className="hover:text-white transition-colors">
                      {link.label}
                    </button>
                  ) : (
                    <a href={link.url} className="hover:text-white transition-colors">
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Políticas</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {finalLegalLinks.map((link, index) => (
                <li key={`${link.url}-${index}`}>
                  <a href={link.url} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-start gap-4 text-sm text-gray-500">
          <p>© 2026 — Todos os direitos reservados.</p>
          <div className="text-left sm:text-right">
            <p>{siteName} — CNPJ 57.352.646/0001-55</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

import React from 'react';
import { goToSection } from '../../utils/scroll';

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

  const normalizeString = (value: string) => {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  };

  const normalizeMenuTarget = (url: string, label?: string) => {
    const baseValue = (url || '').trim();

    if (baseValue.includes('#')) {
      const hash = baseValue.slice(baseValue.indexOf('#'));
      return hash.startsWith('#') ? hash : `#${hash}`;
    }

    const fallbackLabel = label ? label : '';
    const valueToCheck = baseValue || fallbackLabel;
    const cleaned = normalizeString(
      valueToCheck
        .replace(/^https?:\/\/[^/]+/, '')
        .replace(/^\//, '')
        .replace(/\/$/, '')
        .replace(/\s+/g, '')
    );

    const sectionsMap: Record<string, string> = {
      servicos: '#servicos',
      servico: '#servicos',
      comofunciona: '#como-funciona',
      'como-funciona': '#como-funciona',
      contato: '#contato',
      contatos: '#contato'
    };

    if (sectionsMap[cleaned]) {
      return sectionsMap[cleaned];
    }

    return baseValue || fallbackLabel || '/';
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

  const handleMenuNavigation = (url: string, label?: string, event?: React.MouseEvent<HTMLAnchorElement>) => {
    const target = normalizeMenuTarget(url, label);

    if (target.startsWith('#')) {
      event?.preventDefault();
      goToSection(target);
    } else if (event) {
      event.preventDefault();
      window.location.href = target;
    }
  };

  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-[1410px] mx-auto px-5 sm:px-8 lg:px-12 py-12 space-y-10">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr,1fr,1fr]">
          <div className="space-y-4 text-center sm:text-left">
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

          <div className="text-center sm:text-left">
            <h4 className="text-lg font-semibold mb-4">Consultas</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              {finalMenuLinks.map((link, index) => (
                <li key={`${link.url}-${index}`}>
                  <a
                    href={normalizeMenuTarget(link.url, link.label)}
                    onClick={(event) => handleMenuNavigation(link.url, link.label, event)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="text-center sm:text-left">
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

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-4 text-sm text-gray-500">
          <p className="w-full sm:w-auto">© 2026 — Todos os direitos reservados.</p>
          <div className="w-full sm:w-auto text-center sm:text-right">
            <p>{siteName} — CNPJ 57.352.646/0001-55</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingFooter;

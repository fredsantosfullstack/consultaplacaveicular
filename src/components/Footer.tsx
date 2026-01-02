import React from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const Footer: React.FC = () => {
  const { settings } = useSiteSettings();

  // Só exibir footer se houver mensagem
  const message = settings?.footer_message;
  
  if (!message || message.trim() === '') {
    return null;
  }

  return (
    <footer className="h-12 border-t border-gray-200 bg-white text-sm text-gray-700">
      <div className="mx-auto flex h-full max-w-screen-xl items-center justify-center px-4">
        <div className="text-center">{message}</div>
      </div>
    </footer>
  );
};

export default Footer;
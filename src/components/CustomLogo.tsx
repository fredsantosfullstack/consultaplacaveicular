import React from 'react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { buildAssetUrl } from '../utils/assetUrl';

interface CustomLogoProps {
  type: 'menu' | 'login';
  className?: string;
}

const FALLBACKS = {
  login: '/logo-consultaplacaveicular-login.png',
  menu: '/logo-consultaplacaveicular-menu.png'
} as const;

const CustomLogo: React.FC<CustomLogoProps> = ({ type, className = '' }) => {
  const { settings } = useSiteSettings();

  const customPath =
    type === 'login' ? settings?.logo_login_url : settings?.logo_menu_url;

  const logoPath = buildAssetUrl(customPath) || FALLBACKS[type];

  const baseClass = type === 'login' ? 'object-contain w-[260px] h-auto' : 'object-contain h-8 w-auto';
  const combinedClass = className ? `${baseClass} ${className}` : baseClass;

  return (
    <img
      src={logoPath}
      alt="Consultaplacaveicular Logo"
      className={combinedClass}
    />
  );
};

export default CustomLogo;

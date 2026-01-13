import React, { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { publicApi } from '../services/api';
import { buildAssetUrl } from '../utils/assetUrl';

export interface SiteSettings {
  logo_menu_url?: string | null;
  logo_login_url?: string | null;
  favicon_url?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  seo_keywords?: string | null;
  whatsapp_enabled?: string | null;
  whatsapp_phone?: string | null;
  whatsapp_message?: string | null;
  footer_enabled?: string | null;
  footer_message?: string | null;
  [key: string]: string | null | undefined;
}

interface SiteSettingsContextValue {
  settings: SiteSettings | null;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  getAssetUrl: (relativePath?: string | null) => string;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: null,
  isLoading: true,
  refreshSettings: async () => {},
  getAssetUrl: (relativePath?: string | null) => buildAssetUrl(relativePath)
});

const sanitizeAssetPath = (value?: string | null) => {
  if (!value) return null;
  const normalized = value.toLowerCase();
  if (
    normalized.includes('golden') ||
    normalized.includes('logo-golden') ||
    normalized.includes('goldenveicular')
  ) {
    return null;
  }
  return value;
};

const sanitizeSettings = (rawSettings: SiteSettings | null | undefined): SiteSettings => {
  if (!rawSettings) return {};

  return {
    ...rawSettings,
    logo_menu_url: sanitizeAssetPath(rawSettings.logo_menu_url),
    logo_login_url: sanitizeAssetPath(rawSettings.logo_login_url),
    favicon_url: sanitizeAssetPath(rawSettings.favicon_url)
  };
};

export const SiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSettings = useCallback(async (showLoader = false) => {
    if (showLoader) {
      setIsLoading(true);
    }

    try {
      const response = await publicApi.get('/settings');
      setSettings(sanitizeSettings(response.data));
    } catch (error) {
      console.error('Erro ao carregar configurações do site:', error);
      setSettings({});
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings(true);
  }, [fetchSettings]);

  useEffect(() => {
    if (settings?.seo_title) {
      document.title = settings.seo_title;
    }

    if (settings?.seo_description) {
      let descriptionTag = document.querySelector("meta[name='description']") as HTMLMetaElement | null;
      if (!descriptionTag) {
        descriptionTag = document.createElement('meta');
        descriptionTag.name = 'description';
        document.head.appendChild(descriptionTag);
      }
      descriptionTag.content = settings.seo_description;
    }

    if (settings?.seo_keywords) {
      let keywordsTag = document.querySelector("meta[name='keywords']") as HTMLMetaElement | null;
      if (!keywordsTag) {
        keywordsTag = document.createElement('meta');
        keywordsTag.name = 'keywords';
        document.head.appendChild(keywordsTag);
      }
      keywordsTag.content = settings.seo_keywords;
    }
  }, [settings?.seo_title, settings?.seo_description, settings?.seo_keywords]);

  useEffect(() => {
    const faviconUrl = buildAssetUrl(settings?.favicon_url);
    if (!faviconUrl) return;

    const link: HTMLLinkElement = (document.querySelector("link[rel='icon']") as HTMLLinkElement) || document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
  }, [settings?.favicon_url]);

  const refreshSettings = useCallback(async () => {
    await fetchSettings(true);
  }, [fetchSettings]);

  const value: SiteSettingsContextValue = {
    settings,
    isLoading,
    refreshSettings,
    getAssetUrl: buildAssetUrl
  };

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);

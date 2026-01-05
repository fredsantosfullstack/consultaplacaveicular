import React, { useEffect, useState } from 'react';
import LandingHeader from '../src/components/landing/LandingHeader';
import Hero from '../src/components/landing/Hero';
import Statistics from '../src/components/landing/Statistics';
import Services from '../src/components/landing/Services';
import Steps from '../src/components/landing/Steps';
import Contact from '../src/components/landing/Contact';
import LandingFooter from '../src/components/landing/LandingFooter';
import { publicApi } from '../src/services/api';

interface LandingData {
  config: {
    logo_url?: string;
    footer_logo_url?: string;
    primary_color: string;
    secondary_color: string;
    whatsapp_number?: string;
    whatsapp_message?: string;
    seo_title: string;
    seo_description?: string;
    seo_keywords?: string;
  };
  hero: {
    title: string;
    subtitle: string;
    description: string;
    cta_primary_text: string;
    cta_primary_link: string;
    cta_whatsapp_text: string;
    background_gradient_from: string;
    background_gradient_to: string;
    mockup_image_url?: string;
  };
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  statistics: Array<{
    number: string;
    label: string;
  }>;
  services: Array<{
    id: number;
    name: string;
    description: string;
    price: number;
    features: string[];
    is_highlighted: boolean;
    highlight_label?: string | null;
  }>;
  steps: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  footerLinks: Array<{
    label: string;
    url: string;
    category: string;
  }>;
}

const LandingPage: React.FC = () => {
  const [data, setData] = useState<LandingData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLandingData = async () => {
      try {
        const response = await publicApi.get('/cms/landing-page');

        const normalizedServices = (response.data.services || []).map((service: any) => {
          let price = service.price;
          if (typeof price !== 'number') {
            const parsed = Number(price);
            price = Number.isFinite(parsed) ? parsed : 0;
          }

          let features = service.features;
          if (typeof features === 'string') {
            try {
              const parsed = JSON.parse(features);
              features = Array.isArray(parsed) ? parsed : features.split('\n').filter(Boolean);
            } catch {
              features = features.split('\n').filter(Boolean);
            }
          }
          if (!Array.isArray(features)) {
            features = [];
          }

          return {
            ...service,
            price,
            features
          };
        });

        setData({
          ...response.data,
          services: normalizedServices
        });

        // Atualizar SEO
        if (response.data.config.seo_title) {
          document.title = response.data.config.seo_title;
        }
        if (response.data.config.seo_description) {
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', response.data.config.seo_description);
          }
        }
        if (response.data.config.seo_keywords) {
          const metaKeywords = document.querySelector('meta[name="keywords"]');
          if (metaKeywords) {
            metaKeywords.setAttribute('content', response.data.config.seo_keywords);
          }
        }
      } catch (err) {
        console.error('Erro ao carregar dados da landing page:', err);
        setError('Erro ao carregar página. Tente novamente mais tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLandingData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#076AC2] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Erro ao carregar página'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#076AC2] text-white rounded-lg hover:bg-[#055a9f]"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <LandingHeader
        logoUrl={data.config.logo_url}
        siteName={data.config.seo_title}
      />

      {/* Espaçamento para o header fixo */}
      <div className="h-20"></div>

      {/* Hero Section */}
      <Hero
        title={data.hero.title}
        subtitle={data.hero.subtitle}
        description={data.hero.description}
        ctaPrimaryText={data.hero.cta_primary_text}
        ctaPrimaryLink={data.hero.cta_primary_link}
        ctaWhatsappText={data.hero.cta_whatsapp_text}
        whatsappNumber={data.config.whatsapp_number || ''}
        whatsappMessage={data.config.whatsapp_message || ''}
        benefits={data.benefits}
        gradientFrom={data.hero.background_gradient_from}
        gradientTo={data.hero.background_gradient_to}
        mockupImageUrl={data.hero.mockup_image_url}
      />

      {/* Statistics */}
      {data.statistics.length > 0 && (
        <Statistics statistics={data.statistics} />
      )}

      {/* Services */}
      {data.services.length > 0 && (
        <Services services={data.services} />
      )}

      {/* Steps */}
      {data.steps.length > 0 && (
        <Steps steps={data.steps} />
      )}

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <LandingFooter
        links={data.footerLinks}
        siteName={data.config.seo_title}
        footerLogoUrl={data.config.footer_logo_url}
      />
    </div>
  );
};

export default LandingPage;

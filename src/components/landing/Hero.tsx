import React from 'react';
import { Shield, Zap, FileText, MessageCircle } from 'lucide-react';
import { buildAssetUrl } from '../../utils/assetUrl';

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaWhatsappText: string;
  ctaWhatsappIconUrl?: string | null;
  whatsappNumber: string;
  whatsappMessage: string;
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  gradientFrom: string;
  gradientTo: string;
  mockupImageUrl?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  ctaPrimaryText,
  ctaPrimaryLink,
  ctaWhatsappText,
  ctaWhatsappIconUrl,
  whatsappNumber,
  whatsappMessage,
  benefits,
  gradientFrom,
  gradientTo,
  mockupImageUrl
}) => {
  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      'shield-check': Shield,
      'shield': Shield,
      'zap': Zap,
      'file-text': FileText,
      'default': Shield
    };
    return icons[iconName] || icons['default'];
  };

  const handleWhatsAppClick = () => {
    const phone = whatsappNumber.replace(/\D/g, '');
    const message = encodeURIComponent(whatsappMessage || 'Olá! Vim pelo site e gostaria de mais informações.');
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
  };

  const cleanedSubtitle = (subtitle || '').trim();
  const showSubtitle = cleanedSubtitle.length > 0 && cleanedSubtitle.toLowerCase() !== 'consultas veiculares online';
  const whatsappIconUrl = ctaWhatsappIconUrl ? buildAssetUrl(ctaWhatsappIconUrl) : '';
  const mockupImageSrc = mockupImageUrl ? buildAssetUrl(mockupImageUrl) : '';

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: gradientFrom,
        backgroundImage: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
      }}
    >
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      </div>
      <div className="relative max-w-[1410px] mx-auto px-5 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="grid lg:grid-cols-[1.1fr,0.9fr] gap-12 items-center">
          <div className="text-white space-y-6">
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black leading-tight drop-shadow-lg text-white">
              {title}
            </h1>
            {showSubtitle && (
              <p className="text-2xl text-white/80 font-semibold">{cleanedSubtitle}</p>
            )}
            <p className="text-lg sm:text-xl text-white/85 max-w-2xl">
              {description}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <a
                href={ctaPrimaryLink}
                className="inline-flex items-center justify-center gap-3 px-12 py-8 bg-[#52c41a] text-white font-bold rounded-[10px] transition-all duration-300 shadow-lg hover:shadow-2xl hover:bg-[#3fa813] text-xl"
              >
                Consultar Placa Agora
              </a>
              {whatsappNumber && (
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center justify-center gap-3 px-12 py-8 border-2 border-white text-white font-bold rounded-[10px] transition-all duration-300 hover:bg-white/10 text-xl"
                >
                  {whatsappIconUrl ? (
                    <img
                      src={whatsappIconUrl}
                      alt="WhatsApp"
                      className="w-6 h-6 object-contain"
                    />
                  ) : (
                    <MessageCircle size={24} />
                  )}
                  {ctaWhatsappText}
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-6 pt-8 text-white/80">
              {benefits.slice(0, 2).map((benefit, index) => {
                const Icon = getIcon(benefit.icon);
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10">
                      <Icon className="w-5 h-5" />
                    </span>
                    <div>
                      <p className="font-semibold text-white">{benefit.title}</p>
                      <p className="text-sm text-white/70">{benefit.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            {/* MacBook Frame */}
            <div className="relative mx-auto max-w-md">
              {/* MacBook Body */}
              <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-2xl shadow-2xl overflow-hidden border-8 border-gray-900">
                {/* Screen */}
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 aspect-video relative overflow-hidden">
                  {mockupImageSrc ? (
                    <img
                      src={mockupImageSrc}
                      alt="Mockup do sistema"
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <div className="p-6 h-full flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Radar Inteligente</p>
                            <p className="text-xl font-bold text-slate-900">+400 KPIs</p>
                          </div>
                          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          {benefits.slice(0, 4).map((benefit, index) => {
                            const Icon = getIcon(benefit.icon);
                            return (
                              <div key={index} className="p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
                                <Icon className="w-4 h-4 text-[#076AC2] mb-1" />
                                <p className="text-xs font-semibold text-slate-900 line-clamp-1">{benefit.title}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-200 pt-2">
                        <span>Sistema Online</span>
                        <span>100% Seguro</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* MacBook Bottom Bezel */}
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 h-6 rounded-b-2xl shadow-2xl border-8 border-t-0 border-gray-900 flex items-center justify-center">
                <div className="w-24 h-1 bg-gray-700 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

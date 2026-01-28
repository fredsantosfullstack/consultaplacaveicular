import React from "react";
import { Shield, Zap, FileText, MessageCircle } from "lucide-react";
import { buildAssetUrl } from "../../utils/assetUrl";

const SIGNUP_URL = "https://www.consultaplacaveicular.com.br/cadastre-se";

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

const normalizePrimaryLink = (link?: string) => {
  const trimmed = (link || "").trim();
  if (!trimmed) return SIGNUP_URL;
  const lower = trimmed.toLowerCase();
  if (lower === "/cadastro" || lower === "/cadastre-se") {
    return SIGNUP_URL;
  }
  return trimmed;
};

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
      "shield-check": Shield,
      shield: Shield,
      zap: Zap,
      "file-text": FileText,
      default: Shield
    };

    return icons[iconName] || icons.default;
  };

  const handleWhatsAppClick = () => {
    const phone = whatsappNumber.replace(/\D/g, "");
    const message = encodeURIComponent(
      whatsappMessage || "Ola! Vim pelo site e gostaria de mais informacoes."
    );
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  const cleanedSubtitle = (subtitle || "").trim();
  const showSubtitle =
    cleanedSubtitle.length > 0 &&
    cleanedSubtitle.toLowerCase() !== "consultas veiculares online";
  const showWhatsAppButton =
    Boolean(whatsappNumber && whatsappNumber.trim()) &&
    Boolean(ctaWhatsappText && ctaWhatsappText.trim());
  const whatsappIconUrl = ctaWhatsappIconUrl ? buildAssetUrl(ctaWhatsappIconUrl) : "";
  const mockupImageSrc = mockupImageUrl ? buildAssetUrl(mockupImageUrl) : "";
  const hasCustomMockup = Boolean(mockupImageSrc);

  return (
    <section
      className="relative overflow-hidden min-h-[610px] lg:h-[610px] flex items-center"
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
      <div className="relative w-full">
        <div className="max-w-[1250px] mx-auto px-5 sm:px-8 lg:px-12 py-12 lg:py-0 h-full flex flex-col justify-center">
          <div className="grid lg:grid-cols-[0.95fr,1.05fr] gap-10 items-center h-full">
            <div className="text-white space-y-5">
              <h1 className="text-4xl sm:text-[44px] xl:text-[52px] font-black leading-tight drop-shadow-lg text-white">
                {title}
              </h1>
              {showSubtitle && (
                <p className="text-lg sm:text-xl text-white/85 font-semibold">{cleanedSubtitle}</p>
              )}
              <p className="text-base sm:text-lg text-white/85 max-w-2xl leading-relaxed">
                {description}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-2 w-full max-w-xl">
                <a
                  href={normalizePrimaryLink(ctaPrimaryLink)}
                  className={`inline-flex w-full sm:w-auto items-center justify-center gap-3 h-14 bg-[#52c41a] text-white font-semibold rounded-full transition-all duration-300 shadow-lg hover:shadow-2xl hover:bg-[#3fa813] text-lg ${showWhatsAppButton ? 'px-8 sm:px-10' : 'px-8 sm:px-14 lg:px-20'}`}
                >
                  {ctaPrimaryText}
                </a>
                {showWhatsAppButton && (
                  <button
                    onClick={handleWhatsAppClick}
                    className="inline-flex w-full sm:w-auto items-center justify-center gap-3 px-8 h-14 border border-white/80 text-white font-semibold rounded-full transition-all duration-300 hover:bg-white/10 text-lg"
                  >
                    {whatsappIconUrl ? (
                      <img src={whatsappIconUrl} alt="WhatsApp" className="w-6 h-6 object-contain" />
                    ) : (
                      <MessageCircle size={24} />
                    )}
                    {ctaWhatsappText}
                  </button>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-6 pt-6 text-white/80">
                {benefits.slice(0, 2).map((benefit, index) => {
                  const Icon = getIcon(benefit.icon);
                  return (
                    <div key={index} className="flex items-center gap-3 sm:flex-1">
                      <span className="flex items-center justify-center w-11 h-11 rounded-full bg-white/10 border border-white/10">
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

            <div className="relative flex justify-end">
              <div className="relative w-full max-w-2xl">
                {hasCustomMockup ? (
                  <img
                    src={mockupImageSrc}
                    alt="Mockup do sistema"
                    className="w-full h-auto rounded-3xl shadow-2xl"
                  />
                ) : (
                  <>
                    <div className="bg-gradient-to-b from-gray-900 to-gray-800 rounded-[32px] shadow-2xl overflow-hidden border-[14px] border-gray-900">
                      <div className="bg-gradient-to-br from-blue-50 to-slate-50 aspect-[5/3] relative overflow-hidden">
                        <div className="p-6 h-full flex flex-col justify-between">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 font-semibold">Radar Inteligente</p>
                                <p className="text-2xl font-bold text-slate-900">+400 KPIs monitorados</p>
                              </div>
                              <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                Tempo real
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              {benefits.slice(0, 4).map((benefit, index) => {
                                const Icon = getIcon(benefit.icon);
                                return (
                                  <div key={index} className="p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                                    <Icon className="w-5 h-5 text-[#076AC2] mb-2" />
                                    <p className="text-sm font-semibold text-slate-900 line-clamp-1">{benefit.title}</p>
                                    <p className="text-xs text-slate-500 line-clamp-1">{benefit.description}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 border-t border-slate-200 pt-3 gap-2">
                            <span>100% online e ilimitado</span>
                            <span>Integracoes oficiais</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gradient-to-b from-gray-800 to-gray-900 h-6 rounded-b-[32px] shadow-2xl border-[14px] border-t-0 border-gray-900 flex items-center justify-center">
                      <div className="w-24 h-1 bg-gray-700 rounded-full"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

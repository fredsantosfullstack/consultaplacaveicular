import React from 'react';
import { Shield, Zap, FileText, MessageCircle } from 'lucide-react';

interface HeroProps {
  title: string;
  subtitle: string;
  description: string;
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaWhatsappText: string;
  whatsappNumber: string;
  whatsappMessage: string;
  benefits: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
  gradientFrom: string;
  gradientTo: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  ctaPrimaryText,
  ctaPrimaryLink,
  ctaWhatsappText,
  whatsappNumber,
  whatsappMessage,
  benefits,
  gradientFrom,
  gradientTo
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

  return (
    <section 
      className="relative min-h-[600px] flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${gradientFrom} 0%, ${gradientTo} 100%)`
      }}
    >
      {/* Overlay para melhor legibilidade */}
      <div className="absolute inset-0 bg-black/10"></div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Conteúdo Esquerdo */}
          <div className="text-white space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              {title}
            </h1>
            
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
              {subtitle}
            </h2>
            
            <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
              {description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href={ctaPrimaryLink}
                className="inline-flex items-center justify-center px-8 py-4 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {ctaPrimaryText}
              </a>

              {whatsappNumber && (
                <button
                  onClick={handleWhatsAppClick}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white hover:bg-white hover:text-purple-600 text-white font-bold rounded-lg transition-all duration-300"
                >
                  <MessageCircle size={20} />
                  {ctaWhatsappText}
                </button>
              )}
            </div>
          </div>

          {/* Cards de Benefícios - Direita */}
          <div className="space-y-4">
            {benefits.map((benefit, index) => {
              const Icon = getIcon(benefit.icon);
              return (
                <div
                  key={index}
                  className="bg-white/95 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg mb-1">
                        {benefit.title}
                      </h3>
                      {benefit.description && (
                        <p className="text-gray-600 text-sm">
                          {benefit.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Decoração de ondas no bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white"/>
        </svg>
      </div>
    </section>
  );
};

export default Hero;

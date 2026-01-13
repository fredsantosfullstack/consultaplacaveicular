import React, { useState } from 'react';
import { Mail, Phone, Send, CheckCircle, MessageSquare, Shield } from 'lucide-react';
import { publicApi } from '../../services/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    setErrorMessage('');

    try {
      await publicApi.post('/cms/contact', formData);
      setSubmitStatus('success');
      setFormData({ name: '', email: '', message: '' });
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error: any) {
      setSubmitStatus('error');
      setErrorMessage(error.response?.data?.msg || 'Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contato" className="py-20 bg-slate-50 scroll-mt-20">
      <div className="max-w-[1350px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 gap-6 justify-items-center lg:justify-items-stretch lg:grid-cols-[0.95fr,1.05fr]">
          <div className="w-full max-w-[620px] lg:max-w-none mx-auto lg:mx-0 bg-slate-900 text-white rounded-[10px] p-5 sm:p-8 space-y-8 shadow-2xl h-full">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">
                Fale Conosco
              </h2>
              <p className="text-white/70 mt-3">
                Estamos prontos para ajudar você com suas dúvidas e necessidades.
              </p>
            </div>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">E-mail</p>
                  <p className="text-lg font-semibold">contato@consultaplacaveicular.com.br</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Telefone</p>
                  <p className="text-lg font-semibold">(79) 98149-9282</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-white/60">Conformidade</p>
                  <p className="text-lg font-semibold">LGPD</p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-semibold text-white mb-2">Conformidade LGPD</h4>
                  <p className="text-sm text-white/80 leading-relaxed">
                    Seus dados estão protegidos de acordo com a Lei Geral de Proteção de Dados.
                  </p>
                  <a href="/termos-de-uso" className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold mt-3 inline-block transition-colors">
                    Ver Termos de Uso
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full max-w-[620px] lg:max-w-none mx-auto lg:mx-0 bg-white rounded-[10px] p-5 sm:p-8 shadow-xl border border-slate-100 h-full">
            {submitStatus === 'success' ? (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Mensagem Enviada!
                </h3>
                <p className="text-gray-600">
                  Obrigado pelo contato. Responderemos em breve.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm sm:text-base font-semibold text-slate-700 mb-2">
                    Seu nome *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-[10px] focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-base"
                    placeholder="Ex: Marina Costa"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm sm:text-base font-semibold text-slate-700 mb-2">
                    E-mail *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-slate-200 rounded-[10px] focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-base"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm sm:text-base font-semibold text-slate-700 mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 border border-slate-200 rounded-[10px] focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all resize-none text-base"
                    placeholder="Ex: preciso gerar 5K consultas/dia com antifraude integrado"
                  />
                </div>

                {submitStatus === 'error' && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-[10px]">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-slate-900 text-white font-semibold rounded-[10px] transition-all duration-300 shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Mensagem
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;

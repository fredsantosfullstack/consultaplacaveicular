import React, { useState, useEffect } from 'react';
import { Save, Eye, Settings, Layout, Package, TrendingUp, List, Mail, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import { buildAssetUrl } from '../../utils/assetUrl';

interface SiteBuilderProps {}

const SiteBuilder: React.FC<SiteBuilderProps> = () => {
  const [activeTab, setActiveTab] = useState('config');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Estados para cada seção
  const [config, setConfig] = useState({
    logo_url: '',
    favicon_url: '',
    footer_logo_url: '',
    primary_color: '#076AC2',
    secondary_color: '#4A90E2',
    whatsapp_number: '',
    whatsapp_message: '',
    contact_email: '',
    contact_email_cc: '',
    seo_title: '',
    seo_description: '',
    seo_keywords: '',
    pix_warning_message: ''
  });

  const [hero, setHero] = useState({
    title: '',
    subtitle: '',
    description: '',
    cta_primary_text: '',
    cta_primary_link: '',
    cta_whatsapp_text: '',
    cta_whatsapp_icon_url: '',
    background_gradient_from: '#667eea',
    background_gradient_to: '#764ba2',
    mockup_image_url: ''
  });

  const [benefits, setBenefits] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [steps, setSteps] = useState<any[]>([]);
  const [isUploadingHeroIcon, setIsUploadingHeroIcon] = useState(false);
  const [isUploadingHeroMockup, setIsUploadingHeroMockup] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isUploadingFooterLogo, setIsUploadingFooterLogo] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [configRes, heroRes, benefitsRes, statsRes, servicesRes, stepsRes] = await Promise.all([
        api.get('/cms/config'),
        api.get('/cms/hero'),
        api.get('/cms/benefits'),
        api.get('/cms/statistics'),
        api.get('/cms/services'),
        api.get('/cms/steps')
      ]);

      setConfig(prev => ({ ...prev, ...configRes.data }));
      setHero(heroRes.data);
      setBenefits(benefitsRes.data);
      setStatistics(statsRes.data);
      setServices(servicesRes.data);
      setSteps(stepsRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    }
  };

  const handleConfigAssetUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    endpoint: string,
    field: 'logo_url' | 'favicon_url' | 'footer_logo_url',
    setLoading: (value: boolean) => void,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('asset', file);
    setLoading(true);
    setSaveMessage('');
    try {
      const { data } = await api.put(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setConfig(prev => ({ ...prev, [field]: data.path }));
      setSaveMessage(successMessage);
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error(errorMessage, error);
      setSaveMessage(errorMessage);
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleConfigAssetUpload(
      event,
      '/cms/config/logo',
      'logo_url',
      setIsUploadingLogo,
      'Logo atualizado com sucesso!',
      'Erro ao enviar logo'
    );

  const handleFaviconUpload = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleConfigAssetUpload(
      event,
      '/cms/config/favicon',
      'favicon_url',
      setIsUploadingFavicon,
      'Favicon atualizado com sucesso!',
      'Erro ao enviar favicon'
    );

  const handleFooterLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) =>
    handleConfigAssetUpload(
      event,
      '/cms/config/footer-logo',
      'footer_logo_url',
      setIsUploadingFooterLogo,
      'Logo do rodapé atualizado com sucesso!',
      'Erro ao enviar logo do rodapé'
    );

  const handleSaveConfig = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await api.put('/cms/config', config);
      setSaveMessage('Configurações salvas com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar configurações');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveHero = async () => {
    setIsSaving(true);
    setSaveMessage('');
    try {
      await api.put('/cms/hero', hero);
      setSaveMessage('Hero atualizado com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      setSaveMessage('Erro ao salvar hero');
    } finally {
      setIsSaving(false);
    }
  };

  const handleHeroIconUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('icon', file);
    setIsUploadingHeroIcon(true);
    setSaveMessage('');
    try {
      const { data } = await api.put('/cms/hero/icon', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHero(prev => ({ ...prev, cta_whatsapp_icon_url: data.path }));
      setSaveMessage('Ícone do WhatsApp atualizado com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao enviar ícone do WhatsApp:', error);
      setSaveMessage('Erro ao enviar ícone do WhatsApp');
    } finally {
      setIsUploadingHeroIcon(false);
      event.target.value = '';
    }
  };

  const handleRemoveHeroIcon = async () => {
    setIsUploadingHeroIcon(true);
    setSaveMessage('');
    try {
      const payload = { ...hero, cta_whatsapp_icon_url: null };
      await api.put('/cms/hero', payload);
      setHero(payload);
      setSaveMessage('Ícone do WhatsApp removido com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao remover ícone do WhatsApp:', error);
      setSaveMessage('Erro ao remover ícone do WhatsApp');
    } finally {
      setIsUploadingHeroIcon(false);
    }
  };

  const handleHeroMockupUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('mockup', file);
    setIsUploadingHeroMockup(true);
    setSaveMessage('');
    try {
      const { data } = await api.put('/cms/hero/mockup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setHero(prev => ({ ...prev, mockup_image_url: data.path }));
      setSaveMessage('Imagem do mockup atualizada com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao enviar mockup:', error);
      setSaveMessage('Erro ao enviar mockup do MacBook');
    } finally {
      setIsUploadingHeroMockup(false);
      event.target.value = '';
    }
  };

  const handleRemoveHeroMockup = async () => {
    setIsUploadingHeroMockup(true);
    setSaveMessage('');
    try {
      const payload = { ...hero, mockup_image_url: null };
      await api.put('/cms/hero', payload);
      setHero(payload);
      setSaveMessage('Mockup removido com sucesso!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Erro ao remover mockup:', error);
      setSaveMessage('Erro ao remover mockup');
    } finally {
      setIsUploadingHeroMockup(false);
    }
  };

  const handleSaveStatistic = async (id: number, data: any) => {
    try {
      await api.put(`/cms/statistics/${id}`, data);
      setSaveMessage('Estatística atualizada!');
      setTimeout(() => setSaveMessage(''), 3000);
      loadData();
    } catch (error) {
      setSaveMessage('Erro ao salvar estatística');
    }
  };

  const handleSaveService = async (id: number, data: any) => {
    try {
      if (id) {
        await api.put(`/cms/services/${id}`, data);
      } else {
        await api.post('/cms/services', data);
      }
      setSaveMessage('Serviço salvo!');
      setTimeout(() => setSaveMessage(''), 3000);
      loadData();
    } catch (error) {
      setSaveMessage('Erro ao salvar serviço');
    }
  };

  const handleDeleteService = async (id: number) => {
    if (confirm('Deseja realmente deletar este serviço?')) {
      try {
        await api.delete(`/cms/services/${id}`);
        setSaveMessage('Serviço deletado!');
        setTimeout(() => setSaveMessage(''), 3000);
        loadData();
      } catch (error) {
        setSaveMessage('Erro ao deletar serviço');
      }
    }
  };

  const tabs = [
    { id: 'config', label: 'Configurações Gerais', icon: Settings },
    { id: 'hero', label: 'Hero Section', icon: Layout },
    { id: 'statistics', label: 'Estatísticas', icon: TrendingUp },
    { id: 'services', label: 'Serviços', icon: Package },
    { id: 'steps', label: 'Como Funciona', icon: List }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Site Builder</h1>
          <p className="text-gray-600 mt-1">Gerencie todo o conteúdo da sua landing page</p>
        </div>
        <div className="flex gap-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Eye size={18} />
            Visualizar Site
          </a>
        </div>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`p-4 rounded-lg ${saveMessage.includes('Erro') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {saveMessage}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200 overflow-x-auto">
          <nav className="flex space-x-1 p-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#076AC2] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Configurações Gerais */}
          {activeTab === 'config' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Configurações Gerais</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Logo Principal
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {config.logo_url && (
                      <img
                        src={buildAssetUrl(config.logo_url)}
                        alt="Logo atual"
                        className="w-32 h-16 object-contain bg-white rounded-lg border"
                      />
                    )}
                    <div className="w-full">
                      <input
                        type="file"
                        accept=".png,.svg,.webp,.jpg,.jpeg,.ico,.gif"
                        onChange={handleLogoUpload}
                        disabled={isUploadingLogo}
                        className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-[#076AC2] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#055a9f]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Envie o logo principal em PNG, SVG, WEBP, JPG, JPEG, GIF ou ICO.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Favicon
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {config.favicon_url && (
                      <img
                        src={buildAssetUrl(config.favicon_url)}
                        alt="Favicon atual"
                        className="w-12 h-12 object-contain bg-white rounded-lg border"
                      />
                    )}
                    <div className="w-full">
                      <input
                        type="file"
                        accept=".png,.svg,.webp,.jpg,.jpeg,.ico,.gif"
                        onChange={handleFaviconUpload}
                        disabled={isUploadingFavicon}
                        className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-[#076AC2] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#055a9f]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Utilize um arquivo quadrado (recomendado 512x512) nos formatos suportados.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Logo do Rodapé
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {config.footer_logo_url && (
                      <img
                        src={buildAssetUrl(config.footer_logo_url)}
                        alt="Logo do rodapé atual"
                        className="w-32 h-16 object-contain bg-white rounded-lg border"
                      />
                    )}
                    <div className="w-full">
                      <input
                        type="file"
                        accept=".png,.svg,.webp,.jpg,.jpeg,.ico,.gif"
                        onChange={handleFooterLogoUpload}
                        disabled={isUploadingFooterLogo}
                        className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-[#076AC2] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#055a9f]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Ideal para a versão branca do logo utilizada no rodapé do site.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Primária
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.primary_color}
                      onChange={(e) => setConfig({ ...config, primary_color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cor Secundária
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={config.secondary_color}
                      onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                      className="w-16 h-10 rounded cursor-pointer"
                    />
                    <input
                      type="text"
                      value={config.secondary_color}
                      onChange={(e) => setConfig({ ...config, secondary_color: e.target.value })}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número WhatsApp
                  </label>
                  <input
                    type="text"
                    value={config.whatsapp_number}
                    onChange={(e) => setConfig({ ...config, whatsapp_number: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                    placeholder="5579991187607"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem WhatsApp
                  </label>
                  <input
                    type="text"
                    value={config.whatsapp_message}
                    onChange={(e) => setConfig({ ...config, whatsapp_message: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                    placeholder="Olá! Vim pelo site..."
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  E-mail de Contato
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mail Principal (Formulário de Contato)
                    </label>
                    <input
                      type="email"
                      value={config.contact_email}
                      onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      placeholder="contato@consultaplacaveicular.com.br"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Este e-mail receberá as mensagens do formulário de contato da landing page
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      E-mails em Cópia (CC)
                    </label>
                    <input
                      type="text"
                      value={config.contact_email_cc}
                      onChange={(e) => setConfig({ ...config, contact_email_cc: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      placeholder="email1@exemplo.com, email2@exemplo.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Adicione e-mails separados por vírgula para receber cópias das mensagens
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Título do Site (SEO)
                    </label>
                    <input
                      type="text"
                      value={config.seo_title}
                      onChange={(e) => setConfig({ ...config, seo_title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      placeholder="Consulta Placa Veicular - Rápido e Seguro"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Descrição (SEO)
                    </label>
                    <textarea
                      value={config.seo_description}
                      onChange={(e) => setConfig({ ...config, seo_description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent resize-none"
                      placeholder="Plataforma completa de consultas veiculares..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Palavras-chave (SEO)
                    </label>
                    <input
                      type="text"
                      value={config.seo_keywords}
                      onChange={(e) => setConfig({ ...config, seo_keywords: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      placeholder="consulta veicular, placa, chassi, renavam"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Aviso de Pagamentos Pix</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mensagem exibida na recarga de créditos
                  </label>
                  <textarea
                    value={config.pix_warning_message}
                    onChange={(e) => setConfig({ ...config, pix_warning_message: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent resize-none"
                    placeholder="Atenção: pagamentos via Pix não possuem estorno..."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Este aviso aparece acima do botão de gerar QR Code no painel de recarga. Utilize quebras de linha para destacar instruções.
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveConfig}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#076AC2] hover:bg-[#055a9f] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {isSaving ? 'Salvando...' : 'Salvar Configurações'}
                </button>
              </div>
            </div>
          )}

          {/* Hero Section */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Hero Section (Primeira Dobra)</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Título Principal
                  </label>
                  <input
                    type="text"
                    value={hero.title}
                    onChange={(e) => setHero({ ...hero, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                    placeholder="Consulte a placa e compre com mais segurança"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtítulo
                  </label>
                  <input
                    type="text"
                    value={hero.subtitle}
                    onChange={(e) => setHero({ ...hero, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                    placeholder="Consultas veiculares online"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={hero.description}
                    onChange={(e) => setHero({ ...hero, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent resize-none"
                    placeholder="Descubra histórico e alertas importantes antes de fechar negócio. Resultado em poucos segundos."
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto Botão Primário
                    </label>
                    <input
                      type="text"
                      value={hero.cta_primary_text}
                      onChange={(e) => setHero({ ...hero, cta_primary_text: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      placeholder="Consultar Placa"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Link Botão Primário
                    </label>
                    <input
                      type="text"
                      value={hero.cta_primary_link}
                      onChange={(e) => setHero({ ...hero, cta_primary_link: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      placeholder="/login"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Texto Botão WhatsApp
                    </label>
                    <input
                      type="text"
                      value={hero.cta_whatsapp_text}
                      onChange={(e) => setHero({ ...hero, cta_whatsapp_text: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      placeholder="Falar no WhatsApp"
                    />
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Mockup do MacBook</h3>
                  <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    {hero.mockup_image_url && (
                      <img
                        src={buildAssetUrl(hero.mockup_image_url)}
                        alt="Mockup MacBook"
                        className="w-32 h-20 object-contain bg-white rounded-lg border"
                      />
                    )}
                    <div>
                      <input
                        type="file"
                        accept=".png,.svg,.webp"
                        onChange={handleHeroMockupUpload}
                        disabled={isUploadingHeroMockup}
                        className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-[#076AC2] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#055a9f]"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Formatos permitidos: PNG, SVG, WEBP. Deixe vazio para usar o mockup padrão.
                      </p>
                    </div>
                    {hero.mockup_image_url && (
                      <button
                        type="button"
                        onClick={handleRemoveHeroMockup}
                        disabled={isUploadingHeroMockup}
                        className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-60"
                      >
                        Remover mockup
                      </button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradiente - Cor Inicial
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={hero.background_gradient_from}
                        onChange={(e) => setHero({ ...hero, background_gradient_from: e.target.value })}
                        className="w-16 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={hero.background_gradient_from}
                        onChange={(e) => setHero({ ...hero, background_gradient_from: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gradiente - Cor Final
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={hero.background_gradient_to}
                        onChange={(e) => setHero({ ...hero, background_gradient_to: e.target.value })}
                        className="w-16 h-10 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={hero.background_gradient_to}
                        onChange={(e) => setHero({ ...hero, background_gradient_to: e.target.value })}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-[#076AC2]" />
                  Ícone do botão WhatsApp
                </h3>
                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                  {hero.cta_whatsapp_icon_url && (
                    <img
                      src={buildAssetUrl(hero.cta_whatsapp_icon_url)}
                      alt="Ícone WhatsApp"
                      className="w-16 h-16 object-contain bg-white rounded-lg border"
                    />
                  )}
                  <div>
                    <input
                      type="file"
                      accept=".png,.svg,.webp"
                      onChange={handleHeroIconUpload}
                      disabled={isUploadingHeroIcon}
                      className="block w-full text-sm text-gray-900 file:mr-4 file:rounded-md file:border-0 file:bg-[#076AC2] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#055a9f]"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Formatos permitidos: PNG, SVG, WEBP.
                    </p>
                  </div>
                  {hero.cta_whatsapp_icon_url && (
                    <button
                      type="button"
                      onClick={handleRemoveHeroIcon}
                      disabled={isUploadingHeroIcon}
                      className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-60"
                    >
                      Remover ícone
                    </button>
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleSaveHero}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-[#076AC2] hover:bg-[#055a9f] text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
                >
                  <Save size={18} />
                  {isSaving ? 'Salvando...' : 'Salvar Hero'}
                </button>
              </div>
            </div>
          )}

          {/* Estatísticas */}
          {activeTab === 'statistics' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Estatísticas</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                {statistics.map((stat) => (
                  <div key={stat.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Número
                        </label>
                        <input
                          type="text"
                          value={stat.number}
                          onChange={(e) => {
                            const updated = statistics.map(s => 
                              s.id === stat.id ? { ...s, number: e.target.value } : s
                            );
                            setStatistics(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                          placeholder="50K+"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Label
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const updated = statistics.map(s => 
                              s.id === stat.id ? { ...s, label: e.target.value } : s
                            );
                            setStatistics(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                          placeholder="Clientes"
                        />
                      </div>
                      <button
                        onClick={() => handleSaveStatistic(stat.id, stat)}
                        className="w-full px-4 py-2 bg-[#076AC2] hover:bg-[#055a9f] text-white font-medium rounded-lg transition-colors"
                      >
                        Salvar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Serviços */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Serviços</h2>
                <button
                  onClick={() => {
                    const newService = {
                      id: null,
                      name: 'Novo Serviço',
                      description: '',
                      price: 0,
                      features: [],
                      is_highlighted: false,
                      highlight_label: '',
                      display_order: services.length
                    };
                    setServices([...services, newService]);
                  }}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                >
                  + Adicionar Serviço
                </button>
              </div>

              <div className="space-y-4">
                {services.map((service, index) => (
                  <div key={service.id || index} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Serviço
                        </label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[index].name = e.target.value;
                            setServices(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Preço (R$)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          value={service.price}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[index].price = parseFloat(e.target.value);
                            setServices(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={service.description}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].description = e.target.value;
                          setServices(updated);
                        }}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Recursos (um por linha)
                      </label>
                      <textarea
                        value={Array.isArray(service.features) ? service.features.join('\n') : ''}
                        onChange={(e) => {
                          const updated = [...services];
                          updated[index].features = e.target.value.split('\n').filter(f => f.trim());
                          setServices(updated);
                        }}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent resize-none"
                        placeholder="Recurso 1&#10;Recurso 2&#10;Recurso 3"
                      />
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={service.is_highlighted}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[index].is_highlighted = e.target.checked;
                            if (!e.target.checked) {
                              updated[index].highlight_label = '';
                            }
                            setServices(updated);
                          }}
                          className="w-4 h-4 text-[#076AC2] rounded focus:ring-[#076AC2]"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Destacar como "Mais Popular"
                        </span>
                      </label>
                    </div>

                    {service.is_highlighted && (
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Texto do selo destacado
                        </label>
                        <input
                          type="text"
                          value={service.highlight_label || ''}
                          onChange={(e) => {
                            const updated = [...services];
                            updated[index].highlight_label = e.target.value;
                            setServices(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                          placeholder="Ex: Plano de crescimento"
                        />
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        onClick={() => handleSaveService(service.id, service)}
                        className="flex-1 px-4 py-2 bg-[#076AC2] hover:bg-[#055a9f] text-white font-medium rounded-lg transition-colors"
                      >
                        Salvar
                      </button>
                      {service.id && (
                        <button
                          onClick={() => handleDeleteService(service.id)}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                        >
                          Deletar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Como Funciona (Steps) */}
          {activeTab === 'steps' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Como Funciona (Passos)</h2>
              
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <div key={step.id} className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-10 h-10 bg-[#076AC2] text-white rounded-full flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900">Passo {index + 1}</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Ícone
                        </label>
                        <select
                          value={step.icon}
                          onChange={(e) => {
                            const updated = steps.map(s => 
                              s.id === step.id ? { ...s, icon: e.target.value } : s
                            );
                            setSteps(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                        >
                          <option value="user-plus">user-plus</option>
                          <option value="search">search</option>
                          <option value="download">download</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Título
                        </label>
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => {
                            const updated = steps.map(s => 
                              s.id === step.id ? { ...s, title: e.target.value } : s
                            );
                            setSteps(updated);
                          }}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        value={step.description}
                        onChange={(e) => {
                          const updated = steps.map(s => 
                            s.id === step.id ? { ...s, description: e.target.value } : s
                          );
                          setSteps(updated);
                        }}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#076AC2] focus:border-transparent resize-none"
                      />
                    </div>

                    <button
                      onClick={async () => {
                        try {
                          await api.put(`/cms/steps/${step.id}`, step);
                          setSaveMessage('Passo atualizado!');
                          setTimeout(() => setSaveMessage(''), 3000);
                        } catch (error) {
                          setSaveMessage('Erro ao salvar passo');
                        }
                      }}
                      className="w-full px-4 py-2 bg-[#076AC2] hover:bg-[#055a9f] text-white font-medium rounded-lg transition-colors"
                    >
                      Salvar Passo
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SiteBuilder;

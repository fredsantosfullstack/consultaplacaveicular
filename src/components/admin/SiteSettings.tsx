import React, { useCallback, useEffect, useState } from 'react';
import { Save, Upload } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';
import { buildAssetUrl } from '../../utils/assetUrl';

const DEFAULT_WHATSAPP_MESSAGE = 'Olá! Vim pelo painel e preciso de suporte.';
const DEFAULT_FOOTER_MESSAGE = 'Desenvolvido por Agência DiPixel | (79) 98149-9282';

type UploadKey = 'logo_menu_url' | 'logo_login_url' | 'favicon_url';

interface FileUploadFieldProps {
  label: string;
  id: string;
  currentValue?: string | null;
  onFileChange: (file: File) => void;
  accept?: string;
  isUploading?: boolean;
}

interface ToggleFieldProps {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

interface InputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}

interface TextareaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  helperText?: string;
}

const ToggleField: React.FC<ToggleFieldProps> = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-3">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="h-4 w-4 rounded border-gray-300 text-[#076AC2] focus:ring-[#076AC2]"
    />
    <span className="text-sm text-gray-700">{label}</span>
  </label>
);

const InputField: React.FC<InputFieldProps> = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#076AC2] focus:ring-[#076AC2]"
    />
  </div>
);

const TextareaField: React.FC<TextareaFieldProps> = ({ label, name, value, onChange, helperText }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      rows={3}
      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-[#076AC2] focus:ring-[#076AC2]"
    />
    {helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
  </div>
);

const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  id,
  currentValue,
  onFileChange,
  accept = 'image/*',
  isUploading
}) => (
  <div>
    <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
    <div
      className="mt-1 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-5 transition hover:bg-gray-50"
      onClick={() => document.getElementById(`${id}-input`)?.click()}
    >
      <input
        type="file"
        id={`${id}-input`}
        className="hidden"
        accept={accept}
        onChange={(e) => e.target.files && onFileChange(e.target.files[0])}
      />
      {currentValue ? (
        <div className="w-full space-y-2 text-center">
          <img src={buildAssetUrl(currentValue)} alt={label} className="h-24 w-full object-contain" />
          <span className="text-xs font-medium text-[#076AC2]">Trocar arquivo</span>
        </div>
      ) : (
        <div className="space-y-1 text-center">
          {isUploading ? (
            <div className="text-xs text-gray-500">Enviando...</div>
          ) : (
            <>
              <Upload className="mx-auto h-10 w-10 text-gray-400" />
              <p className="text-xs text-gray-600">Clique para enviar</p>
            </>
          )}
        </div>
      )}
    </div>
  </div>
);

const SiteSettings: React.FC = () => {
  const { profile } = useAuth();
  const { refreshSettings } = useSiteSettings();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    recovery_email: ''
  });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [appearance, setAppearance] = useState<Record<UploadKey, string>>({
    logo_menu_url: '',
    logo_login_url: '',
    favicon_url: ''
  });
  const [seoData, setSeoData] = useState({
    seo_title: '',
    seo_description: '',
    seo_keywords: ''
  });
  const [whatsappSettings, setWhatsappSettings] = useState({
    enabled: false,
    phone: '',
    message: DEFAULT_WHATSAPP_MESSAGE
  });
  const [footerSettings, setFooterSettings] = useState({
    enabled: false,
    message: DEFAULT_FOOTER_MESSAGE
  });
  const [mercadoPagoSettings, setMercadoPagoSettings] = useState({
    accessToken: ''
  });
  const [isUploading, setIsUploading] = useState<Record<UploadKey, boolean>>({
    logo_menu_url: false,
    logo_login_url: false,
    favicon_url: false
  });
  const [isSaving, setIsSaving] = useState<Record<string, boolean>>({});

  const loadSettings = useCallback(async () => {
    try {
      const response = await api.get('/settings');
      const data = response.data || {};

      setAppearance({
        logo_menu_url: data.logo_menu_url || '',
        logo_login_url: data.logo_login_url || '',
        favicon_url: data.favicon_url || ''
      });

      setSeoData({
        seo_title: data.seo_title || '',
        seo_description: data.seo_description || '',
        seo_keywords: data.seo_keywords || ''
      });

      setWhatsappSettings({
        enabled: data.whatsapp_enabled === 'true',
        phone: data.whatsapp_phone || '',
        message: data.whatsapp_message || DEFAULT_WHATSAPP_MESSAGE
      });

      setFooterSettings({
        enabled: data.footer_enabled === 'true',
        message: data.footer_message || ''
      });

      setMercadoPagoSettings({
        accessToken: data.mercado_pago_access_token || ''
      });
    } catch (error) {
      console.error('Erro ao carregar configurações do site:', error);
    }
  }, []);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        recovery_email: profile.recovery_email || ''
      });
    }
  }, [profile]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (
    file: File,
    endpoint: string,
    fieldName: string,
    previewKey: UploadKey
  ) => {
    if (!file) return;

    const payload = new FormData();
    payload.append(fieldName, file);

    setIsUploading((prev) => ({ ...prev, [previewKey]: true }));
    try {
      const response = await api.put(`/settings/${endpoint}`, payload, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAppearance((prev) => ({ ...prev, [previewKey]: response.data.path }));
      await refreshSettings();
      alert('Arquivo enviado com sucesso!');
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro ao enviar arquivo.');
    } finally {
      setIsUploading((prev) => ({ ...prev, [previewKey]: false }));
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', formData);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao atualizar perfil.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/auth/change-password', passwordData);
      alert('Senha alterada com sucesso!');
      setPasswordData({ currentPassword: '', newPassword: '' });
    } catch (error) {
      alert('Erro ao alterar senha. Confira a senha atual.');
    }
  };

  const handleSeoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSeoData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSeoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, seo: true }));
    try {
      await api.post('/settings', seoData);
      await refreshSettings();
      alert('Configurações de SEO salvas!');
    } catch (error) {
      console.error('Erro ao salvar SEO:', error);
      alert('Não foi possível salvar o SEO.');
    } finally {
      setIsSaving((prev) => ({ ...prev, seo: false }));
    }
  };

  const handleWhatsappSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, whatsapp: true }));

    const phoneSanitized = whatsappSettings.phone.replace(/[^0-9]/g, '');
    if (whatsappSettings.enabled && phoneSanitized.length < 11) {
      alert('Informe um número de WhatsApp válido com DDI + DDD.');
      setIsSaving((prev) => ({ ...prev, whatsapp: false }));
      return;
    }

    try {
      await api.post('/settings', {
        whatsapp_enabled: whatsappSettings.enabled ? 'true' : 'false',
        whatsapp_phone: phoneSanitized,
        whatsapp_message: whatsappSettings.message
      });
      await refreshSettings();
      alert('Configurações do WhatsApp salvas!');
    } catch (error) {
      console.error('Erro ao salvar WhatsApp:', error);
      alert('Não foi possível salvar o WhatsApp.');
    } finally {
      setIsSaving((prev) => ({ ...prev, whatsapp: false }));
    }
  };

  const handleFooterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, footer: true }));
    const payload = {
      footer_enabled: footerSettings.enabled ? 'true' : 'false',
      footer_message: footerSettings.message
    };
    console.log('Enviando footer settings:', payload);
    try {
      await api.post('/settings', payload);
      console.log('Footer settings salvo, refreshing...');
      await refreshSettings();
      alert('Rodapé salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar rodapé:', error);
      alert('Não foi possível salvar o rodapé.');
    } finally {
      setIsSaving((prev) => ({ ...prev, footer: false }));
    }
  };

  const handleMercadoPagoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving((prev) => ({ ...prev, mercadopago: true }));
    try {
      await api.post('/settings', {
        mercado_pago_access_token: mercadoPagoSettings.accessToken
      });
      await refreshSettings();
      alert('Access Token do Mercado Pago salvo com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar Mercado Pago:', error);
      alert('Não foi possível salvar o Access Token do Mercado Pago.');
    } finally {
      setIsSaving((prev) => ({ ...prev, mercadopago: false }));
    }
  };

  return (
    <div className="space-y-8">
      <form onSubmit={handleProfileSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800">Dados da Conta</h2>
        <InputField label="Nome Completo" name="name" value={formData.name} onChange={handleProfileChange} />
        <InputField
          label="Email de Acesso"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleProfileChange}
        />
        <div>
          <InputField
            label="Email de Recuperação*"
            name="recovery_email"
            type="email"
            value={formData.recovery_email}
            onChange={handleProfileChange}
          />
          <p className="mt-1 text-xs text-gray-500">*Para receber o link de recuperação de senha.</p>
        </div>
        <div>
          <InputField label="Telefone*" name="phone" value={formData.phone} onChange={handleProfileChange} />
          <p className="mt-1 text-xs text-gray-500">*Para receber SMS ou códigos de validação.</p>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="rounded-lg bg-[#076AC2] px-6 py-2 font-bold text-white">
            Salvar Dados
          </button>
        </div>
      </form>

      <form onSubmit={handlePasswordSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-lg">
        <h2 className="text-xl font-bold text-gray-800">Segurança</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <InputField
            label="Senha Atual"
            name="currentPassword"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          <InputField
            label="Nova Senha"
            name="newPassword"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="rounded-lg bg-[#076AC2] px-6 py-2 font-bold text-white">
            Alterar Senha
          </button>
        </div>
      </form>

      <div className="rounded-xl bg-white p-6 shadow-lg">
        <h2 className="mb-4 text-xl font-bold text-gray-800">Aparência do Site</h2>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <FileUploadField
            label="Logo do Menu"
            id="logo-menu"
            currentValue={appearance.logo_menu_url}
            isUploading={isUploading.logo_menu_url}
            onFileChange={(file) => handleFileChange(file, 'logo-menu', 'logo', 'logo_menu_url')}
          />
          <FileUploadField
            label="Logo da Tela de Login"
            id="logo-login"
            currentValue={appearance.logo_login_url}
            isUploading={isUploading.logo_login_url}
            onFileChange={(file) => handleFileChange(file, 'logo-login', 'logo', 'logo_login_url')}
          />
          <FileUploadField
            label="Favicon"
            id="favicon"
            currentValue={appearance.favicon_url}
            accept=".ico,image/png"
            isUploading={isUploading.favicon_url}
            onFileChange={(file) => handleFileChange(file, 'favicon', 'favicon', 'favicon_url')}
          />
        </div>
      </div>

      <form onSubmit={handleSeoSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">SEO e Metadados</h2>
          <p className="text-sm text-gray-500">Controle o título e as descrições usadas pelos buscadores.</p>
        </div>
        <InputField
          label="Título da Página (SEO Title)"
          name="seo_title"
          value={seoData.seo_title}
          onChange={handleSeoChange}
        />
        <TextareaField
          label="Descrição (Meta Description)"
          name="seo_description"
          value={seoData.seo_description}
          onChange={handleSeoChange}
          helperText="Recomendado até 160 caracteres."
        />
        <TextareaField
          label="Palavras-chave (Meta Keywords)"
          name="seo_keywords"
          value={seoData.seo_keywords}
          onChange={handleSeoChange}
          helperText="Separe cada palavra por vírgula."
        />
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#076AC2] px-6 py-2 font-bold text-white disabled:opacity-60"
            disabled={isSaving.seo}
          >
            <Save size={18} />
            {isSaving.seo ? 'Salvando...' : 'Salvar SEO'}
          </button>
        </div>
      </form>

      <form onSubmit={handleWhatsappSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">Botão Flutuante do WhatsApp</h2>
          <p className="text-sm text-gray-500">Ative um canal rápido com os clientes.</p>
        </div>
        <ToggleField
          label="Exibir botão de WhatsApp"
          checked={whatsappSettings.enabled}
          onChange={(checked) => setWhatsappSettings((prev) => ({ ...prev, enabled: checked }))}
        />
        <InputField
          label="Telefone com DDI (somente números)"
          name="whatsapp_phone"
          value={whatsappSettings.phone}
          onChange={(e) =>
            setWhatsappSettings((prev) => ({ ...prev, phone: e.target.value.replace(/[^0-9]/g, '') }))
          }
        />
        <TextareaField
          label="Mensagem padrão"
          name="whatsapp_message"
          value={whatsappSettings.message}
          onChange={(e) => setWhatsappSettings((prev) => ({ ...prev, message: e.target.value }))}
          helperText="Texto que aparece automaticamente ao abrir a conversa."
        />
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#076AC2] px-6 py-2 font-bold text-white disabled:opacity-60"
            disabled={isSaving.whatsapp}
          >
            <Save size={18} />
            {isSaving.whatsapp ? 'Salvando...' : 'Salvar WhatsApp'}
          </button>
        </div>
      </form>

      <form onSubmit={handleFooterSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-lg">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-gray-800">Rodapé / Copyright</h2>
          <p className="text-sm text-gray-500">Controle a mensagem exibida no final do painel.</p>
        </div>
        <ToggleField
          label="Mostrar mensagem de copyright"
          checked={footerSettings.enabled}
          onChange={(checked) => setFooterSettings((prev) => ({ ...prev, enabled: checked }))}
        />
        <TextareaField
          label="Texto do rodapé"
          name="footer_message"
          value={footerSettings.message}
          onChange={(e) => setFooterSettings((prev) => ({ ...prev, message: e.target.value }))}
          helperText="Ex.: Desenvolvido por Consultaplacaveicular."
        />
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#076AC2] px-6 py-2 font-bold text-white disabled:opacity-60"
            disabled={isSaving.footer}
          >
            <Save size={18} />
            {isSaving.footer ? 'Salvando...' : 'Salvar Rodapé'}
          </button>
        </div>
      </form>

      <form onSubmit={handleMercadoPagoSubmit} className="space-y-4 rounded-xl bg-white p-6 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Mercado Pago - Pagamentos PIX</h2>
          <p className="text-sm text-gray-500">Configure o Access Token para processar pagamentos via PIX.</p>
        </div>
        
        <div>
          <InputField
            label="Access Token"
            name="mercado_pago_access_token"
            type="password"
            value={mercadoPagoSettings.accessToken}
            onChange={(e) => setMercadoPagoSettings((prev) => ({ ...prev, accessToken: e.target.value }))}
            placeholder="APP_USR-5634477360905357-010208-..."
          />
        </div>

        <div className="rounded-lg bg-blue-50 p-4">
          <p className="text-sm text-gray-700">
            <strong>📌 Como obter o Access Token:</strong>
          </p>
          <ol className="mt-2 space-y-1 text-sm text-gray-700">
            <li>1. Acesse: <a
              href="https://www.mercadopago.com.br/developers/panel/credentials"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#076AC2] hover:underline"
            >
              Mercado Pago Developers
            </a></li>
            <li>2. Escolha <strong>API de Pagamentos</strong></li>
            <li>3. Copie o <strong>Access Token</strong> (produção ou teste)</li>
            <li>4. Cole aqui e salve</li>
          </ol>
          <p className="mt-3 text-xs text-gray-600">
            ⚠️ <strong>Credenciais de Teste:</strong> Para desenvolvimento<br/>
            ✅ <strong>Credenciais de Produção:</strong> Para receber pagamentos reais
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-lg bg-[#076AC2] px-6 py-2 font-bold text-white disabled:opacity-60"
            disabled={isSaving.mercadopago}
          >
            <Save size={18} />
            {isSaving.mercadopago ? 'Salvando...' : 'Salvar Access Token'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettings;

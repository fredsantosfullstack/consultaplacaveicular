import React, { useState, useEffect } from 'react';
import { Save, Upload } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const SiteSettings: React.FC = () => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', recovery_email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '' });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        recovery_email: profile.recovery_email || '',
      });
    }
  }, [profile]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (file: File, endpoint: string, fieldName: string) => {
    if (!file) return;
    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      await api.put(`/settings/${endpoint}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Arquivo enviado com sucesso!');
      window.location.reload(); // Simplest way to see changes
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Erro no upload.');
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
      alert('Erro ao alterar senha. Verifique sua senha atual.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Seção de Dados da Conta */}
      <form onSubmit={handleProfileSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Dados da Conta</h2>
        <InputField label="Nome Completo" name="name" value={formData.name} onChange={handleProfileChange} />
        <InputField label="Email de Acesso" name="email" type="email" value={formData.email} onChange={handleProfileChange} />
        <div>
          <InputField label="Email de Recuperação*" name="recovery_email" type="email" value={formData.recovery_email} onChange={handleProfileChange} />
          <p className="mt-1 text-xs text-gray-500">*Para receber o link de recuperação de senha.</p>
        </div>
        <div>
          <InputField label="Telefone*" name="phone" value={formData.phone} onChange={handleProfileChange} />
          <p className="mt-1 text-xs text-gray-500">*Para receber SMS ou códigos de validação.</p>
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-[#000042] text-white font-bold py-2 px-6 rounded-lg">Salvar Dados</button>
        </div>
      </form>

      {/* Seção de Segurança */}
      <form onSubmit={handlePasswordSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Segurança</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField label="Senha Atual" name="currentPassword" type="password" value={passwordData.currentPassword} onChange={handlePasswordChange} />
          <InputField label="Nova Senha" name="newPassword" type="password" value={passwordData.newPassword} onChange={handlePasswordChange} />
        </div>
        <div className="flex justify-end pt-2">
          <button type="submit" className="bg-[#000042] text-white font-bold py-2 px-6 rounded-lg">Alterar Senha</button>
        </div>
      </form>

      {/* Seção de Aparência (Logos) - Mantida */}
      <div className="bg-white p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Aparência do Site</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FileUploadField label="Logo do Menu" id="logo-menu" onFileChange={(file) => handleFileChange(file, 'logo-menu', 'logo')} />
          <FileUploadField label="Logo do Login" id="logo-login" onFileChange={(file) => handleFileChange(file, 'logo-login', 'logo')} />
          <FileUploadField label="Favicon" id="favicon" accept=".ico,image/png" onFileChange={(file) => handleFileChange(file, 'favicon', 'favicon')} />
        </div>
      </div>
    </div>
  );
};


export default SiteSettings;

const InputField = ({ label, name, value, onChange, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input type={type} id={name} name={name} value={value} onChange={onChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
  </div>
);

const FileUploadField = ({ label, id, onFileChange, accept = "image/*" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <div className="mt-1 flex items-center justify-center px-6 py-5 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:bg-gray-50" onClick={() => document.getElementById(`${id}-input`)?.click()}>
      <input type="file" id={`${id}-input`} className="hidden" accept={accept} onChange={(e) => e.target.files && onFileChange(e.target.files[0])} />
      <div className="space-y-1 text-center">
        <Upload className="mx-auto h-10 w-10 text-gray-400" />
        <p className="text-xs text-gray-600">Clique para enviar</p>
      </div>
    </div>
  </div>
);

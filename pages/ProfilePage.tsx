import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../src/contexts/AuthContext';
import api from '../src/services/api';
import UserLayout from '../src/layouts/UserLayout';
import FormField from '../src/components/common/FormField';
import { Loader2, Edit, Save, X, Key, User, Mail, Phone, FileText, Building, Camera } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (newPassword !== confirmPassword) {
      setError('A nova senha e a confirmação não coincidem.');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);
    try {
      await api.put('/auth/change-password', { currentPassword, newPassword });
      setSuccess('Senha alterada com sucesso!');
      setTimeout(() => {
        onClose();
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setSuccess('');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'Erro ao alterar senha.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50" onClick={onClose}>
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Alterar Senha</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
          {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{success}</div>}
          
          <FormField
            id="currentPassword"
            label="Senha Atual"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            icon={Key}
            required
          />
          
          <FormField
            id="newPassword"
            label="Nova Senha (mín. 6 dígitos)"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            icon={Key}
            required
          />
          
          <FormField
            id="confirmPassword"
            label="Confirmar Nova Senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Key}
            required
          />
          
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#076AC2] text-white rounded-lg hover:bg-[#055a9f] transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading && <Loader2 className="animate-spin" size={16} />}
              Alterar Senha
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { profile, updateProfile, isLoading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    document_number: '',
    company: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isChangePasswordOpen, setChangePasswordOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        document_number: profile.document_number || '',
        company: profile.company || '',
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validação do arquivo
      if (file.size > 5 * 1024 * 1024) { // 5MB
        alert('O arquivo deve ter no máximo 5MB.');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.');
        return;
      }

      const avatarFormData = new FormData();
      avatarFormData.append('avatar', file);
      
      setIsUploading(true);
      try {
        const response = await api.put('/users/avatar', avatarFormData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        updateProfile({ avatar_url: response.data.avatar_url });
      } catch (error) {
        console.error('Erro ao fazer upload:', error);
        alert('Erro ao fazer upload da foto. Tente novamente.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.put('/auth/profile', formData);
      updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      alert('Erro ao salvar o perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        document_number: profile.document_number || '',
        company: profile.company || '',
      });
    }
    setIsEditing(false);
  };

  const getAvatarUrl = () => {
    if (profile?.avatar) {
      return `http://localhost:3001${profile.avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.name || 'User')}&background=076AC2&color=fff&size=128`;
  };

  if (authLoading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center p-10">
          <Loader2 className="animate-spin text-[#076AC2]" size={48} />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header com Avatar e Informações Básicas */}
        <div className="bg-gradient-to-r from-[#076AC2] to-[#055a9f] p-8 text-white">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={getAvatarUrl()}
                alt="Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-white/20"
              />
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-yellow-400 p-2 rounded-full text-black hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="animate-spin" size={16} /> : <Camera size={16} />}
              </button>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{profile?.name || 'Usuário'}</h1>
              <p className="text-white/80">{profile?.email}</p>
              <p className="text-white/60 text-sm mt-1">
                Membro desde {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('pt-BR') : '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800">Informações Pessoais</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 bg-[#076AC2] text-white px-4 py-2 rounded-lg hover:bg-[#055a9f] transition-colors"
              >
                <Edit size={16} />
                Editar Perfil
              </button>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                  Salvar
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X size={16} />
                  Cancelar
                </button>
              </div>
            )}
          </div>

          {/* Campos do Perfil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {isEditing ? (
              <>
                <FormField
                  id="name"
                  label="Nome Completo"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  icon={User}
                  required
                />
                <FormField
                  id="email"
                  label="Seu melhor e-mail"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  icon={Mail}
                  required
                />
                <FormField
                  id="phone"
                  label="(XX) XXXXX-XXXX"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  icon={Phone}
                />
                <FormField
                  id="document_number"
                  label="Número do CPF/CNPJ"
                  type="text"
                  value={formData.document_number}
                  onChange={handleInputChange}
                  icon={FileText}
                />
                <div className="md:col-span-2">
                  <FormField
                    id="company"
                    label="Nome da Empresa"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    icon={Building}
                  />
                </div>
              </>
            ) : (
              <>
                <InfoField label="Nome Completo" value={profile?.name} />
                <InfoField label="E-mail" value={profile?.email} />
                <InfoField label="Telefone" value={profile?.phone} />
                <InfoField label="CPF/CNPJ" value={profile?.document_number} />
                <InfoField label="Empresa" value={profile?.company} />
              </>
            )}
          </div>

          {/* Botão Alterar Senha */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setChangePasswordOpen(true)}
              className="flex items-center gap-2 bg-[#076AC2] text-white px-6 py-3 rounded-lg hover:bg-[#055a9f] transition-colors"
            >
              <Key size={18} />
              Alterar Senha
            </button>
          </div>
        </div>
      </div>

      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setChangePasswordOpen(false)}
      />
    </UserLayout>
  );
};

const InfoField: React.FC<{ label: string; value?: string }> = ({ label, value }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-500">{label}</label>
    <p className="text-lg font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-md">
      {value || '-'}
    </p>
  </div>
);

export default ProfilePage;

import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../../services/api';
import AdminModal from './AdminModal';

interface Term {
  id: number;
  title: string;
  content: string;
  version: string;
  is_active: boolean;
  created_by_name: string;
  created_at: string;
  updated_at: string;
}

const TermsManagement: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentTerm, setCurrentTerm] = useState<Partial<Term>>({
    title: '',
    content: '',
    version: '1.0',
    is_active: false
  });

  useEffect(() => {
    fetchTerms();
  }, []);

  const fetchTerms = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/terms');
      setTerms(response.data);
    } catch (error) {
      console.error('Erro ao buscar termos:', error);
      setError('Erro ao carregar termos.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (term: Term | null) => {
    if (term) {
      setModalMode('edit');
      setCurrentTerm(term);
    } else {
      setModalMode('add');
      setCurrentTerm({
        title: '',
        content: '',
        version: '1.0',
        is_active: false
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentTerm({
      title: '',
      content: '',
      version: '1.0',
      is_active: false
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalMode === 'add') {
        await api.post('/terms', currentTerm);
      } else {
        await api.put(`/terms/${currentTerm.id}`, currentTerm);
      }
      fetchTerms();
      handleCloseModal();
    } catch (error: any) {
      console.error('Erro ao salvar termo:', error);
      alert(error.response?.data?.msg || 'Erro ao salvar termo.');
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await api.patch(`/terms/${id}/toggle`);
      fetchTerms();
    } catch (error: any) {
      console.error('Erro ao alternar status:', error);
      alert(error.response?.data?.msg || 'Erro ao alternar status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este termo?')) return;
    
    try {
      await api.delete(`/terms/${id}`);
      fetchTerms();
    } catch (error: any) {
      console.error('Erro ao excluir termo:', error);
      alert(error.response?.data?.msg || 'Erro ao excluir termo.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Termos de Uso</h2>
        <p className="text-gray-500 mt-1">Crie e gerencie os termos de uso do sistema.</p>
      </div>

      <div className="mb-4">
        <button
          onClick={() => handleOpenModal(null)}
          className="bg-[#076AC2] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
        >
          <Plus size={18} />
          Adicionar Termo
        </button>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center p-10">
          <Loader2 className="animate-spin" size={48} />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <>
          <AdminModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            title={modalMode === 'add' ? 'Adicionar Novo Termo' : 'Editar Termo'}
          >
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={currentTerm.title || ''}
                  onChange={(e) => setCurrentTerm({ ...currentTerm, title: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>

              <div>
                <label htmlFor="version" className="block text-sm font-medium text-gray-700">
                  Versão
                </label>
                <input
                  type="text"
                  id="version"
                  value={currentTerm.version || ''}
                  onChange={(e) => setCurrentTerm({ ...currentTerm, version: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Ex: 1.0, 2.0"
                  required
                />
              </div>

              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                  Conteúdo
                </label>
                <textarea
                  id="content"
                  value={currentTerm.content || ''}
                  onChange={(e) => setCurrentTerm({ ...currentTerm, content: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={15}
                  placeholder="Cole aqui o texto dos termos de uso..."
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={currentTerm.is_active || false}
                  onChange={(e) => setCurrentTerm({ ...currentTerm, is_active: e.target.checked })}
                  className="h-4 w-4 text-[#076AC2] focus:ring-[#076AC2] border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">
                  Ativar este termo (desativa os outros automaticamente)
                </label>
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#076AC2] text-white rounded-lg hover:bg-opacity-90"
                >
                  {modalMode === 'add' ? 'Adicionar' : 'Salvar'}
                </button>
              </div>
            </form>
          </AdminModal>

          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">Título</th>
                  <th className="py-3 px-4 text-left">Versão</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Criado por</th>
                  <th className="py-3 px-4 text-left">Data</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {terms.map((term) => (
                  <tr key={term.id} className="border-b">
                    <td className="py-3 px-4 font-medium">{term.title}</td>
                    <td className="py-3 px-4">{term.version}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          term.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {term.is_active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{term.created_by_name}</td>
                    <td className="py-3 px-4">
                      {new Date(term.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => handleToggleActive(term.id)}
                          title={term.is_active ? 'Desativar' : 'Ativar'}
                          className={`${
                            term.is_active ? 'text-orange-600 hover:text-orange-800' : 'text-green-600 hover:text-green-800'
                          }`}
                        >
                          {term.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <button
                          onClick={() => handleOpenModal(term)}
                          title="Editar"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(term.id)}
                          title="Excluir"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default TermsManagement;

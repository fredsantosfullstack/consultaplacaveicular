import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Pause, Car, FileText, ShieldCheck, User, Search, ChevronUp, ChevronDown } from 'lucide-react';
import api from '../../services/api'; // Importa a instância do Axios
import AdminModal from './AdminModal';

interface Consultation {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  price: number;
  is_new: boolean;
  is_active: boolean;
  display_order?: number;
}

const ConsultationManagement: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentConsultation, setCurrentConsultation] = useState<Partial<Consultation>>({});

  const availableIcons = {
    Car,
    FileText,
    ShieldCheck,
    User,
    Search
  };

  const fetchConsultations = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/consultations/all');
      setConsultations(response.data);
    } catch (err: any) {
      setError('Falha ao buscar as consultas.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConsultations();
  }, []);

  const handleOpenModal = (mode: 'add' | 'edit', consultation: Consultation | null = null) => {
    setModalMode(mode);
    setCurrentConsultation(consultation || { name: '', description: '', price: 0, is_new: false, is_active: true });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentConsultation({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = modalMode === 'add' ? 'post' : 'put';
    const url = modalMode === 'add' ? '/consultations' : `/consultations/${currentConsultation.id}`;

    try {
      await api[method](url, currentConsultation);
      handleCloseModal();
      fetchConsultations(); // Re-fetch para atualizar a lista
    } catch (error) {
      console.error('Falha ao salvar consulta', error);
      // Adicionar feedback de erro para o usuário aqui
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir esta consulta?')) return;
    try {
      await api.delete(`/consultations/${id}`);
      fetchConsultations();
    } catch (error) {
      console.error('Falha ao excluir consulta', error);
    }
  };

  const handleToggleActive = async (consultation: Consultation) => {
    try {
      await api.put(`/consultations/${consultation.id}`, { ...consultation, is_active: !consultation.is_active });
      fetchConsultations();
    } catch (error) {
    }
  };

  const handleMoveUp = async (index: number) => {
    if (index === 0) return; // Já está no topo
    
    const newConsultations = [...consultations];
    const temp = newConsultations[index];
    newConsultations[index] = newConsultations[index - 1];
    newConsultations[index - 1] = temp;
    
    // Atualizar display_order
    try {
      await api.put(`/consultations/${newConsultations[index].id}/order`, { display_order: index + 1 });
      await api.put(`/consultations/${newConsultations[index - 1].id}/order`, { display_order: index });
      setConsultations(newConsultations);
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      fetchConsultations(); // Recarregar em caso de erro
    }
  };

  const handleMoveDown = async (index: number) => {
    if (index === consultations.length - 1) return; // Já está no final
    
    const newConsultations = [...consultations];
    const temp = newConsultations[index];
    newConsultations[index] = newConsultations[index + 1];
    newConsultations[index + 1] = temp;
    
    // Atualizar display_order
    try {
      await api.put(`/consultations/${newConsultations[index].id}/order`, { display_order: index + 1 });
      await api.put(`/consultations/${newConsultations[index + 1].id}/order`, { display_order: index + 2 });
      setConsultations(newConsultations);
    } catch (error) {
      console.error('Erro ao reordenar:', error);
      fetchConsultations(); // Recarregar em caso de erro
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Gerenciar Tipos de Consulta</h2>
        <p className="text-gray-500 mt-1">Edite os tipos de consulta disponíveis para os usuários.</p>
      </div>

      {isLoading && <p>Carregando...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!isLoading && !error && consultations.length > 0 && (
        <div className="overflow-x-auto">
          <AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalMode === 'add' ? 'Adicionar Nova Consulta' : 'Editar Consulta'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome da Consulta</label>
                <input type="text" id="name" value={currentConsultation.name || ''} onChange={(e) => setCurrentConsultation(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#000042] focus:border-[#000042] sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição</label>
                <textarea id="description" value={currentConsultation.description || ''} onChange={(e) => setCurrentConsultation(prev => ({ ...prev, description: e.target.value }))} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#000042] focus:border-[#000042] sm:text-sm"></textarea>
              </div>
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-gray-700">Ícone</label>
                <div className="mt-2 flex items-center gap-4">
                  {Object.entries(availableIcons).map(([name, IconComponent]) => (
                    <button 
                      type="button"
                      key={name}
                      onClick={() => setCurrentConsultation(prev => ({ ...prev, icon: name }))}
                      className={`p-2 rounded-full transition-colors duration-200 ${currentConsultation.icon === name ? 'bg-[#000042] text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'}`}
                      title={name}
                    >
                      <IconComponent size={20} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <input type="number" id="price" value={currentConsultation.price || 0} onChange={(e) => setCurrentConsultation(prev => ({ ...prev, price: parseFloat(e.target.value) }))} step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#000042] focus:border-[#000042] sm:text-sm" required />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Marcar como 'NOVO'?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={currentConsultation.is_new || false} onChange={(e) => setCurrentConsultation(prev => ({ ...prev, is_new: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#000042]/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#000042]"></div>
                </label>
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-[#000042] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Salvar</button>
              </div>
            </form>
          </AdminModal>
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-center">Ordem</th>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Preço</th>
                <th className="py-3 px-4 text-center">Tag 'NOVO'</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {consultations.map((consult, index) => (
                <tr key={consult.id} className="border-b">
                  <td className="py-3 px-4 text-center">
                    <div className="flex gap-1 justify-center">
                      <button 
                        onClick={() => handleMoveUp(index)} 
                        disabled={index === 0}
                        title="Mover para cima"
                        className={`p-1 rounded ${index === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <ChevronUp size={18} />
                      </button>
                      <button 
                        onClick={() => handleMoveDown(index)} 
                        disabled={index === consultations.length - 1}
                        title="Mover para baixo"
                        className={`p-1 rounded ${index === consultations.length - 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
                      >
                        <ChevronDown size={18} />
                      </button>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-medium">{consult.name}</td>
                  <td className="py-3 px-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(consult.price)}</td>
                  <td className="py-3 px-4 text-center">{consult.is_new ? 'Sim' : 'Não'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${consult.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {consult.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-4 justify-end">
                      <button onClick={() => handleToggleActive(consult)} title={consult.is_active ? 'Pausar' : 'Ativar'}>
                        {consult.is_active ? <Pause size={18} className="text-yellow-600 hover:text-yellow-800" /> : <Play size={18} className="text-green-600 hover:text-green-800" />}
                      </button>
                      <button onClick={() => handleOpenModal('edit', consult)} title="Editar" className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(consult.id)} title="Excluir" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ConsultationManagement;

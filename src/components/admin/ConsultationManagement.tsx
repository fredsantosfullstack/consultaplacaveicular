import React, { useState, useEffect } from 'react';
import { Plus, Edit, Play, Pause, Car, FileText, ShieldCheck, User, Search, GripVertical, Package, Settings } from 'lucide-react';
import api from '../../services/api';
import AdminModal from './AdminModal';
import CrlveOrdersAdmin from '../../pages/admin/CrlveOrdersAdmin';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Consultation {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  icon?: string;
  price: number;
  price_on_request?: boolean;
  is_new: boolean;
  is_active: boolean;
  display_order?: number;
}

interface CrlveTurboState {
  id: number;
  state_code: string;
  state_name: string;
  price: number;
  is_active: boolean;
}

// Componente para item arrastável
interface SortableItemProps {
  consultation: Consultation;
  onEdit: () => void;
  onToggleActive: () => void;
  onManageStates?: () => void;
  iconMap: any;
}

const SortableItem: React.FC<SortableItemProps> = ({ consultation, onEdit, onToggleActive, onManageStates, iconMap }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: consultation.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = iconMap[consultation.icon || 'Search'] || iconMap.Search;

  return (
    <tr ref={setNodeRef} style={style} className="border-b hover:bg-gray-50">
      <td className="py-3 px-4 text-center">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
          title="Arrastar para reordenar"
        >
          <GripVertical size={18} className="text-gray-400" />
        </button>
      </td>
      <td className="py-3 px-4 font-medium">{consultation.name}</td>
      <td className="py-3 px-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(consultation.price)}</td>
      <td className="py-3 px-4 text-center">{consultation.is_new ? 'Sim' : 'Não'}</td>
      <td className="py-3 px-4 text-center">
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${consultation.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {consultation.is_active ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="py-3 px-4 text-right">
        <div className="flex gap-4 justify-end">
          <button onClick={onToggleActive} title={consultation.is_active ? 'Pausar' : 'Ativar'}>
            {consultation.is_active ? <Pause size={18} className="text-yellow-600 hover:text-yellow-800" /> : <Play size={18} className="text-green-600 hover:text-green-800" />}
          </button>
          <button onClick={onEdit} title="Editar" className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
          {consultation.slug === 'crlv-e-turbo' && onManageStates && (
            <button onClick={onManageStates} title="Gerenciar Estados" className="text-purple-600 hover:text-purple-800">
              <Settings size={18} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

const ConsultationManagement: React.FC = () => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentConsultation, setCurrentConsultation] = useState<Partial<Consultation>>({});
  const [showCrlveOrders, setShowCrlveOrders] = useState(false);
  const [showStatesModal, setShowStatesModal] = useState(false);
  const [crlveTurboStates, setCrlveTurboStates] = useState<CrlveTurboState[]>([]);
  const [editingTurboState, setEditingTurboState] = useState<CrlveTurboState | null>(null);
  const [showStateFormModal, setShowStateFormModal] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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


  const handleToggleActive = async (consultation: Consultation) => {
    try {
      await api.put(`/consultations/${consultation.id}`, { ...consultation, is_active: !consultation.is_active });
      fetchConsultations();
    } catch (error) {
    }
  };

  const handleManageStates = async () => {
    try {
      const response = await api.get('/crlve-orders/admin/states');
      setCrlveTurboStates(response.data || []);
      setShowStatesModal(true);
    } catch (error) {
      console.error('Erro ao buscar estados:', error);
      alert('Erro ao carregar estados.');
    }
  };

  const handleSaveTurboState = async (state: Partial<CrlveTurboState>) => {
    try {
      await api.post('/crlve-orders/admin/states', state);
      handleManageStates(); // Recarregar lista
      setShowStateFormModal(false);
      setEditingTurboState(null);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
      alert('Erro ao salvar estado.');
    }
  };

  const handleDeleteTurboState = async (code: string) => {
    if (!confirm('Tem certeza que deseja deletar este estado?')) return;
    try {
      await api.delete(`/crlve-orders/admin/states/${code}`);
      handleManageStates(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao deletar estado:', error);
      alert('Erro ao deletar estado.');
    }
  };

  const handleToggleTurboState = async (state: CrlveTurboState) => {
    try {
      await api.post('/crlve-orders/admin/states', {
        ...state,
        is_active: !state.is_active
      });
      handleManageStates(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao atualizar estado:', error);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = consultations.findIndex((c) => c.id === active.id);
    const newIndex = consultations.findIndex((c) => c.id === over.id);

    const newConsultations = arrayMove(consultations, oldIndex, newIndex);
    setConsultations(newConsultations);

    // Atualizar display_order no backend
    try {
      const updates = newConsultations.map((consultation, index) =>
        api.put(`/consultations/${consultation.id}/order`, { display_order: index + 1 })
      );
      await Promise.all(updates);
    } catch (error) {
      console.error('Erro ao atualizar ordem:', error);
      fetchConsultations(); // Recarregar em caso de erro
    }
  };

  if (showCrlveOrders) {
    return <CrlveOrdersAdmin onBack={() => setShowCrlveOrders(false)} />;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Tipos de Consulta</h2>
          <p className="text-gray-500 mt-1">Edite os tipos de consulta disponíveis para os usuários.</p>
        </div>
        <button
          onClick={() => setShowCrlveOrders(true)}
          className="flex items-center gap-2 bg-[#000042] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
        >
          <Package size={18} />
          Gerenciar Pedidos CRLV-E
        </button>
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
                <input 
                  type="number" 
                  id="price" 
                  value={currentConsultation.price || 0} 
                  onChange={(e) => setCurrentConsultation(prev => ({ ...prev, price: parseFloat(e.target.value) }))} 
                  step="0.01" 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#000042] focus:border-[#000042] sm:text-sm" 
                  disabled={currentConsultation.price_on_request}
                  required={!currentConsultation.price_on_request}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Preço sob consulta?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={currentConsultation.price_on_request || false} onChange={(e) => setCurrentConsultation(prev => ({ ...prev, price_on_request: e.target.checked, price: e.target.checked ? 0 : prev.price }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#000042]/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#000042]"></div>
                </label>
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
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-center w-16">Ordem</th>
                  <th className="py-3 px-4 text-left">Nome</th>
                  <th className="py-3 px-4 text-left">Preço</th>
                  <th className="py-3 px-4 text-center">Tag 'NOVO'</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <SortableContext items={consultations.map(c => c.id)} strategy={verticalListSortingStrategy}>
                <tbody>
                  {consultations.map((consult) => (
                    <SortableItem
                      key={consult.id}
                      consultation={consult}
                      onEdit={() => handleOpenModal('edit', consult)}
                      onToggleActive={() => handleToggleActive(consult)}
                      onManageStates={consult.slug === 'crlv-e-turbo' ? handleManageStates : undefined}
                      iconMap={availableIcons}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
      )}

      {/* Modal: Gerenciar Estados CRLV-E TURBO */}
      {showStatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Gerenciar Estados - CRLV-E TURBO</h2>
              <button
                onClick={() => setShowStatesModal(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <p className="text-sm text-gray-600">{crlveTurboStates.length} estados cadastrados</p>
                <button
                  onClick={() => {
                    setEditingTurboState({ id: 0, state_code: '', state_name: '', price: 0, is_active: true });
                    setShowStateFormModal(true);
                  }}
                  className="bg-[#000042] text-white px-4 py-2 rounded-lg hover:bg-opacity-90 flex items-center gap-2"
                >
                  <Plus size={18} />
                  Adicionar Estado
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {crlveTurboStates.map((state) => (
                  <div key={state.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{state.state_code}</h3>
                        <p className="text-sm text-gray-600">{state.state_name}</p>
                        <p className="text-xl font-bold text-[#000042] mt-2">R$ {Number(state.price).toFixed(2)}</p>
                      </div>
                      <button
                        onClick={() => handleToggleTurboState(state)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          state.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {state.is_active ? 'Ativo' : 'Inativo'}
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setEditingTurboState(state);
                          setShowStateFormModal(true);
                        }}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center gap-1"
                      >
                        <Edit size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteTurboState(state.state_code)}
                        className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
                      >
                        Excluir
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Formulário Estado */}
      {showStateFormModal && editingTurboState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingTurboState.id === 0 ? 'Adicionar Estado' : 'Editar Estado'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Código UF *</label>
                <input
                  type="text"
                  value={editingTurboState.state_code}
                  onChange={(e) => setEditingTurboState({ ...editingTurboState, state_code: e.target.value.toUpperCase() })}
                  maxLength={2}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
                  placeholder="Ex: SP"
                  disabled={editingTurboState.id !== 0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Estado *</label>
                <input
                  type="text"
                  value={editingTurboState.state_name}
                  onChange={(e) => setEditingTurboState({ ...editingTurboState, state_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingTurboState.price}
                  onChange={(e) => setEditingTurboState({ ...editingTurboState, price: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#000042] focus:border-transparent"
                  placeholder="15.00"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingTurboState.is_active}
                  onChange={(e) => setEditingTurboState({ ...editingTurboState, is_active: e.target.checked })}
                  className="w-4 h-4 text-[#000042] focus:ring-[#000042]"
                />
                <label className="text-sm font-medium">Estado Ativo</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => handleSaveTurboState(editingTurboState)}
                  className="flex-1 bg-[#000042] text-white py-2 rounded-lg hover:bg-opacity-90 font-medium"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setShowStateFormModal(false);
                    setEditingTurboState(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultationManagement;

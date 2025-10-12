import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Pause, Car, FileText, ShieldCheck, User, Search, GripVertical, Package } from 'lucide-react';
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
  description?: string;
  icon?: string;
  price: number;
  is_new: boolean;
  is_active: boolean;
  display_order?: number;
}

// Componente para item arrastável
interface SortableItemProps {
  consultation: Consultation;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: () => void;
  iconMap: any;
}

const SortableItem: React.FC<SortableItemProps> = ({ consultation, onEdit, onDelete, onToggleActive, iconMap }) => {
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
          <button onClick={onDelete} title="Excluir" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
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
    return (
      <div>
        <button
          onClick={() => setShowCrlveOrders(false)}
          className="mb-4 text-sm font-semibold text-gray-600 hover:text-gray-800 flex items-center gap-2"
        >
          <span>←</span> Voltar para Consultas
        </button>
        <CrlveOrdersAdmin />
      </div>
    );
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
                      onDelete={() => handleDelete(consult.id)}
                      onToggleActive={() => handleToggleActive(consult)}
                      iconMap={availableIcons}
                    />
                  ))}
                </tbody>
              </SortableContext>
            </table>
          </DndContext>
        </div>
      )}
    </div>
  );
};

export default ConsultationManagement;

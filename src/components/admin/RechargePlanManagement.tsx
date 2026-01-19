import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Pause } from 'lucide-react';
import api from '../../services/api';
import AdminModal from './AdminModal';

interface RechargePlan {
  id: number;
  name: string;
  description?: string;
  price: number;
  credits: number;
  is_active: boolean;
  is_popular: boolean;
}

const isPlanPopular = (plan: Partial<RechargePlan>) =>
  plan?.is_popular === true ||
  plan?.is_popular === 1 ||
  plan?.is_popular === '1' ||
  plan?.is_popular === 'true';

const normalizePlan = (plan: Partial<RechargePlan>): Partial<RechargePlan> => ({
  ...plan,
  is_popular: isPlanPopular(plan)
});

const RechargePlanManagement: React.FC = () => {
  const [plans, setPlans] = useState<RechargePlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentPlan, setCurrentPlan] = useState<Partial<RechargePlan>>({});

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/recharge-plans/all');
      setPlans(response.data.map((plan: RechargePlan) => normalizePlan(plan) as RechargePlan));
    } catch (err: any) {
      setError('Falha ao buscar os planos de recarga.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleOpenModal = (mode: 'add' | 'edit', plan: RechargePlan | null = null) => {
    setModalMode(mode);
    const normalizedPlan = plan ? normalizePlan(plan) : { name: '', price: 0, credits: 0, is_active: true, is_popular: false };
    setCurrentPlan(normalizedPlan);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentPlan({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = modalMode === 'add' ? 'post' : 'put';
    const url = modalMode === 'add' ? '/recharge-plans' : `/recharge-plans/${currentPlan.id}`;

    try {
      await api[method](url, { ...currentPlan, is_popular: isPlanPopular(currentPlan) });
      handleCloseModal();
      fetchPlans();
    } catch (error) {
      console.error('Falha ao salvar plano', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este plano?')) return;
    try {
      await api.delete(`/recharge-plans/${id}`);
      fetchPlans();
    } catch (error) {
      console.error('Falha ao excluir plano', error);
    }
  };

  const handleToggleActive = async (plan: RechargePlan) => {
    try {
      await api.put(`/recharge-plans/${plan.id}`, { ...plan, is_active: !plan.is_active, is_popular: isPlanPopular(plan) });
      fetchPlans();
    } catch (error) {
      console.error('Falha ao alterar status do plano', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Planos de Recarga</h2>
          <p className="text-gray-500 mt-1">Adicione, edite e remova os planos de recarga de créditos.</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-[#076AC2] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center gap-2">
          <Plus size={18} />
          Adicionar Plano
        </button>
      </div>

      {isLoading && <p>Carregando planos...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalMode === 'add' ? 'Adicionar Novo Plano' : 'Editar Plano'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Plano</label>
                <input type="text" id="name" value={currentPlan.name || ''} onChange={(e) => setCurrentPlan(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#076AC2] focus:border-[#076AC2] sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Descrição (Opcional)</label>
                <textarea id="description" value={currentPlan.description || ''} onChange={(e) => setCurrentPlan(prev => ({ ...prev, description: e.target.value }))} rows={3} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#076AC2] focus:border-[#076AC2] sm:text-sm"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                  <input 
                  type="number" 
                  id="price" 
                  value={currentPlan.price || 0} 
                  onChange={(e) => {
                    const priceValue = parseFloat(e.target.value) || 0;
                    setCurrentPlan(prev => ({ ...prev, price: priceValue, credits: priceValue }));
                  }}
                  step="0.01" 
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#076AC2] focus:border-[#076AC2] sm:text-sm" 
                  required 
                />
                </div>
                <div>
                  <label htmlFor="credits" className="block text-sm font-medium text-gray-700">Créditos Concedidos</label>
                  <input type="number" id="credits" value={currentPlan.credits || 0} onChange={(e) => setCurrentPlan(prev => ({ ...prev, credits: parseInt(e.target.value, 10) }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#076AC2] focus:border-[#076AC2] sm:text-sm" required />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Marcar como 'Popular'?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={isPlanPopular(currentPlan)} onChange={(e) => setCurrentPlan(prev => ({ ...prev, is_popular: e.target.checked }))} className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-[#076AC2]/50 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#076AC2]"></div>
                </label>
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-[#076AC2] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Salvar Plano</button>
              </div>
            </form>
          </AdminModal>

          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Preço</th>
                <th className="py-3 px-4 text-left">Créditos</th>
                <th className="py-3 px-4 text-center">Popular</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {plans.map(plan => (
                <tr key={plan.id} className="border-b">
                  <td className="py-3 px-4 font-medium">{plan.name}</td>
                  <td className="py-3 px-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(plan.price)}</td>
                  <td className="py-3 px-4">{plan.credits}</td>
                  <td className="py-3 px-4 text-center">{isPlanPopular(plan) ? 'Sim' : 'Não'}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {plan.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-4 justify-end">
                      <button onClick={() => handleToggleActive(plan)} title={plan.is_active ? 'Pausar' : 'Ativar'}>
                        {plan.is_active ? <Pause size={18} className="text-yellow-600 hover:text-yellow-800" /> : <Play size={18} className="text-green-600 hover:text-green-800" />}
                      </button>
                      <button onClick={() => handleOpenModal('edit', plan)} title="Editar" className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(plan.id)} title="Excluir" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
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

export default RechargePlanManagement;

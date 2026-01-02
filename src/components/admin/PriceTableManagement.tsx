import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Play, Pause } from 'lucide-react';
import api from '../../services/api';
import AdminModal from './AdminModal';

interface PriceItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: string;
  is_active: boolean;
}

const PriceTableManagement: React.FC = () => {
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentItem, setCurrentItem] = useState<Partial<PriceItem>>({});

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/price-table/all');
      setItems(response.data);
    } catch (err: any) {
      setError('Falha ao buscar os itens da tabela de preços.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleOpenModal = (mode: 'add' | 'edit', item: PriceItem | null = null) => {
    setModalMode(mode);
    setCurrentItem(item || { name: '', category: 'Geral', price: 0, is_active: true });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentItem({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = modalMode === 'add' ? 'post' : 'put';
    const url = modalMode === 'add' ? '/price-table' : `/price-table/${currentItem.id}`;

    try {
      await api[method](url, currentItem);
      handleCloseModal();
      fetchItems();
    } catch (error) {
      console.error('Falha ao salvar item', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;
    try {
      await api.delete(`/price-table/${id}`);
      fetchItems();
    } catch (error) {
      console.error('Falha ao excluir item', error);
    }
  };

  const handleToggleActive = async (item: PriceItem) => {
    try {
      await api.put(`/price-table/${item.id}`, { ...item, is_active: !item.is_active });
      fetchItems();
    } catch (error) {
      console.error('Falha ao alterar status do item', error);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Tabela de Preços</h2>
          <p className="text-gray-500 mt-1">Adicione, edite e remova os itens da tabela de preços.</p>
        </div>
        <button onClick={() => handleOpenModal('add')} className="bg-[#076AC2] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 flex items-center gap-2">
          <Plus size={18} />
          Adicionar Item
        </button>
      </div>

      {isLoading && <p>Carregando itens...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <AdminModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalMode === 'add' ? 'Adicionar Novo Item' : 'Editar Item'}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nome do Serviço/Consulta</label>
                <input type="text" id="name" value={currentItem.name || ''} onChange={(e) => setCurrentItem(prev => ({ ...prev, name: e.target.value }))} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#076AC2] focus:border-[#076AC2] sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">Preço (R$)</label>
                <input type="number" id="price" value={currentItem.price || 0} onChange={(e) => setCurrentItem(prev => ({ ...prev, price: parseFloat(e.target.value) }))} step="0.01" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#076AC2] focus:border-[#076AC2] sm:text-sm" required />
              </div>
              <div className="flex justify-end pt-4">
                <button type="button" onClick={handleCloseModal} className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-lg mr-2 hover:bg-gray-300">Cancelar</button>
                <button type="submit" className="bg-[#076AC2] text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90">Salvar Item</button>
              </div>
            </form>
          </AdminModal>

          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">Nome</th>
                <th className="py-3 px-4 text-left">Preço</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {items.map(item => (
                <tr key={item.id} className="border-b">
                  <td className="py-3 px-4 font-medium">{item.name}</td>
                  <td className="py-3 px-4">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {item.is_active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex gap-4 justify-end">
                      <button onClick={() => handleToggleActive(item)} title={item.is_active ? 'Pausar' : 'Ativar'}>
                        {item.is_active ? <Pause size={18} className="text-yellow-600 hover:text-yellow-800" /> : <Play size={18} className="text-green-600 hover:text-green-800" />}
                      </button>
                      <button onClick={() => handleOpenModal('edit', item)} title="Editar" className="text-blue-600 hover:text-blue-800"><Edit size={18} /></button>
                      <button onClick={() => handleDelete(item.id)} title="Excluir" className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
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

export default PriceTableManagement;

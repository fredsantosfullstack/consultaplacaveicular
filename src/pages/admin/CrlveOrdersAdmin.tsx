import { useState, useEffect } from 'react';
import { Bell, Loader2, Edit, Trash2, Check, X, Settings } from 'lucide-react';
import api from '../../services/api';

interface Order {
  id: number;
  placa: string;
  renavam: string;
  cpf_cnpj: string;
  uf: string;
  price: number;
  status: 'pendente' | 'em_andamento' | 'concluido' | 'cancelado';
  admin_notes: string | null;
  created_at: string;
  user_name: string;
  user_email: string;
  user_phone: string;
}

interface State {
  id: number;
  state_code: string;
  state_name: string;
  price: number;
  is_active: boolean;
}

interface CrlveSettings {
  id: number;
  title: string;
  description: string;
  warning_text: string;
  delivery_text: string;
  modal_title: string;
  modal_text: string;
  is_active: boolean;
}

export default function CrlveOrdersAdmin() {
  const [activeTab, setActiveTab] = useState<'orders' | 'states' | 'settings'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [states, setStates] = useState<State[]>([]);
  const [settings, setSettings] = useState<CrlveSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  
  // Modals
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [editingState, setEditingState] = useState<State | null>(null);
  const [showStateModal, setShowStateModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const [ordersRes, countRes] = await Promise.all([
          api.get('/crlve-orders/admin/orders'),
          api.get('/crlve-orders/admin/pending-count')
        ]);
        setOrders(ordersRes.data);
        setPendingCount(countRes.data.count);
      } else if (activeTab === 'states') {
        const res = await api.get('/crlve-orders/admin/states');
        setStates(res.data);
      } else if (activeTab === 'settings') {
        const res = await api.get('/crlve-orders/admin/settings');
        setSettings(res.data);
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: number, status: string, notes: string) => {
    try {
      await api.patch(`/crlve-orders/admin/orders/${orderId}/status`, {
        status,
        admin_notes: notes
      });
      fetchData();
      setEditingOrder(null);
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
    }
  };

  const handleDeleteOrder = async (orderId: number) => {
    if (!confirm('Tem certeza que deseja deletar este pedido?')) return;
    try {
      await api.delete(`/crlve-orders/admin/orders/${orderId}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar pedido:', error);
    }
  };

  const handleSaveState = async (state: Partial<State>) => {
    try {
      await api.post('/crlve-orders/admin/states', state);
      fetchData();
      setShowStateModal(false);
      setEditingState(null);
    } catch (error) {
      console.error('Erro ao salvar estado:', error);
    }
  };

  const handleDeleteState = async (code: string) => {
    if (!confirm('Tem certeza que deseja deletar este estado?')) return;
    try {
      await api.delete(`/crlve-orders/admin/states/${code}`);
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar estado:', error);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.put('/crlve-orders/admin/settings', settings);
      alert('Configurações salvas com sucesso!');
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-100 text-yellow-800';
      case 'em_andamento': return 'bg-blue-100 text-blue-800';
      case 'concluido': return 'bg-green-100 text-green-800';
      case 'cancelado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'em_andamento': return 'Em Andamento';
      case 'concluido': return 'Concluído';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Pedidos CRLV-E</h1>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="font-semibold">{pendingCount} pedidos pendentes</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'orders'
                  ? 'border-[#000042] text-[#000042]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Pedidos ({orders.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('states')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'states'
                  ? 'border-[#000042] text-[#000042]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Estados e Preços
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`px-6 py-3 text-sm font-medium border-b-2 ${
                activeTab === 'settings'
                  ? 'border-[#000042] text-[#000042]'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Configurações
            </button>
          </nav>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-[#000042]" />
            </div>
          ) : (
            <>
              {/* Tab: Pedidos */}
              {activeTab === 'orders' && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold">Cliente</th>
                        <th className="px-4 py-3 text-left font-semibold">Contato</th>
                        <th className="px-4 py-3 text-left font-semibold">Placa</th>
                        <th className="px-4 py-3 text-left font-semibold">UF</th>
                        <th className="px-4 py-3 text-left font-semibold">Valor</th>
                        <th className="px-4 py-3 text-left font-semibold">Status</th>
                        <th className="px-4 py-3 text-left font-semibold">Data</th>
                        <th className="px-4 py-3 text-left font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3">{order.user_name}</td>
                          <td className="px-4 py-3 text-xs">
                            <div>{order.user_email}</div>
                            <div className="text-gray-500">{order.user_phone}</div>
                          </td>
                          <td className="px-4 py-3 font-medium">{order.placa}</td>
                          <td className="px-4 py-3">{order.uf}</td>
                          <td className="px-4 py-3">R$ {order.price.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                              {getStatusLabel(order.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs">
                            {new Date(order.created_at).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingOrder(order)}
                                className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteOrder(order.id)}
                                className="p-1 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab: Estados */}
              {activeTab === 'states' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold">Estados Cadastrados</h2>
                    <button
                      onClick={() => {
                        setEditingState({ id: 0, state_code: '', state_name: '', price: 0, is_active: true });
                        setShowStateModal(true);
                      }}
                      className="bg-[#000042] text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
                    >
                      + Adicionar Estado
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {states.map((state) => (
                      <div key={state.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold">{state.state_name} ({state.state_code})</h3>
                            <p className="text-lg font-bold text-[#000042]">R$ {state.price.toFixed(2)}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${state.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {state.is_active ? 'Ativo' : 'Inativo'}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => {
                              setEditingState(state);
                              setShowStateModal(true);
                            }}
                            className="flex-1 bg-blue-50 text-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-100"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDeleteState(state.state_code)}
                            className="flex-1 bg-red-50 text-red-600 px-3 py-1 rounded text-sm hover:bg-red-100"
                          >
                            Deletar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tab: Configurações */}
              {activeTab === 'settings' && settings && (
                <form onSubmit={handleSaveSettings} className="space-y-4 max-w-3xl">
                  <div>
                    <label className="block text-sm font-medium mb-2">Título da Página</label>
                    <input
                      type="text"
                      value={settings.title}
                      onChange={(e) => setSettings({ ...settings, title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Descrição</label>
                    <input
                      type="text"
                      value={settings.description}
                      onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto de Aviso</label>
                    <textarea
                      value={settings.warning_text}
                      onChange={(e) => setSettings({ ...settings, warning_text: e.target.value })}
                      rows={8}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto de Prazo de Entrega</label>
                    <input
                      type="text"
                      value={settings.delivery_text}
                      onChange={(e) => setSettings({ ...settings, delivery_text: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Título do Modal</label>
                    <input
                      type="text"
                      value={settings.modal_title}
                      onChange={(e) => setSettings({ ...settings, modal_title: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Texto do Modal</label>
                    <textarea
                      value={settings.modal_text}
                      onChange={(e) => setSettings({ ...settings, modal_text: e.target.value })}
                      rows={4}
                      className="w-full px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={settings.is_active}
                      onChange={(e) => setSettings({ ...settings, is_active: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label className="text-sm font-medium">Página Ativa</label>
                  </div>
                  <button
                    type="submit"
                    className="bg-[#000042] text-white px-6 py-2 rounded-lg hover:bg-opacity-90"
                  >
                    Salvar Configurações
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal: Editar Pedido */}
      {editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">Editar Pedido #{editingOrder.id}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value as any })}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="pendente">Pendente</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Observações</label>
                <textarea
                  value={editingOrder.admin_notes || ''}
                  onChange={(e) => setEditingOrder({ ...editingOrder, admin_notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Adicione observações sobre o pedido..."
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleUpdateStatus(editingOrder.id, editingOrder.status, editingOrder.admin_notes || '')}
                  className="flex-1 bg-[#000042] text-white py-2 rounded-lg hover:bg-opacity-90"
                >
                  Salvar
                </button>
                <button
                  onClick={() => setEditingOrder(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Adicionar/Editar Estado */}
      {showStateModal && editingState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold mb-4">
              {editingState.id === 0 ? 'Adicionar Estado' : 'Editar Estado'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Código UF</label>
                <input
                  type="text"
                  value={editingState.state_code}
                  onChange={(e) => setEditingState({ ...editingState, state_code: e.target.value.toUpperCase() })}
                  maxLength={2}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ex: SP"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Nome do Estado</label>
                <input
                  type="text"
                  value={editingState.state_name}
                  onChange={(e) => setEditingState({ ...editingState, state_name: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Ex: São Paulo"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preço (R$)</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingState.price}
                  onChange={(e) => setEditingState({ ...editingState, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingState.is_active}
                  onChange={(e) => setEditingState({ ...editingState, is_active: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-sm font-medium">Estado Ativo</label>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleSaveState(editingState)}
                  className="flex-1 bg-[#000042] text-white py-2 rounded-lg hover:bg-opacity-90"
                >
                  Salvar
                </button>
                <button
                  onClick={() => {
                    setShowStateModal(false);
                    setEditingState(null);
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
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
}

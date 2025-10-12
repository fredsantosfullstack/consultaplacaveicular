import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

// ============================================
// ROTAS PÚBLICAS/USER
// ============================================

// Buscar estados disponíveis e preços
router.get('/states', async (req, res) => {
  try {
    const [states] = await db.query(
      'SELECT state_code, state_name, price FROM crlve_states WHERE is_active = TRUE ORDER BY state_name'
    );
    res.json(states);
  } catch (error) {
    console.error('Erro ao buscar estados:', error);
    res.status(500).json({ msg: 'Erro ao buscar estados.' });
  }
});

// Buscar configurações da página
router.get('/settings', async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM crlve_settings WHERE id = 1');
    if (settings.length === 0) {
      return res.status(404).json({ msg: 'Configurações não encontradas.' });
    }
    res.json(settings[0]);
  } catch (error) {
    console.error('Erro ao buscar configurações:', error);
    res.status(500).json({ msg: 'Erro ao buscar configurações.' });
  }
});

// Criar novo pedido (usuário autenticado)
router.post('/create', authenticateToken, async (req, res) => {
  const { placa, renavam, cpf_cnpj, uf } = req.body;
  const user_id = req.user.id;

  if (!placa || !renavam || !cpf_cnpj || !uf) {
    return res.status(400).json({ msg: 'Todos os campos são obrigatórios.' });
  }

  try {
    // Buscar preço do estado
    const [stateData] = await db.query(
      'SELECT price FROM crlve_states WHERE state_code = ? AND is_active = TRUE',
      [uf]
    );

    if (stateData.length === 0) {
      return res.status(404).json({ msg: 'Estado não disponível.' });
    }

    const price = stateData[0].price;

    // Inserir pedido
    const [result] = await db.query(
      `INSERT INTO crlve_orders (user_id, placa, renavam, cpf_cnpj, uf, price, status) 
       VALUES (?, ?, ?, ?, ?, ?, 'pendente')`,
      [user_id, placa.toUpperCase(), renavam, cpf_cnpj, uf, price]
    );

    res.status(201).json({ 
      msg: 'Pedido criado com sucesso!', 
      order_id: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    res.status(500).json({ msg: 'Erro ao criar pedido.' });
  }
});

// Buscar pedidos do usuário logado
router.get('/my-orders', authenticateToken, async (req, res) => {
  const user_id = req.user.id;

  try {
    const [orders] = await db.query(
      `SELECT 
        id, placa, renavam, cpf_cnpj, uf, price, status, created_at, updated_at
       FROM crlve_orders 
       WHERE user_id = ? 
       ORDER BY created_at DESC`,
      [user_id]
    );
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos do usuário:', error);
    res.status(500).json({ msg: 'Erro ao buscar pedidos.' });
  }
});

// ============================================
// ROTAS ADMIN
// ============================================

// Listar todos os pedidos (Admin)
router.get('/admin/orders', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT 
        o.id, o.placa, o.renavam, o.cpf_cnpj, o.uf, o.price, o.status, 
        o.admin_notes, o.created_at, o.updated_at,
        u.name as user_name, u.email as user_email, u.phone as user_phone
       FROM crlve_orders o
       JOIN users u ON o.user_id = u.id
       ORDER BY o.created_at DESC`
    );
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos (admin):', error);
    res.status(500).json({ msg: 'Erro ao buscar pedidos.' });
  }
});

// Contar pedidos pendentes (para notificação)
router.get('/admin/pending-count', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [result] = await db.query(
      "SELECT COUNT(*) as count FROM crlve_orders WHERE status = 'pendente'"
    );
    res.json({ count: result[0].count });
  } catch (error) {
    console.error('Erro ao contar pedidos pendentes:', error);
    res.status(500).json({ msg: 'Erro ao contar pedidos.' });
  }
});

// Atualizar status do pedido (Admin)
router.patch('/admin/orders/:id/status', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { status, admin_notes } = req.body;

  const validStatuses = ['pendente', 'em_andamento', 'concluido', 'cancelado'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ msg: 'Status inválido.' });
  }

  try {
    await db.query(
      'UPDATE crlve_orders SET status = ?, admin_notes = ? WHERE id = ?',
      [status, admin_notes || null, id]
    );
    res.json({ msg: 'Status atualizado com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ msg: 'Erro ao atualizar status.' });
  }
});

// Deletar pedido (Admin)
router.delete('/admin/orders/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM crlve_orders WHERE id = ?', [id]);
    res.json({ msg: 'Pedido deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ msg: 'Erro ao deletar pedido.' });
  }
});

// ============================================
// ADMIN - GERENCIAR ESTADOS
// ============================================

// Listar todos os estados (Admin)
router.get('/admin/states', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [states] = await db.query('SELECT * FROM crlve_states ORDER BY state_name');
    res.json(states);
  } catch (error) {
    console.error('Erro ao buscar estados (admin):', error);
    res.status(500).json({ msg: 'Erro ao buscar estados.' });
  }
});

// Criar/Atualizar estado (Admin)
router.post('/admin/states', authenticateToken, isAdmin, async (req, res) => {
  const { state_code, state_name, price, is_active } = req.body;

  if (!state_code || !state_name || price === undefined) {
    return res.status(400).json({ msg: 'Código, nome e preço são obrigatórios.' });
  }

  try {
    await db.query(
      `INSERT INTO crlve_states (state_code, state_name, price, is_active) 
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         state_name = VALUES(state_name),
         price = VALUES(price),
         is_active = VALUES(is_active)`,
      [state_code.toUpperCase(), state_name, price, is_active !== false]
    );
    res.json({ msg: 'Estado salvo com sucesso!' });
  } catch (error) {
    console.error('Erro ao salvar estado:', error);
    res.status(500).json({ msg: 'Erro ao salvar estado.' });
  }
});

// Deletar estado (Admin)
router.delete('/admin/states/:code', authenticateToken, isAdmin, async (req, res) => {
  const { code } = req.params;

  try {
    await db.query('DELETE FROM crlve_states WHERE state_code = ?', [code]);
    res.json({ msg: 'Estado deletado com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar estado:', error);
    res.status(500).json({ msg: 'Erro ao deletar estado.' });
  }
});

// ============================================
// ADMIN - GERENCIAR CONFIGURAÇÕES
// ============================================

// Buscar configurações (Admin)
router.get('/admin/settings', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [settings] = await db.query('SELECT * FROM crlve_settings WHERE id = 1');
    res.json(settings[0] || {});
  } catch (error) {
    console.error('Erro ao buscar configurações (admin):', error);
    res.status(500).json({ msg: 'Erro ao buscar configurações.' });
  }
});

// Atualizar configurações (Admin)
router.put('/admin/settings', authenticateToken, isAdmin, async (req, res) => {
  const { title, description, warning_text, delivery_text, modal_title, modal_text, is_active } = req.body;

  try {
    await db.query(
      `UPDATE crlve_settings 
       SET title = ?, description = ?, warning_text = ?, delivery_text = ?, 
           modal_title = ?, modal_text = ?, is_active = ?
       WHERE id = 1`,
      [title, description, warning_text, delivery_text, modal_title, modal_text, is_active !== false]
    );
    res.json({ msg: 'Configurações atualizadas com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar configurações:', error);
    res.status(500).json({ msg: 'Erro ao atualizar configurações.' });
  }
});

export default router;

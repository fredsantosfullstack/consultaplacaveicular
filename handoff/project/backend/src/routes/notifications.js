import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

// ============================================
// ROTAS ADMIN - Gerenciar Notificações
// ============================================

// Listar todas as notificações (Admin)
router.get('/admin/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [notifications] = await db.query(`
      SELECT 
        n.*,
        u.name as created_by_name,
        CASE 
          WHEN n.target_type = 'specific' THEN tu.name
          ELSE 'Todos os usuários'
        END as target_name
      FROM notifications n
      LEFT JOIN users u ON n.created_by = u.id
      LEFT JOIN users tu ON n.target_user_id = tu.id
      ORDER BY n.created_at DESC
    `);
    res.json(notifications);
  } catch (error) {
    console.error('Erro ao buscar notificações:', error);
    res.status(500).json({ msg: 'Erro ao buscar notificações.' });
  }
});

// Criar notificação (Admin)
router.post('/admin/create', authenticateToken, isAdmin, async (req, res) => {
  const { title, message, type, target_type, target_user_id, link_url, link_text, show_close_button } = req.body;
  const created_by = req.user.id;

  if (!title || !message) {
    return res.status(400).json({ msg: 'Título e mensagem são obrigatórios.' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO notifications 
       (title, message, type, target_type, target_user_id, link_url, link_text, show_close_button, created_by) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title,
        message,
        type || 'info',
        target_type || 'all',
        target_user_id || null,
        link_url || null,
        link_text || null,
        show_close_button !== false,
        created_by
      ]
    );

    res.status(201).json({ 
      msg: 'Notificação criada com sucesso!', 
      id: result.insertId 
    });
  } catch (error) {
    console.error('Erro ao criar notificação:', error);
    res.status(500).json({ msg: 'Erro ao criar notificação.' });
  }
});

// Atualizar notificação (Admin)
router.put('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, message, type, target_type, target_user_id, link_url, link_text, show_close_button } = req.body;

  try {
    await db.query(
      `UPDATE notifications 
       SET title = ?, message = ?, type = ?, target_type = ?, target_user_id = ?, 
           link_url = ?, link_text = ?, show_close_button = ?
       WHERE id = ?`,
      [title, message, type, target_type, target_user_id, link_url, link_text, show_close_button, id]
    );

    res.json({ msg: 'Notificação atualizada com sucesso!' });
  } catch (error) {
    console.error('Erro ao atualizar notificação:', error);
    res.status(500).json({ msg: 'Erro ao atualizar notificação.' });
  }
});

// Ativar/Pausar notificação (Admin)
router.patch('/admin/:id/toggle', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { is_active } = req.body;

  try {
    await db.query('UPDATE notifications SET is_active = ? WHERE id = ?', [is_active, id]);
    res.json({ msg: `Notificação ${is_active ? 'ativada' : 'pausada'} com sucesso!` });
  } catch (error) {
    console.error('Erro ao atualizar status:', error);
    res.status(500).json({ msg: 'Erro ao atualizar status.' });
  }
});

// Deletar notificação (Admin)
router.delete('/admin/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM notifications WHERE id = ?', [id]);
    res.json({ msg: 'Notificação deletada com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar notificação:', error);
    res.status(500).json({ msg: 'Erro ao deletar notificação.' });
  }
});

// ============================================
// ROTAS USER - Ver Notificações
// ============================================

// Buscar notificações ativas para o usuário logado
router.get('/user/active', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const [notifications] = await db.query(`
      SELECT n.*
      FROM notifications n
      WHERE n.is_active = TRUE
        AND (
          n.target_type = 'all' 
          OR (n.target_type = 'specific' AND n.target_user_id = ?)
        )
        AND NOT EXISTS (
          SELECT 1 FROM notification_reads nr 
          WHERE nr.notification_id = n.id AND nr.user_id = ?
        )
      ORDER BY n.created_at DESC
    `, [userId, userId]);

    res.json(notifications);
  } catch (error) {
    console.error('Erro ao buscar notificações do usuário:', error);
    res.status(500).json({ msg: 'Erro ao buscar notificações.' });
  }
});

// Marcar notificação como lida
router.post('/user/:id/read', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    await db.query(
      'INSERT IGNORE INTO notification_reads (notification_id, user_id) VALUES (?, ?)',
      [id, userId]
    );
    res.json({ msg: 'Notificação marcada como lida.' });
  } catch (error) {
    console.error('Erro ao marcar notificação como lida:', error);
    res.status(500).json({ msg: 'Erro ao marcar notificação.' });
  }
});

export default router;

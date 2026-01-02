import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

// ROTA PÚBLICA: Buscar todos os itens ATIVOS, agrupados por categoria
router.get('/', async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM price_table_items WHERE is_active = TRUE ORDER BY name ASC');
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar itens da tabela de preços:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar itens.' });
  }
});

// --- ROTAS DE ADMIN ---

// ROTA ADMIN: Buscar TODOS os itens
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [items] = await db.query('SELECT * FROM price_table_items ORDER BY name ASC');
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar todos os itens:', error);
  }
});

// ROTA ADMIN: Criar um novo item
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { name, price, is_active } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ msg: 'Nome e preço são obrigatórios.' });
  }

  try {
    const newItem = { name, price, is_active: is_active !== undefined ? !!is_active : true };
    const [result] = await db.query('INSERT INTO price_table_items SET ?', newItem);
    res.status(201).json({ id: result.insertId, ...newItem });
  } catch (error) {
    console.error('Erro ao criar item:', error);
    res.status(500).json({ msg: 'Erro no servidor ao criar item.' });
  }
});

// ROTA ADMIN: Atualizar um item
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, price, is_active } = req.body;

  if (!name || price === undefined) {
    return res.status(400).json({ msg: 'Nome e preço são obrigatórios.' });
  }

  try {
    const updatedItem = { name, price, is_active: is_active !== undefined ? !!is_active : true };
    await db.query('UPDATE price_table_items SET ? WHERE id = ?', [updatedItem, id]);
    res.json({ id, ...updatedItem });
  } catch (error) {
    console.error(`Erro ao atualizar item ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar item.' });
  }
});

// ROTA ADMIN: Deletar um item
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM price_table_items WHERE id = ?', [id]);
    res.json({ msg: 'Item deletado com sucesso.' });
  } catch (error) {
    console.error(`Erro ao deletar item ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao deletar item.' });
  }
});

export default router;

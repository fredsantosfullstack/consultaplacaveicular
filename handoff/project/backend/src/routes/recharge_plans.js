import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js'; // Reutilizando o middleware de admin

const router = express.Router();

// ROTA PÚBLICA: Buscar todos os planos de recarga ATIVOS
router.get('/', async (req, res) => {
  try {
    const [plans] = await db.query('SELECT * FROM recharge_plans WHERE is_active = TRUE ORDER BY price ASC');
    res.json(plans);
  } catch (error) {
    console.error('Erro ao buscar planos de recarga:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar planos de recarga.' });
  }
});

// --- ROTAS DE ADMIN ---

// ROTA ADMIN: Buscar TODOS os planos de recarga
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [plans] = await db.query('SELECT * FROM recharge_plans ORDER BY price ASC');
    res.json(plans);
  } catch (error) {
    console.error('Erro ao buscar todos os planos de recarga:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar planos.' });
  }
});

// ROTA ADMIN: Criar um novo plano de recarga
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { name, description, price, credits, is_active, is_popular } = req.body;

  if (!name || price === undefined || credits === undefined) {
    return res.status(400).json({ msg: 'Nome, preço e créditos são obrigatórios.' });
  }

  try {
    const newPlan = {
      name,
      description,
      price,
      credits,
      is_active: is_active !== undefined ? !!is_active : true,
      is_popular: !!is_popular,
    };

    const [result] = await db.query('INSERT INTO recharge_plans SET ?', newPlan);
    res.status(201).json({ id: result.insertId, ...newPlan });

  } catch (error) {
    console.error('Erro ao criar plano de recarga:', error);
    res.status(500).json({ msg: 'Erro no servidor ao criar plano.' });
  }
});

// ROTA ADMIN: Atualizar um plano de recarga
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, description, price, credits, is_active, is_popular } = req.body;

  if (!name || price === undefined || credits === undefined) {
    return res.status(400).json({ msg: 'Nome, preço e créditos são obrigatórios.' });
  }

  try {
    const updatedPlan = {
      name,
      description,
      price,
      credits,
      is_active: is_active !== undefined ? !!is_active : true,
      is_popular: !!is_popular,
    };

    await db.query('UPDATE recharge_plans SET ? WHERE id = ?', [updatedPlan, id]);
    res.json({ id, ...updatedPlan });

  } catch (error) {
    console.error(`Erro ao atualizar plano ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar plano.' });
  }
});

// ROTA ADMIN: Deletar um plano de recarga
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM recharge_plans WHERE id = ?', [id]);
    res.json({ msg: 'Plano de recarga deletado com sucesso.' });
  } catch (error) {
    console.error(`Erro ao deletar plano ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao deletar plano.' });
  }
});

export default router;

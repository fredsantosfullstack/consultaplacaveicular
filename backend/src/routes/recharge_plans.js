import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

/**
 * Normaliza um valor decimal recebido do painel para o formato aceito pelo MySQL.
 * Aceita strings com vírgula/ponto e números.
 */
const normalizeDecimal = (value) => {
  if (typeof value === 'string') {
    const sanitized = value.replace(/\./g, '').replace(',', '.');
    const parsed = Number.parseFloat(sanitized);
    return Number.isNaN(parsed) ? null : Number(parsed.toFixed(2));
  }

  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : Number(value.toFixed(2));
  }

  return null;
};

/**
 * Garante que o valor será tratado como inteiro positivo.
 */
const normalizeInteger = (value) => {
  if (typeof value === 'string') {
    const sanitized = value.replace(/[^\d-]/g, '');
    if (!sanitized) return null;
    return Number.parseInt(sanitized, 10);
  }

  if (typeof value === 'number') {
    return Number.isNaN(value) ? null : Math.trunc(value);
  }

  return null;
};

const buildPlanPayload = (body) => {
  const price = normalizeDecimal(body.price);
  const credits = normalizeInteger(body.credits);

  if (!body.name || price === null || credits === null) {
    return null;
  }

  return {
    name: body.name.trim(),
    description: body.description || null,
    price,
    credits,
    is_active: body.is_active !== undefined ? !!body.is_active : true,
    is_popular: !!body.is_popular
  };
};

// Public route: returns only active plans
router.get('/', async (req, res) => {
  try {
    const [plans] = await db.query('SELECT * FROM recharge_plans WHERE is_active = TRUE ORDER BY price ASC');
    res.json(plans);
  } catch (error) {
    console.error('Erro ao buscar planos de recarga:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar planos de recarga.' });
  }
});

// Admin route: returns all plans
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [plans] = await db.query('SELECT * FROM recharge_plans ORDER BY price ASC');
    res.json(plans);
  } catch (error) {
    console.error('Erro ao buscar todos os planos de recarga:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar planos.' });
  }
});

// Admin route: create plan
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const planPayload = buildPlanPayload(req.body);

  if (!planPayload) {
    return res.status(400).json({ msg: 'Nome, preço e créditos válidos são obrigatórios.' });
  }

  try {
    const [result] = await db.query('INSERT INTO recharge_plans SET ?', planPayload);
    res.status(201).json({ id: result.insertId, ...planPayload });
  } catch (error) {
    console.error('Erro ao criar plano de recarga:', error);
    res.status(500).json({ msg: 'Erro no servidor ao criar plano.' });
  }
});

// Admin route: update plan
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const planPayload = buildPlanPayload(req.body);

  if (!planPayload) {
    return res.status(400).json({ msg: 'Nome, preço e créditos válidos são obrigatórios.' });
  }

  try {
    await db.query('UPDATE recharge_plans SET ? WHERE id = ?', [planPayload, id]);
    res.json({ id, ...planPayload });
  } catch (error) {
    console.error(`Erro ao atualizar plano ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar plano.' });
  }
});

// Admin route: delete plan
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

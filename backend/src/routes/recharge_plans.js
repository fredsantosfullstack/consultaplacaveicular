import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

/**
 * Garante que colunas opcionais existam na tabela de planos.
 * Evita falhas em ambientes onde os scripts de migração ainda não foram executados.
 */
const ensureRechargePlanSchema = async () => {
  const ensureColumn = async (columnName, definition) => {
    try {
      const [columns] = await db.query('SHOW COLUMNS FROM recharge_plans LIKE ?', [columnName]);
      if (columns.length === 0) {
        await db.query(`ALTER TABLE recharge_plans ADD COLUMN ${definition}`);
        console.log(`Coluna ${columnName} adicionada em recharge_plans.`);
      }
    } catch (error) {
      console.error(`Falha ao garantir coluna ${columnName} em recharge_plans:`, error);
    }
  };

  await ensureColumn('description', 'TEXT NULL AFTER name');
  await ensureColumn('is_popular', 'BOOLEAN DEFAULT FALSE AFTER is_active');
};

ensureRechargePlanSchema().catch((error) => {
  console.error('Erro ao garantir estrutura de recharge_plans:', error);
});

const shouldRetrySchema = (error) =>
  error &&
  error.code === 'ER_BAD_FIELD_ERROR' &&
  typeof error.sqlMessage === 'string' &&
  (error.sqlMessage.includes('description') || error.sqlMessage.includes('is_popular'));

const stripUnsupportedFields = (payload, error) => {
  if (!shouldRetrySchema(error)) {
    return { payload, changed: false };
  }

  const sanitized = { ...payload };
  let changed = false;

  if (error.sqlMessage.includes('description') && 'description' in sanitized) {
    delete sanitized.description;
    changed = true;
  }
  if (error.sqlMessage.includes('is_popular') && 'is_popular' in sanitized) {
    delete sanitized.is_popular;
    changed = true;
  }

  return { payload: sanitized, changed };
};

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

  const insertPlan = async () => {
    const [result] = await db.query('INSERT INTO recharge_plans SET ?', planPayload);
    return result;
  };

  try {
    const result = await insertPlan();
    res.status(201).json({ id: result.insertId, ...planPayload });
  } catch (error) {
    const { payload: sanitizedPayload, changed } = stripUnsupportedFields(planPayload, error);
    const executeInsert = async (payload) => {
      const [result] = await db.query('INSERT INTO recharge_plans SET ?', payload);
      return result;
    };

    if (changed) {
      try {
        const result = await executeInsert(sanitizedPayload);
        return res.status(201).json({ id: result.insertId, ...sanitizedPayload });
      } catch (stripError) {
        console.error('Erro ao criar plano após remover campos não suportados:', stripError);
      }
    }

    if (shouldRetrySchema(error)) {
      await ensureRechargePlanSchema();
      try {
        const result = await executeInsert(sanitizedPayload);
        return res.status(201).json({ id: result.insertId, ...sanitizedPayload });
      } catch (retryError) {
        console.error('Erro ao criar plano de recarga após ajustar schema:', retryError);
        return res.status(500).json({ msg: 'Erro no servidor ao criar plano.' });
      }
    }

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

  const updatePlan = async () => {
    await db.query('UPDATE recharge_plans SET ? WHERE id = ?', [planPayload, id]);
  };

  try {
    await updatePlan();
    res.json({ id, ...planPayload });
  } catch (error) {
    const { payload: sanitizedPayload, changed } = stripUnsupportedFields(planPayload, error);
    const executeUpdate = async (payload) => {
      await db.query('UPDATE recharge_plans SET ? WHERE id = ?', [payload, id]);
    };

    if (changed) {
      try {
        await executeUpdate(sanitizedPayload);
        return res.json({ id, ...sanitizedPayload });
      } catch (stripError) {
        console.error(`Erro ao atualizar plano ${id} após remover campos não suportados:`, stripError);
      }
    }

    if (shouldRetrySchema(error)) {
      await ensureRechargePlanSchema();
      try {
        await executeUpdate(sanitizedPayload);
        return res.json({ id, ...sanitizedPayload });
      } catch (retryError) {
        console.error(`Erro ao atualizar plano ${id} após ajustar schema:`, retryError);
        return res.status(500).json({ msg: 'Erro no servidor ao atualizar plano.' });
      }
    }

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

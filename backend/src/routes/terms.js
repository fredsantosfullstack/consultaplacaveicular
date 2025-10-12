import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

// ROTA PÚBLICA: Buscar termos ativos
router.get('/active', async (req, res) => {
  try {
    const [terms] = await db.query(
      'SELECT id, title, content, version, created_at, updated_at FROM terms_of_use WHERE is_active = TRUE ORDER BY created_at DESC LIMIT 1'
    );
    
    if (terms.length === 0) {
      return res.status(404).json({ msg: 'Nenhum termo de uso ativo encontrado.' });
    }
    
    res.json(terms[0]);
  } catch (error) {
    console.error('Erro ao buscar termos ativos:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar termos.' });
  }
});

// --- ROTAS DE ADMIN ---

// ROTA ADMIN: Buscar todos os termos
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [terms] = await db.query(`
      SELECT 
        t.id,
        t.title,
        t.content,
        t.version,
        t.is_active,
        t.created_at,
        t.updated_at,
        u.name as created_by_name
      FROM terms_of_use t
      LEFT JOIN users u ON t.created_by = u.id
      ORDER BY t.created_at DESC
    `);
    res.json(terms);
  } catch (error) {
    console.error('Erro ao buscar termos:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar termos.' });
  }
});

// ROTA ADMIN: Buscar termo por ID
router.get('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  
  try {
    const [terms] = await db.query('SELECT * FROM terms_of_use WHERE id = ?', [id]);
    
    if (terms.length === 0) {
      return res.status(404).json({ msg: 'Termo não encontrado.' });
    }
    
    res.json(terms[0]);
  } catch (error) {
    console.error('Erro ao buscar termo:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar termo.' });
  }
});

// ROTA ADMIN: Criar novo termo
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { title, content, version, is_active } = req.body;
  const created_by = req.user.id;

  if (!title || !content || !version) {
    return res.status(400).json({ msg: 'Título, conteúdo e versão são obrigatórios.' });
  }

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Se o novo termo for ativo, desativar todos os outros
    if (is_active) {
      await connection.query('UPDATE terms_of_use SET is_active = FALSE');
    }

    const newTerm = {
      title,
      content,
      version,
      is_active: !!is_active,
      created_by
    };

    const [result] = await connection.query('INSERT INTO terms_of_use SET ?', newTerm);
    
    await connection.commit();
    
    res.status(201).json({ 
      id: result.insertId, 
      ...newTerm,
      msg: 'Termo criado com sucesso!' 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar termo:', error);
    res.status(500).json({ msg: 'Erro no servidor ao criar termo.' });
  } finally {
    connection.release();
  }
});

// ROTA ADMIN: Atualizar termo
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { title, content, version, is_active } = req.body;

  if (!title || !content || !version) {
    return res.status(400).json({ msg: 'Título, conteúdo e versão são obrigatórios.' });
  }

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Verificar se o termo existe
    const [existing] = await connection.query('SELECT * FROM terms_of_use WHERE id = ?', [id]);
    if (existing.length === 0) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Termo não encontrado.' });
    }

    // Se o termo for ativado, desativar todos os outros
    if (is_active) {
      await connection.query('UPDATE terms_of_use SET is_active = FALSE WHERE id != ?', [id]);
    }

    const updatedTerm = {
      title,
      content,
      version,
      is_active: !!is_active
    };

    await connection.query('UPDATE terms_of_use SET ? WHERE id = ?', [updatedTerm, id]);
    
    await connection.commit();
    
    res.json({ msg: 'Termo atualizado com sucesso!', ...updatedTerm });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao atualizar termo:', error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar termo.' });
  } finally {
    connection.release();
  }
});

// ROTA ADMIN: Ativar/Desativar termo
router.patch('/:id/toggle', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Buscar termo atual
    const [terms] = await connection.query('SELECT is_active FROM terms_of_use WHERE id = ?', [id]);
    
    if (terms.length === 0) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Termo não encontrado.' });
    }

    const newStatus = !terms[0].is_active;

    // Se for ativar, desativar todos os outros
    if (newStatus) {
      await connection.query('UPDATE terms_of_use SET is_active = FALSE WHERE id != ?', [id]);
    }

    await connection.query('UPDATE terms_of_use SET is_active = ? WHERE id = ?', [newStatus, id]);
    
    await connection.commit();
    
    res.json({ 
      msg: `Termo ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
      is_active: newStatus 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao alternar status do termo:', error);
    res.status(500).json({ msg: 'Erro no servidor ao alternar status.' });
  } finally {
    connection.release();
  }
});

// ROTA ADMIN: Deletar termo
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM terms_of_use WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ msg: 'Termo não encontrado.' });
    }
    
    res.json({ msg: 'Termo deletado com sucesso.' });
  } catch (error) {
    console.error('Erro ao deletar termo:', error);
    res.status(500).json({ msg: 'Erro no servidor ao deletar termo.' });
  }
});

export default router;

import express from 'express';
import axios from 'axios';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import { isAdmin } from './settings.js';

const router = express.Router();

// Rota para criar uma nova consulta (apenas admin)
router.post('/', authenticateToken, isAdmin, async (req, res) => {
  const { name, slug, description, form_fields, icon, price, is_new } = req.body;

  if (!name || !slug || price === undefined) {
    return res.status(400).json({ msg: 'Nome, slug e preço são obrigatórios.' });
  }

  try {
    const newConsultation = {
      name,
      slug,
      description,
      form_fields: JSON.stringify(form_fields || []),
      icon: icon || 'Search',
      price,
      is_new: !!is_new,
    };

    const [result] = await db.query('INSERT INTO consultation_types SET ?', newConsultation);
    res.status(201).json({ id: result.insertId, ...newConsultation });

  } catch (error) {
    console.error('Erro ao criar consulta:', error);
    res.status(500).json({ msg: 'Erro no servidor ao criar consulta.' });
  }
});

// Rota para buscar TODAS as consultas (para o painel admin)
router.get('/all', authenticateToken, isAdmin, async (req, res) => {
  try {
    const [consultations] = await db.query('SELECT * FROM consultation_types ORDER BY name ASC');
    res.json(consultations);
  } catch (error) {
    console.error('Erro ao buscar todas as consultas:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar consultas.' });
  }
});

// Rota para buscar todos os tipos de consulta ATIVAS (pública)
router.get('/', async (req, res) => {
  try {
    const [consultations] = await db.query('SELECT * FROM consultation_types WHERE is_active = TRUE ORDER BY name ASC');
    res.json(consultations);
  } catch (error) {
    console.error('Erro ao buscar tipos de consulta:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar consultas.' });
  }
});

// Rota para atualizar uma consulta (apenas admin)
router.put('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;
  const { name, slug, description, form_fields, icon, price, is_new, is_active } = req.body;

  if (!name || !slug || price === undefined) {
    return res.status(400).json({ msg: 'Nome, slug e preço são obrigatórios.' });
  }

  try {
    const updatedConsultation = {
      name,
      slug,
      description,
      form_fields: JSON.stringify(form_fields || []),
      icon: icon || 'Search',
      price,
      is_new: !!is_new,
      is_active: is_active === undefined ? true : !!is_active
    };

    await db.query('UPDATE consultation_types SET ? WHERE id = ?', [updatedConsultation, id]);
    res.json({ id, ...updatedConsultation });

  } catch (error) {
    console.error(`Erro ao atualizar consulta ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar consulta.' });
  }
});

// Rota para deletar uma consulta (apenas admin)
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM consultation_types WHERE id = ?', [id]);
    res.json({ msg: 'Consulta deletada com sucesso.' });
  } catch (error) {
    console.error(`Erro ao deletar consulta ${id}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao deletar consulta.' });
  }
});

// ROTA ADMIN: Buscar o histórico de TODAS as consultas
router.get('/history', authenticateToken, isAdmin, async (req, res) => {
  try {
    const query = `
      SELECT 
        ch.id, 
        ch.consultation_type, 
        ch.plate, 
        ch.status, 
        ch.created_at, 
        u.name as userName
      FROM consultation_history ch
      JOIN users u ON ch.user_id = u.id
      ORDER BY ch.created_at DESC
    `;
    const [history] = await db.query(query);
    res.json(history);
  } catch (error) {
    console.error('Erro ao buscar histórico de todas as consultas:', error);
    res.status(500).json({ msg: 'Erro no servidor.' });
  }
});

// ROTA DO USUÁRIO: Executar uma nova consulta
router.post('/execute', authenticateToken, async (req, res) => {
  const { plate, consultationTypeId } = req.body;
  const userId = req.user.id;

  if (!plate || !consultationTypeId) {
    return res.status(400).json({ msg: 'Placa e tipo de consulta são obrigatórios.' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Buscar dados do usuário (saldo) e da consulta (custo)
    const [userRows] = await connection.query('SELECT balance FROM users WHERE id = ?', [userId]);
    const [consultationRows] = await connection.query('SELECT price FROM consultation_types WHERE id = ?', [consultationTypeId]);

    if (userRows.length === 0 || consultationRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Usuário ou tipo de consulta não encontrado.' });
    }

    const userBalance = userRows[0].balance;
    const consultationPrice = consultationRows[0].price;

    // 2. Verificar se o saldo é suficiente
    if (userBalance < consultationPrice) {
      await connection.rollback();
      return res.status(402).json({ msg: 'Saldo insuficiente.' });
    }

    // 3. Deduzir o saldo
    const newBalance = userBalance - consultationPrice;
    await connection.query('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);

    // 4. Inserir no histórico de consultas
    const historyEntry = {
      user_id: userId,
      consultation_type: `Consulta ID ${consultationTypeId}`, // Placeholder, pode ser melhorado
      plate,
      cost: consultationPrice,
      status: 'pending',
    };
    const [historyResult] = await connection.query('INSERT INTO consultation_history SET ?', historyEntry);
    const historyId = historyResult.insertId;

    // --- SIMULAÇÃO DA CHAMADA À API EXTERNA ---
    // Aqui você chamaria a API real de consulta veicular
    // const externalApiResponse = await axios.post('https://api.externa.com/consultar', { placa: plate, tipo: consultationTypeId });
    // Por agora, vamos apenas simular um sucesso após 2 segundos.
    const simulatedResult = { "Proprietário": "Fulano de Tal", "Modelo": "Carro Exemplo", "Ano": 2023, "Débitos": "Nenhum" };
    // --- FIM DA SIMULAÇÃO ---

    // 5. Atualizar o histórico com o resultado
    await connection.query('UPDATE consultation_history SET status = ?, result = ? WHERE id = ?', ['completed', JSON.stringify(simulatedResult), historyId]);

    await connection.commit();

    res.json({ 
      msg: 'Consulta realizada com sucesso!', 
      newBalance, 
      result: simulatedResult 
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao executar consulta:', error);
    res.status(500).json({ msg: 'Erro no servidor ao executar consulta.' });
  } finally {
    connection.release();
  }
});

// Rota para buscar o histórico de consultas do usuário logado
router.get('/history', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  try {
    const [history] = await db.query(
      'SELECT id, plate, consultation_type, created_at, status FROM consultation_history WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(history);
  } catch (error) {
    console.error('Erro ao buscar histórico de consultas:', error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar histórico.' });
  }
});

// Rota de Proxy UNIFICADA COM AUTENTICAÇÃO e VERIFICAÇÃO DE SALDO
router.post('/execute/:slug', authenticateToken, async (req, res) => {
  const { slug } = req.params;
  const data = req.body;
  const userId = req.user.id;

  // Validação simples para garantir que o corpo não está vazio
  if (Object.keys(data).length === 0) {
    return res.status(400).json({ msg: 'Dados da consulta são obrigatórios.' });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Buscar dados da consulta pelo slug
    const [consultationRows] = await connection.query('SELECT id, name, price FROM consultation_types WHERE slug = ?', [slug]);
    
    if (consultationRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Tipo de consulta não encontrado.' });
    }

    const consultation = consultationRows[0];
    const consultationPrice = consultation.price;

    // 2. Buscar saldo do usuário
    const [userRows] = await connection.query('SELECT balance FROM users WHERE id = ?', [userId]);
    
    if (userRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const userBalance = userRows[0].balance;

    // 3. Verificar se o saldo é suficiente
    if (userBalance < consultationPrice) {
      await connection.rollback();
      return res.status(402).json({ 
        msg: 'Saldo insuficiente.',
        balance: userBalance,
        required: consultationPrice
      });
    }

    // 4. Deduzir o saldo
    const newBalance = userBalance - consultationPrice;
    await connection.query('UPDATE users SET balance = ? WHERE id = ?', [newBalance, userId]);

    // 5. Inserir no histórico de consultas
    const historyEntry = {
      user_id: userId,
      consultation_type: consultation.name,
      plate: data.placa || data.chassi || 'N/A',
      cost: consultationPrice,
      status: 'pending',
    };
    const [historyResult] = await connection.query('INSERT INTO consultation_history SET ?', historyEntry);
    const historyId = historyResult.insertId;

    // 6. Chamar a API externa
    // Mapeamento de slugs internos para endpoints da API externa
    const slugToEndpoint = {
      'base-nacional': 'consultar-base-nacional',
      'base-estadual': 'consultar-base-estadual',
      'consulta-chassi': 'consultar-chassi',
      'gravame-v2': 'consultar-gravame',
      'consultar-gravame': 'consultar-gravame',
      'codigo-seguranca-pdf': 'consultar-crv',
      'consultar-crv': 'consultar-crv',
      'csv-renainf-renajud-recall-bin-proprietar': 'consultar-csv-renainf-renajud-recall-bin-proprietar',
      'ano-licenciamento-bin-nacional': 'consultar-ano-licenciamento-bin-nacional',
      'consulta-cautelar': 'consultar-cautelar',
      'consulta-leilao': 'consultar-leilao',
      'consulta-comunicado-venda': 'consultar-comunicado-venda',
      'crlv-e-agendado': 'consultar-crlv-e-agendado',
      'crv-digital-agendado': 'consultar-crv-digital-agendado',
      'proprietario-atual-v2': 'consultar-proprietario-atual-v2',
      'proprietario-atual-restricoes': 'consultar-proprietario-atual-restricoes',
      'reemissao-atpv-e': 'consultar-reemissao-atpv-e',
      'verifica-autenticidade-crv': 'consultar-verifica-autenticidade-crv',
      // CRLV-E TURBO por estado
      'crlv-e-turbo-mg': 'consultar-crlv-mg',
      'crlv-e-turbo-to': 'consultar-crlv-to',
      'crlv-e-turbo-mt': 'consultar-crlv-mt',
      'crlv-e-turbo-ap': 'consultar-crlv-ap',
      'crlv-e-turbo-ma': 'consultar-crlv-ma',
      'crlv-e-turbo-sp': 'consultar-crlv-sp',
      'crlv-e-turbo-go': 'consultar-crlv-go',
      'crlv-e-turbo-rr': 'consultar-crlv-rr',
      'crlv-e-turbo-pi': 'consultar-crlv-pi',
      'crlv-e-turbo-pr': 'consultar-crlv-pr',
      'crlv-e-turbo-se': 'consultar-crlv-se',
      'crlv-e-turbo-ac': 'consultar-crlv-ac',
    };

    const apiEndpoint = slugToEndpoint[slug] || slug;
    
    const response = await axios.post(
      `https://portaldespachantes.online/${apiEndpoint}`,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'chaveAcesso': process.env.API_ACCESS_KEY,
        },
        responseType: 'stream',
      }
    );

    // 7. Atualizar o histórico como concluído
    await connection.query('UPDATE consultation_history SET status = ? WHERE id = ?', ['completed', historyId]);

    await connection.commit();

    // 8. Retornar o PDF para o cliente
    res.setHeader('Content-Type', response.headers['content-type']);
    res.setHeader('X-New-Balance', newBalance); // Envia o novo saldo no header
    response.data.pipe(res);

  } catch (error) {
    await connection.rollback();
    
    // Registrar como falha no histórico se já foi criado
    if (error.response) {
      let errorData = '';
      error.response.data.on('data', chunk => errorData += chunk);
      error.response.data.on('end', () => {
        try {
          const errorJson = JSON.parse(errorData);
          return res.status(error.response.status).json(errorJson);
        } catch (e) {
          return res.status(error.response.status).send(errorData);
        }
      });
    } else {
      console.error('Erro no proxy da consulta:', error);
      res.status(500).json({ msg: 'Erro interno no servidor ao processar a consulta.' });
    }
  } finally {
    connection.release();
  }
});

// Rota para buscar os detalhes de uma consulta pelo slug
router.get('/details/:slug', async (req, res) => {
  const { slug } = req.params;
  console.log(`[BACKEND] Rota GET /:slug acessada com slug: ${slug}`);
  try {
    const [rows] = await db.query('SELECT * FROM consultation_types WHERE slug = ?', [slug]);
    console.log(`[BACKEND] Resultado do DB para o slug ${slug}:`, rows);
    if (rows.length === 0) {
      console.log(`[BACKEND] Consulta com slug ${slug} não encontrada.`);
      return res.status(404).json({ msg: 'Consulta não encontrada.' });
    }
    const consultation = rows[0];
    // O campo form_fields vem como string do DB, então fazemos o parse
    try {
      consultation.form_fields = JSON.parse(consultation.form_fields || '[]');
    } catch (e) {
      console.error(`[BACKEND] Erro ao fazer parse do JSON para o slug ${slug}:`, e);
      consultation.form_fields = []; // Define um array vazio em caso de erro no parse
    }
    console.log(`[BACKEND] Enviando dados da consulta para o frontend:`, consultation);
    res.json(consultation);
  } catch (error) {
    console.error(`[BACKEND] Erro ao buscar consulta ${slug}:`, error);
    res.status(500).json({ msg: 'Erro no servidor ao buscar consulta.' });
  }
});

export default router;

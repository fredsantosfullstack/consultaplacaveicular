import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import mercadoPagoService from '../services/mercadopago.js';

const router = express.Router();

// Rota para verificar status do pagamento
router.get('/status/:paymentId', async (req, res) => {
  const { paymentId } = req.params;
  
  try {
    const [transactions] = await db.query(
      'SELECT status, paid_at FROM payment_transactions WHERE mp_payment_id = ?',
      [paymentId]
    );
    
    if (transactions.length === 0) {
      return res.status(404).json({ status: 'not_found' });
    }
    
    const transaction = transactions[0];
    
    res.json({
      status: transaction.status,
      paidAt: transaction.paid_at,
      confirmed: transaction.status === 'confirmed'
    });
  } catch (error) {
    console.error('Erro ao verificar status:', error);
    res.status(500).json({ msg: 'Erro ao verificar status do pagamento.' });
  }
});

// Rota para criar uma nova cobrança
router.post('/create-charge', authenticateToken, async (req, res) => {
  const { planId } = req.body;
  const userId = req.user.id;

  if (!planId) {
    return res.status(400).json({ msg: 'ID do plano é obrigatório.' });
  }

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Verificar se Mercado Pago está configurado
    const isConfigured = await mercadoPagoService.isConfigured();
    if (!isConfigured) {
      await connection.rollback();
      return res.status(503).json({ msg: 'Mercado Pago não configurado. Entre em contato com o administrador.' });
    }

    // 2. Buscar dados do plano e do usuário
    const [planRows] = await connection.query('SELECT * FROM recharge_plans WHERE id = ? AND is_active = TRUE', [planId]);
    const [userRows] = await connection.query('SELECT * FROM users WHERE id = ?', [userId]);

    if (planRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Plano não encontrado ou inativo.' });
    }

    if (userRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ msg: 'Usuário não encontrado.' });
    }

    const plan = planRows[0];
    const user = userRows[0];

    // 3. Criar pagamento PIX no Mercado Pago
    const payment = await mercadoPagoService.createPixPayment({
      value: plan.price,
      description: `Recarga de ${plan.credits} créditos - ${plan.name}`,
      userId: user.id,
      userEmail: user.email
    });

    // 4. Salvar transação no banco
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas
    await connection.query(
      `INSERT INTO payment_transactions 
       (user_id, plan_id, mp_payment_id, amount, credits, status, payment_method, pix_qr_code, pix_payload, expires_at) 
       VALUES (?, ?, ?, ?, ?, 'pending', 'pix', ?, ?, ?)`,
      [userId, planId, payment.id, plan.price, plan.credits, payment.qrCode, payment.qrCodeText, expiresAt]
    );

    await connection.commit();

    // 5. Retornar dados para o frontend (mesmo formato do Asaas)
    res.json({
      transactionId: payment.id,
      qrCode: payment.qrCode,
      payload: payment.qrCodeText,
      amount: plan.price,
      credits: plan.credits,
      expiresAt: expiresAt.toISOString()
    });

  } catch (error) {
    await connection.rollback();
    console.error('Erro ao criar cobrança:', error);
    res.status(500).json({ msg: error.message || 'Erro no servidor ao criar cobrança.' });
  } finally {
    connection.release();
  }
});

// Rota de teste para verificar se o endpoint está acessível
router.get('/webhook', (req, res) => {
  res.status(200).json({ 
    msg: 'Webhook endpoint está funcionando! Use POST para enviar dados.',
    method: 'GET não é permitido para webhooks. Use POST.'
  });
});

// Rota de Webhook para receber notificações do Mercado Pago
router.post('/webhook', async (req, res) => {
  console.log('🔔 WEBHOOK MERCADO PAGO CHAMADO!');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  console.log('Query:', req.query);
  console.log('Body:', JSON.stringify(req.body, null, 2));

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Mercado Pago envia notificações em diferentes formatos
    const { type, data, action } = req.body;
    const paymentId = data?.id || req.query['data.id'];
    
    // Salvar log do webhook
    await connection.query(
      'INSERT INTO webhook_logs (event_type, payment_id, payload) VALUES (?, ?, ?)',
      [type || action, paymentId || 'unknown', JSON.stringify(req.body)]
    );

    // Processar apenas notificações de pagamento
    if (type === 'payment' || action === 'payment.created' || action === 'payment.updated') {
      
      if (!paymentId) {
        console.log('⚠️ Payment ID não encontrado no webhook');
        await connection.commit();
        return res.status(200).send('OK');
      }

      // Buscar detalhes do pagamento na API do Mercado Pago
      const paymentDetails = await mercadoPagoService.getPaymentStatus(paymentId);
      
      console.log('💳 Status do pagamento:', paymentDetails.status);
      console.log('💳 ID do pagamento:', paymentDetails.id);

      // Processar apenas pagamentos aprovados
      if (paymentDetails.status === 'approved') {
        
        // Buscar transação no banco usando mp_payment_id ou external_reference
        const externalReference = paymentDetails.external_reference;
        
        const [transactions] = await connection.query(
          `SELECT * FROM payment_transactions 
           WHERE (mp_payment_id = ? OR mp_preference_id = ?) AND status = "pending"
           ORDER BY created_at DESC LIMIT 1`,
          [paymentId, externalReference]
        );

        if (transactions.length === 0) {
          console.log('⚠️ Transação não encontrada ou já processada para payment_id:', paymentId);
          await connection.commit();
          return res.status(200).send('OK');
        }

        const transaction = transactions[0];

        // Adicionar créditos ao usuário
        await connection.query(
          'UPDATE users SET balance = balance + ? WHERE id = ?',
          [transaction.credits, transaction.user_id]
        );

        // Atualizar status da transação
        await connection.query(
          'UPDATE payment_transactions SET status = "confirmed", paid_at = NOW() WHERE id = ?',
          [transaction.id]
        );

        // Marcar webhook como processado
        await connection.query(
          'UPDATE webhook_logs SET processed = TRUE WHERE payment_id = ? ORDER BY id DESC LIMIT 1',
          [paymentId]
        );

        await connection.commit();

        console.log(`✅ Créditos adicionados: ${transaction.credits} créditos para usuário ${transaction.user_id}`);
        
        return res.status(200).send('OK');
      } else {
        console.log(`ℹ️ Pagamento com status: ${paymentDetails.status} - aguardando aprovação`);
      }
    }

    await connection.commit();
    res.status(200).send('OK');

  } catch (error) {
    await connection.rollback();
    console.error('❌ Erro ao processar webhook:', error);
    
    try {
      await db.query(
        'UPDATE webhook_logs SET error_message = ? WHERE id = (SELECT MAX(id) FROM webhook_logs)',
        [error.message]
      );
    } catch (logError) {
      console.error('Erro ao salvar log de erro:', logError);
    }
    
    return res.status(200).send('OK');
  } finally {
    connection.release();
  }
});

// Rota para buscar histórico de transações do usuário logado
router.get('/history', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { status, limit = 50, offset = 0 } = req.query;

  try {
    let query = `
      SELECT 
        pt.id,
        pt.mp_payment_id,
        pt.mp_preference_id,
        pt.amount,
        pt.credits,
        pt.status,
        pt.payment_method,
        pt.created_at,
        pt.paid_at,
        pt.expires_at,
        rp.name as plan_name
      FROM payment_transactions pt
      LEFT JOIN recharge_plans rp ON pt.plan_id = rp.id
      WHERE pt.user_id = ?
    `;

    const params = [userId];

    if (status && status !== 'all') {
      query += ' AND pt.status = ?';
      params.push(status);
    }

    query += ' ORDER BY pt.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [transactions] = await db.query(query, params);

    res.json({ transactions });

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    res.status(500).json({ msg: 'Erro ao buscar histórico.' });
  }
});

// Rota para buscar histórico de TODAS as transações (apenas admin)
router.get('/history/all', authenticateToken, async (req, res) => {
  const [adminCheck] = await db.query('SELECT role FROM users WHERE id = ?', [req.user.id]);
  if (adminCheck.length === 0 || adminCheck[0].role !== 'admin') {
    return res.status(403).json({ msg: 'Acesso negado.' });
  }

  const { status, search, limit = 50, offset = 0 } = req.query;

  try {
    let query = `
      SELECT 
        pt.id,
        pt.user_id,
        pt.mp_payment_id,
        pt.mp_preference_id,
        pt.amount,
        pt.credits,
        pt.status,
        pt.payment_method,
        pt.created_at,
        pt.paid_at,
        u.name as user_name,
        u.email as user_email,
        rp.name as plan_name
      FROM payment_transactions pt
      LEFT JOIN users u ON pt.user_id = u.id
      LEFT JOIN recharge_plans rp ON pt.plan_id = rp.id
      WHERE 1=1
    `;

    const params = [];

    if (status && status !== 'all') {
      query += ' AND pt.status = ?';
      params.push(status);
    }

    if (search) {
      query += ' AND (u.name LIKE ? OR u.email LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY pt.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));

    const [transactions] = await db.query(query, params);

    res.json({ transactions });

  } catch (error) {
    console.error('Erro ao buscar histórico admin:', error);
    res.status(500).json({ msg: 'Erro ao buscar histórico.' });
  }
});

export default router;

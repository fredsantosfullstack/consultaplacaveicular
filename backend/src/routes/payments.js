import express from 'express';
import db from '../config/db.js';
import authenticateToken from '../middleware/auth.js';
import asaasService from '../services/asaas.js';

const router = express.Router();

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

    // 1. Buscar dados do plano e do usuário
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

    // 2. Criar ou buscar cliente no Asaas
    const customer = await asaasService.createOrGetCustomer({
      name: user.name,
      email: user.email,
      cpfCnpj: user.document_number,
      phone: user.phone,
      mobilePhone: user.phone
    });

    // 3. Criar a cobrança PIX
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + 24); // Expira em 24h
    
    const payment = await asaasService.createPixPayment({
      customer: customer.id,
      value: plan.price,
      description: `Recarga de ${plan.credits} créditos - ${plan.name}`,
      dueDate: dueDate.toISOString().split('T')[0]
    });

    // 4. Buscar QR Code
    const qrCodeData = await asaasService.getPixQrCode(payment.id);

    // 5. Salvar transação no banco
    const expiresAt = new Date(dueDate);
    await connection.query(
      `INSERT INTO payment_transactions 
       (user_id, plan_id, asaas_payment_id, amount, credits, status, payment_method, pix_qr_code, pix_payload, expires_at) 
       VALUES (?, ?, ?, ?, ?, 'pending', 'pix', ?, ?, ?)`,
      [userId, planId, payment.id, plan.price, plan.credits, qrCodeData.encodedImage, qrCodeData.payload, expiresAt]
    );

    await connection.commit();

    // 6. Retornar dados para o frontend
    res.json({
      transactionId: payment.id,
      qrCode: qrCodeData.encodedImage,
      payload: qrCodeData.payload,
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

// Rota de Webhook para receber notificações do Asaas
router.post('/webhook', async (req, res) => {
  console.log('🔔 WEBHOOK ROUTE CHAMADA!');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers:', req.headers);
  
  const webhookData = req.body;
  
  console.log('📩 Webhook recebido do Asaas:', JSON.stringify(webhookData, null, 2));

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // 1. Salvar log do webhook
    await connection.query(
      'INSERT INTO webhook_logs (event_type, payment_id, payload) VALUES (?, ?, ?)',
      [webhookData.event, webhookData.payment?.id, JSON.stringify(webhookData)]
    );

    // 2. Processar apenas eventos de pagamento confirmado
    if (webhookData.event === 'PAYMENT_CONFIRMED' || webhookData.event === 'PAYMENT_RECEIVED') {
      const paymentId = webhookData.payment.id;

      // 3. Buscar transação no banco
      const [transactions] = await connection.query(
        'SELECT * FROM payment_transactions WHERE asaas_payment_id = ? AND status = "pending"',
        [paymentId]
      );

      if (transactions.length === 0) {
        console.log('⚠️ Transação não encontrada ou já processada:', paymentId);
        await connection.commit();
        return res.status(200).send('Transação já processada ou não encontrada.');
      }

      const transaction = transactions[0];

      // 4. Adicionar créditos ao usuário
      await connection.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [transaction.credits, transaction.user_id]
      );

      // 5. Atualizar status da transação
      await connection.query(
        'UPDATE payment_transactions SET status = "confirmed", paid_at = NOW() WHERE id = ?',
        [transaction.id]
      );

      // 6. Marcar webhook como processado
      await connection.query(
        'UPDATE webhook_logs SET processed = TRUE WHERE payment_id = ? ORDER BY id DESC LIMIT 1',
        [paymentId]
      );

      await connection.commit();

      console.log(`✅ Créditos adicionados: ${transaction.credits} créditos para usuário ${transaction.user_id}`);
      
      return res.status(200).send('Pagamento processado com sucesso.');
    }

    await connection.commit();
    res.status(200).send('Webhook recebido.');

  } catch (error) {
    await connection.rollback();
    console.error('❌ Erro ao processar webhook:', error);
    
    // Salvar erro no log
    try {
      await db.query(
        'UPDATE webhook_logs SET error_message = ? WHERE payment_id = ? ORDER BY id DESC LIMIT 1',
        [error.message, webhookData.payment?.id]
      );
    } catch (logError) {
      console.error('Erro ao salvar log de erro:', logError);
    }
    
    return res.status(500).send('Erro ao processar webhook.');
  } finally {
    connection.release();
  }
});

// Rota para verificar o status de um pagamento
router.get('/status/:paymentId', authenticateToken, async (req, res) => {
  const { paymentId } = req.params;

  try {
    // Buscar no banco primeiro
    const [transactions] = await db.query(
      'SELECT status, paid_at FROM payment_transactions WHERE asaas_payment_id = ?',
      [paymentId]
    );

    if (transactions.length > 0) {
      return res.json({
        status: transactions[0].status,
        paidAt: transactions[0].paid_at
      });
    }

    // Se não encontrou no banco, consulta na API do Asaas
    const paymentStatus = await asaasService.getPaymentStatus(paymentId);
    res.json({ status: paymentStatus.status });

  } catch (error) {
    console.error('Erro ao verificar status do pagamento:', error);
    res.status(500).json({ msg: 'Erro ao verificar status.' });
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
        pt.asaas_payment_id,
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
  // Verificar se é admin
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
        pt.asaas_payment_id,
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

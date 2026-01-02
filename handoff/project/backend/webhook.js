import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';

const app = express();
const PORT = process.env.WEBHOOK_PORT || 3002;

// Configuração do banco de dados
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Middleware para JSON
app.use(express.json());

// Rota do webhook - SUPER SIMPLES
app.post('/webhook', async (req, res) => {
  console.log('🔔 WEBHOOK RECEBIDO NO SERVIDOR DEDICADO!');
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  const webhookData = req.body;
  
  try {
    // Processar apenas eventos de pagamento
    if (webhookData.event === 'PAYMENT_CONFIRMED' || webhookData.event === 'PAYMENT_RECEIVED') {
      const paymentId = webhookData.payment.id;
      
      console.log('💰 Processando pagamento:', paymentId);
      
      // Buscar transação
      const [transactions] = await pool.query(
        'SELECT * FROM payment_transactions WHERE asaas_payment_id = ? AND status = "pending"',
        [paymentId]
      );
      
      if (transactions.length === 0) {
        console.log('⚠️ Transação não encontrada ou já processada');
        return res.status(200).json({ success: true, message: 'Transação já processada' });
      }
      
      const transaction = transactions[0];
      
      // Adicionar créditos
      await pool.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [transaction.credits, transaction.user_id]
      );
      
      // Atualizar status
      await pool.query(
        'UPDATE payment_transactions SET status = "confirmed", paid_at = NOW() WHERE id = ?',
        [transaction.id]
      );
      
      console.log('✅ Crédito adicionado! Usuário:', transaction.user_id, 'Créditos:', transaction.credits);
    }
    
    res.status(200).json({ success: true, message: 'Webhook processado!' });
  } catch (error) {
    console.error('❌ Erro:', error);
    res.status(200).json({ success: true, message: 'Webhook recebido com erro' });
  }
});

// Rota de teste
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Webhook server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Webhook server rodando na porta ${PORT}`);
});

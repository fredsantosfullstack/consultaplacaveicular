import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs/promises';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

// Force redeploy to refresh database connection - 2026-01-09

import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import settingsRoutes from './routes/settings.js';
import consultationRoutes from './routes/consultations.js';
import rechargePlanRoutes from './routes/recharge_plans.js';
import priceTableRoutes from './routes/price_table.js';
import systemStatusRoutes from './routes/system_status.js';
import apiKeysRoutes from './routes/api_keys.js';
import reportsRoutes from './routes/reports.js';
import paymentsRoutes from './routes/payments.js';
import termsRoutes from './routes/terms.js';
import notificationsRoutes from './routes/notifications.js';
import crlveOrdersRoutes from './routes/crlve_orders.js';
import cmsRoutes from './routes/cms.js';
import db from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

const ensureCmsTables = async () => {
  try {
    const [tables] = await db.query("SHOW TABLES LIKE 'site_config'");
    if (tables.length > 0) {
      console.log('✅ Tabelas CMS já existem. Pulando migrations automáticas.');
      return;
    }

    console.log('⚠️ Tabelas CMS não encontradas. Executando migrations automaticamente...');
    const sqlPath = path.join(__dirname, '../migrations/create_cms_tables.sql');
    const sql = await fs.readFile(sqlPath, 'utf8');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_DATABASE || 'railway',
      multipleStatements: true
    });

    await connection.query(sql);
    await connection.end();
    console.log('✅ Migrations executadas automaticamente.');
  } catch (error) {
    console.error('❌ Erro ao executar migrations automáticas:', error);
    throw error;
  }
};

// WEBHOOK DO ASAAS - DEVE VIR ANTES DE TUDO!
app.use(express.json({ limit: '10mb' })); // Necessário para ler o body

app.post('/api/payments/webhook', async (req, res) => {
  console.log('🔔 WEBHOOK RECEBIDO! - ROTA PRIORITÁRIA');
  console.log('Method:', req.method);
  console.log('Headers:', req.headers);
  console.log('Body:', JSON.stringify(req.body, null, 2));
  
  const webhookData = req.body;
  
  try {
    // Processar apenas eventos de pagamento confirmado
    if (webhookData.event === 'PAYMENT_CONFIRMED' || webhookData.event === 'PAYMENT_RECEIVED') {
      const paymentId = webhookData.payment.id;
      
      console.log('💰 Processando pagamento:', paymentId);
      
      // Buscar transação no banco
      const [transactions] = await db.query(
        'SELECT * FROM payment_transactions WHERE asaas_payment_id = ? AND status = "pending"',
        [paymentId]
      );
      
      if (transactions.length === 0) {
        console.log('⚠️ Transação não encontrada ou já processada:', paymentId);
        return res.status(200).json({ success: true, message: 'Transação já processada' });
      }
      
      const transaction = transactions[0];
      
      // Adicionar créditos ao usuário
      await db.query(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [transaction.credits, transaction.user_id]
      );
      
      // Atualizar status da transação
      await db.query(
        'UPDATE payment_transactions SET status = "confirmed", paid_at = NOW() WHERE id = ?',
        [transaction.id]
      );
      
      console.log('✅ Crédito adicionado com sucesso! Usuário:', transaction.user_id, 'Créditos:', transaction.credits);
    }
    
    return res.status(200).json({ success: true, message: 'Webhook processado com sucesso!' });
  } catch (error) {
    console.error('❌ Erro ao processar webhook:', error);
    return res.status(200).json({ success: true, message: 'Webhook recebido, mas houve erro no processamento' });
  }
});

// Middlewares
// Configuração de CORS dinâmica baseada no ambiente
const allowedOrigins = [
  'http://localhost:5174',
  'http://localhost:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:4173',
  'http://localhost:4173',
  'https://consultaplacaveicular.vercel.app',
  'https://consultaplacaveicular.com.br',
  'https://www.consultaplacaveicular.com.br',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem 'origin' (ex: mobile apps, curl, Postman, Webhooks)
    if (!origin) return callback(null, true);
    
    // Permite origens do Asaas (webhooks)
    if (origin && origin.includes('asaas.com')) {
      return callback(null, true);
    }
    
    const isLocalhost = origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1');
    if (isLocalhost || allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    console.log(' CORS bloqueado para origem:', origin);
    const msg = 'A política de CORS para este site não permite acesso da Origem especificada.';
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-New-Balance'],
  exposedHeaders: ['X-New-Balance'], // Expor o header customizado
}));

// Log para debug
const publicPath = path.join(__dirname, '../public');
console.log(' Servindo arquivos estáticos de:', publicPath);

app.use(express.static(publicPath)); // Serve arquivos estáticos da pasta public

// Rotas
app.get('/', (req, res) => res.json({ message: 'API Consultaplacaveicular está no ar!' }));

// Debug endpoint para verificar variáveis de ambiente
app.get('/debug/env', (req, res) => {
  res.json({
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_USER: process.env.DB_USER,
    DB_DATABASE: process.env.DB_DATABASE,
    NODE_ENV: process.env.NODE_ENV,
    FRONTEND_URL: process.env.FRONTEND_URL
  });
});

// Rota para a página de consulta Base Estadual
app.get('/consultas/base-estadual.html', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Consulta Base Estadual</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
        .header { background-color: #000042; color: white; padding: 15px 20px; font-size: 18px; }
        .container { max-width: 600px; margin: 50px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #333; margin-bottom: 10px; }
        .price { text-align: center; color: #666; margin-bottom: 30px; }
        label { display: block; margin-bottom: 8px; color: #333; font-weight: 500; }
        input[type="text"] { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-size: 16px; margin-bottom: 20px; }
        button { width: 100%; padding: 15px; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; margin-bottom: 10px; }
        .btn-consultar { background-color: #007bff; color: white; }
        .btn-consultar:hover { background-color: #0056b3; }
        .btn-voltar { background-color: #6c757d; color: white; }
        .btn-voltar:hover { background-color: #545b62; }
        .message { padding: 15px; border-radius: 4px; margin-top: 20px; display: none; }
        .message.success { background-color: #d4edda; color: #155724; border: 1px solid #c3e6cb; }
        .message.error { background-color: #f8d7da; color: #721c24; border: 1px solid #f5c6cb; }
        .loading { display: none; text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="header">Consulta Base Estadual</div>
    <div class="container">
        <h1>Base Estadual</h1>
        <p class="price">Valor da consulta: R$ 10,00</p>
        <form id="consultaForm">
            <label for="placa">Placa do Veículo:</label>
            <input type="text" id="placa" name="placa" placeholder="ABC1234" required maxlength="7">
            <button type="submit" class="btn-consultar">Consultar</button>
            <button type="button" class="btn-voltar" onclick="window.location.href='http://localhost:5173/dashboard'">Voltar</button>
        </form>
        <div class="loading" id="loading">Processando consulta...</div>
        <div class="message" id="message"></div>
    </div>
    <script>
        document.getElementById('consultaForm').addEventListener('submit', async function(e) {
            e.preventDefault();
            const placa = document.getElementById('placa').value;
            const loading = document.getElementById('loading');
            const message = document.getElementById('message');
            const submitBtn = document.querySelector('.btn-consultar');
            loading.style.display = 'block';
            message.style.display = 'none';
            submitBtn.disabled = true;
            try {
                const response = await fetch('http://localhost:3001/api/consultations/execute/base-estadual', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ placa })
                });
                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'consulta-base-estadual-' + placa + '.pdf';
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                    message.className = 'message success';
                    message.textContent = 'Download do PDF iniciado com sucesso!';
                    message.style.display = 'block';
                } else {
                    const errorData = await response.json();
                    message.className = 'message error';
                    message.textContent = errorData.msg || 'Erro ao processar consulta.';
                    message.style.display = 'block';
                }
            } catch (error) {
                message.className = 'message error';
                message.textContent = 'Erro de conexão. Tente novamente.';
                message.style.display = 'block';
            } finally {
                loading.style.display = 'none';
                submitBtn.disabled = false;
            }
        });
    </script>
</body>
</html>
  `);
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/recharge-plans', rechargePlanRoutes);
app.use('/api/price-table', priceTableRoutes);
app.use('/api/system-status', systemStatusRoutes);
app.use('/api/api-keys', apiKeysRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/terms', termsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/crlve-orders', crlveOrdersRoutes);
app.use('/api/cms', cmsRoutes);

const startServer = async () => {
  try {
    await ensureCmsTables();
    // Testa a conexão com o banco de dados
    const connection = await db.getConnection();

    console.log('✅ Conexão com o banco de dados bem-sucedida!');
    connection.release();

    app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
  } catch (error) {
    console.error('❌ Falha na conexão com o banco de dados:', error);
    process.exitCode = 1; // Encerra o processo com erro
  }
};

startServer();
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Carregar variáveis de ambiente
dotenv.config({ path: join(__dirname, '..', '.env') });

async function runMigration() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'consultaplacaveicular'
    });

    console.log('✅ Conectado ao banco de dados!');
    console.log('');

    // 1. Adicionar colunas do Mercado Pago
    console.log('📝 Adicionando colunas mp_preference_id e mp_payment_id...');
    try {
      await connection.query(`
        ALTER TABLE payment_transactions 
        ADD COLUMN mp_preference_id VARCHAR(255) NULL AFTER asaas_payment_id
      `);
      console.log('✅ Coluna mp_preference_id adicionada');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  Coluna mp_preference_id já existe');
      } else {
        throw error;
      }
    }

    try {
      await connection.query(`
        ALTER TABLE payment_transactions 
        ADD COLUMN mp_payment_id VARCHAR(255) NULL AFTER mp_preference_id
      `);
      console.log('✅ Coluna mp_payment_id adicionada');
    } catch (error) {
      if (error.code === 'ER_DUP_FIELDNAME') {
        console.log('⚠️  Coluna mp_payment_id já existe');
      } else {
        throw error;
      }
    }

    // 2. Adicionar índices
    console.log('');
    console.log('📝 Adicionando índices...');
    try {
      await connection.query(`
        ALTER TABLE payment_transactions 
        ADD INDEX idx_mp_preference_id (mp_preference_id)
      `);
      console.log('✅ Índice idx_mp_preference_id adicionado');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⚠️  Índice idx_mp_preference_id já existe');
      } else {
        throw error;
      }
    }

    try {
      await connection.query(`
        ALTER TABLE payment_transactions 
        ADD INDEX idx_mp_payment_id (mp_payment_id)
      `);
      console.log('✅ Índice idx_mp_payment_id adicionado');
    } catch (error) {
      if (error.code === 'ER_DUP_KEYNAME') {
        console.log('⚠️  Índice idx_mp_payment_id já existe');
      } else {
        throw error;
      }
    }

    // 3. Adicionar configuração do Mercado Pago
    console.log('');
    console.log('📝 Adicionando configuração do Mercado Pago...');
    await connection.query(`
      INSERT INTO site_settings (setting_key, setting_value, created_at, updated_at)
      VALUES ('mercado_pago_access_token', '', NOW(), NOW())
      ON DUPLICATE KEY UPDATE updated_at = NOW()
    `);
    console.log('✅ Configuração mercado_pago_access_token adicionada');

    // 4. Verificar estrutura
    console.log('');
    console.log('📊 Verificando estrutura da tabela payment_transactions...');
    const [columns] = await connection.query('DESCRIBE payment_transactions');
    const mpColumns = columns.filter(col => 
      col.Field === 'mp_preference_id' || col.Field === 'mp_payment_id'
    );
    
    if (mpColumns.length === 2) {
      console.log('✅ Colunas do Mercado Pago encontradas:');
      mpColumns.forEach(col => {
        console.log(`   - ${col.Field} (${col.Type})`);
      });
    }

    console.log('');
    console.log('📊 Verificando configuração no site_settings...');
    const [settings] = await connection.query(
      'SELECT * FROM site_settings WHERE setting_key = ?',
      ['mercado_pago_access_token']
    );
    
    if (settings.length > 0) {
      console.log('✅ Configuração encontrada:');
      console.log(`   - setting_key: ${settings[0].setting_key}`);
      console.log(`   - setting_value: ${settings[0].setting_value || '(vazio)'}`);
    }

    console.log('');
    console.log('🎉 Migração concluída com sucesso!');
    console.log('');
    console.log('📌 Próximos passos:');
    console.log('   1. Acesse o painel admin');
    console.log('   2. Vá em Configurações do Site');
    console.log('   3. Configure o Access Token do Mercado Pago');
    console.log('   4. Teste a recarga de créditos');

  } catch (error) {
    console.error('');
    console.error('❌ Erro ao executar migração:', error.message);
    console.error('');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('');
      console.log('🔌 Conexão com banco de dados encerrada');
    }
  }
}

runMigration();

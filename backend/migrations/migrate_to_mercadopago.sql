-- Migração de Asaas para Mercado Pago
-- Execute este script no banco de dados MySQL

-- 1. Adicionar colunas do Mercado Pago na tabela payment_transactions
ALTER TABLE payment_transactions 
ADD COLUMN mp_preference_id VARCHAR(255) NULL AFTER asaas_payment_id,
ADD COLUMN mp_payment_id VARCHAR(255) NULL AFTER mp_preference_id;

-- 2. Adicionar índices para melhor performance
ALTER TABLE payment_transactions 
ADD INDEX idx_mp_preference_id (mp_preference_id),
ADD INDEX idx_mp_payment_id (mp_payment_id);

-- 3. Adicionar configuração do Mercado Pago na tabela site_settings
INSERT INTO site_settings (setting_key, setting_value, created_at, updated_at)
VALUES ('mercado_pago_access_token', '', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 4. Atualizar método de pagamento nas transações existentes (opcional)
-- UPDATE payment_transactions SET payment_method = 'mercadopago' WHERE payment_method = 'pix';

-- Verificar estrutura atualizada
DESCRIBE payment_transactions;
SELECT * FROM site_settings WHERE setting_key = 'mercado_pago_access_token';

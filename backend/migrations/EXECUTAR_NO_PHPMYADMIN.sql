-- ========================================
-- MIGRAÇÃO MERCADO PAGO
-- Execute este SQL no phpMyAdmin
-- ========================================

-- 1. Adicionar colunas do Mercado Pago na tabela payment_transactions
ALTER TABLE payment_transactions 
ADD COLUMN IF NOT EXISTS mp_preference_id VARCHAR(255) NULL AFTER asaas_payment_id,
ADD COLUMN IF NOT EXISTS mp_payment_id VARCHAR(255) NULL AFTER mp_preference_id;

-- 2. Adicionar índices para melhor performance
ALTER TABLE payment_transactions 
ADD INDEX IF NOT EXISTS idx_mp_preference_id (mp_preference_id),
ADD INDEX IF NOT EXISTS idx_mp_payment_id (mp_payment_id);

-- 3. Adicionar configuração do Mercado Pago na tabela site_settings
INSERT INTO site_settings (setting_key, setting_value, created_at, updated_at)
VALUES ('mercado_pago_access_token', '', NOW(), NOW())
ON DUPLICATE KEY UPDATE updated_at = NOW();

-- 4. Verificar se deu certo
SELECT 'Verificando colunas criadas...' AS status;
DESCRIBE payment_transactions;

SELECT 'Verificando configuração criada...' AS status;
SELECT * FROM site_settings WHERE setting_key = 'mercado_pago_access_token';

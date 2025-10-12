-- ============================================
-- SCRIPT COMPLETO: VERIFICAR E POPULAR SISTEMA DE PAGAMENTOS
-- Execute este script no MySQL Workbench
-- ============================================

-- Selecionar banco de dados
USE goldenveicular;

-- ============================================
-- 1. VERIFICAR SE TABELAS EXISTEM
-- ============================================
SELECT 
    'Verificando tabelas existentes...' AS status;

SELECT 
    TABLE_NAME,
    TABLE_ROWS,
    CREATE_TIME
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'goldenveicular' 
AND TABLE_NAME IN ('recharge_plans', 'payment_transactions', 'webhook_logs')
ORDER BY TABLE_NAME;

-- ============================================
-- 2. CRIAR TABELA DE PLANOS DE RECARGA (SE NÃO EXISTIR)
-- ============================================
CREATE TABLE IF NOT EXISTS recharge_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    is_popular BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_price (price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. CRIAR TABELA DE TRANSAÇÕES DE PAGAMENTO (SE NÃO EXISTIR)
-- ============================================
CREATE TABLE IF NOT EXISTS payment_transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    plan_id INT NOT NULL,
    asaas_payment_id VARCHAR(100) UNIQUE,
    amount DECIMAL(10, 2) NOT NULL,
    credits INT NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled', 'expired') DEFAULT 'pending',
    payment_method ENUM('pix', 'boleto', 'credit_card') DEFAULT 'pix',
    pix_qr_code TEXT,
    pix_payload TEXT,
    expires_at DATETIME,
    paid_at DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES recharge_plans(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_asaas_payment_id (asaas_payment_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. CRIAR TABELA DE LOGS DE WEBHOOK (SE NÃO EXISTIR)
-- ============================================
CREATE TABLE IF NOT EXISTS webhook_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    payment_id VARCHAR(100),
    payload JSON,
    processed BOOLEAN DEFAULT FALSE,
    error_message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_payment_id (payment_id),
    INDEX idx_processed (processed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. VERIFICAR SE JÁ EXISTEM PLANOS
-- ============================================
SELECT 
    'Verificando planos existentes...' AS status;

SELECT COUNT(*) AS total_planos FROM recharge_plans;

-- ============================================
-- 6. POPULAR PLANOS DE RECARGA (SE ESTIVER VAZIO)
-- ============================================
-- Limpar planos existentes (OPCIONAL - comente se quiser manter)
-- DELETE FROM recharge_plans;

-- Inserir planos (ignora se já existir)
INSERT IGNORE INTO recharge_plans (name, description, credits, price, is_popular, is_active) VALUES
('Básico', 'Ideal para consultas esporádicas', 50, 50.00, FALSE, TRUE),
('Popular', 'Melhor custo-benefício - Mais vendido!', 100, 100.00, TRUE, TRUE),
('Premium', 'Para uso intensivo', 200, 200.00, FALSE, TRUE),
('Empresarial', 'Plano corporativo com maior volume', 500, 500.00, FALSE, TRUE),
('Mega', 'Para grandes empresas', 1000, 1000.00, FALSE, TRUE);

-- ============================================
-- 7. VERIFICAR DADOS INSERIDOS
-- ============================================
SELECT 
    '✅ PLANOS DE RECARGA CADASTRADOS:' AS status;

SELECT 
    id,
    name,
    description,
    credits,
    CONCAT('R$ ', FORMAT(price, 2, 'pt_BR')) AS preco,
    CASE WHEN is_popular THEN '⭐ SIM' ELSE 'NÃO' END AS popular,
    CASE WHEN is_active THEN '✅ ATIVO' ELSE '❌ INATIVO' END AS status
FROM recharge_plans
ORDER BY price ASC;

-- ============================================
-- 8. VERIFICAR TRANSAÇÕES EXISTENTES
-- ============================================
SELECT 
    '📊 TRANSAÇÕES DE PAGAMENTO:' AS status;

SELECT COUNT(*) AS total_transacoes FROM payment_transactions;

SELECT 
    pt.id,
    u.name AS usuario,
    rp.name AS plano,
    CONCAT('R$ ', FORMAT(pt.amount, 2, 'pt_BR')) AS valor,
    pt.credits AS creditos,
    pt.status,
    pt.created_at AS data_criacao,
    pt.paid_at AS data_pagamento
FROM payment_transactions pt
LEFT JOIN users u ON pt.user_id = u.id
LEFT JOIN recharge_plans rp ON pt.plan_id = rp.id
ORDER BY pt.created_at DESC
LIMIT 10;

-- ============================================
-- 9. VERIFICAR LOGS DE WEBHOOK
-- ============================================
SELECT 
    '📩 LOGS DE WEBHOOK:' AS status;

SELECT COUNT(*) AS total_webhooks FROM webhook_logs;

SELECT 
    id,
    event_type,
    payment_id,
    CASE WHEN processed THEN '✅ PROCESSADO' ELSE '⏳ PENDENTE' END AS status,
    created_at
FROM webhook_logs
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- 10. RESUMO FINAL
-- ============================================
SELECT 
    '🎉 RESUMO DO SISTEMA DE PAGAMENTOS' AS status;

SELECT 
    (SELECT COUNT(*) FROM recharge_plans WHERE is_active = TRUE) AS planos_ativos,
    (SELECT COUNT(*) FROM payment_transactions) AS total_transacoes,
    (SELECT COUNT(*) FROM payment_transactions WHERE status = 'confirmed') AS transacoes_confirmadas,
    (SELECT COUNT(*) FROM payment_transactions WHERE status = 'pending') AS transacoes_pendentes,
    (SELECT COUNT(*) FROM webhook_logs) AS total_webhooks,
    (SELECT COUNT(*) FROM webhook_logs WHERE processed = TRUE) AS webhooks_processados;

-- ============================================
-- ✅ SCRIPT CONCLUÍDO COM SUCESSO!
-- ============================================
SELECT '✅ Script executado com sucesso! Sistema de pagamentos pronto.' AS resultado;

-- ============================================
-- SETUP COMPLETO: BANCO + TABELAS + DADOS
-- Execute este script no MySQL Workbench
-- ============================================

-- ============================================
-- 1. CRIAR BANCO DE DADOS
-- ============================================
CREATE DATABASE IF NOT EXISTS goldenveicular
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Selecionar banco
USE goldenveicular;

SELECT 'Banco de dados goldenveicular criado/selecionado!' AS status;

-- ============================================
-- 2. CRIAR TABELA DE USUÁRIOS (SE NÃO EXISTIR)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  document_type ENUM('CPF', 'CNPJ') DEFAULT 'CPF',
  document_number VARCHAR(20),
  phone VARCHAR(20),
  avatar VARCHAR(255),
  balance DECIMAL(10, 2) DEFAULT 0.00,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. CRIAR TABELA DE PLANOS DE RECARGA
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
-- 4. CRIAR TABELA DE TRANSAÇÕES DE PAGAMENTO
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
-- 5. CRIAR TABELA DE LOGS DE WEBHOOK
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
-- 6. CRIAR TABELA DE TIPOS DE CONSULTA
-- ============================================
CREATE TABLE IF NOT EXISTS consultation_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  is_new BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_active (is_active),
  INDEX idx_display_order (display_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. CRIAR TABELA DE HISTÓRICO DE CONSULTAS
-- ============================================
CREATE TABLE IF NOT EXISTS consultation_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  consultation_type VARCHAR(255) NOT NULL,
  plate VARCHAR(10),
  cost DECIMAL(10, 2) NOT NULL,
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  result_data TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. CRIAR TABELA DE CONFIGURAÇÕES
-- ============================================
CREATE TABLE IF NOT EXISTS api_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. POPULAR PLANOS DE RECARGA
-- ============================================
INSERT INTO recharge_plans (name, description, credits, price, is_popular, is_active) VALUES
('Básico', 'Ideal para consultas esporádicas', 50, 50.00, FALSE, TRUE),
('Popular', 'Melhor custo-benefício - Mais vendido!', 100, 100.00, TRUE, TRUE),
('Premium', 'Para uso intensivo', 200, 200.00, FALSE, TRUE),
('Empresarial', 'Plano corporativo com maior volume', 500, 500.00, FALSE, TRUE),
('Mega', 'Para grandes empresas', 1000, 1000.00, FALSE, TRUE)
ON DUPLICATE KEY UPDATE name=name;

-- ============================================
-- 10. CRIAR USUÁRIO ADMIN (OPCIONAL)
-- ============================================
-- Senha: admin123 (você deve trocar depois)
INSERT INTO users (name, email, password, document_type, document_number, balance, role, is_active) 
VALUES (
  'Admin Golden',
  'admin@goldenveicular.com',
  '$2a$10$rZ5YhkKX8qN9vL3mJ2wXXeF5K8YhkKX8qN9vL3mJ2wXXeF5K8YhkK',
  'CPF',
  '00000000000',
  999999.99,
  'admin',
  TRUE
) ON DUPLICATE KEY UPDATE email=email;

-- ============================================
-- 11. VERIFICAR ESTRUTURA CRIADA
-- ============================================
SELECT '✅ TABELAS CRIADAS:' AS status;
SHOW TABLES;

SELECT '✅ PLANOS DE RECARGA:' AS status;
SELECT 
    id,
    name,
    credits,
    CONCAT('R$ ', FORMAT(price, 2, 'pt_BR')) AS preco,
    CASE WHEN is_popular THEN '⭐ SIM' ELSE 'NÃO' END AS popular,
    CASE WHEN is_active THEN '✅ ATIVO' ELSE '❌ INATIVO' END AS status
FROM recharge_plans
ORDER BY price ASC;

SELECT '✅ USUÁRIOS:' AS status;
SELECT 
    id,
    name,
    email,
    role,
    CONCAT('R$ ', FORMAT(balance, 2, 'pt_BR')) AS saldo,
    created_at
FROM users;

-- ============================================
-- 12. RESUMO FINAL
-- ============================================
SELECT 
    '🎉 SETUP COMPLETO!' AS status,
    (SELECT COUNT(*) FROM users) AS total_usuarios,
    (SELECT COUNT(*) FROM recharge_plans) AS total_planos,
    (SELECT COUNT(*) FROM consultation_types) AS total_consultas,
    (SELECT COUNT(*) FROM payment_transactions) AS total_transacoes;

SELECT '✅ Banco de dados configurado com sucesso!' AS resultado;
SELECT '🚀 Sistema de pagamentos pronto para uso!' AS resultado;

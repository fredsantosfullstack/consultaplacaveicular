-- ============================================
-- GOLDEN VEICULAR - SETUP COMPLETO DO BANCO
-- Railway MySQL Database
-- ============================================

-- ============================================
-- 1. TABELA DE USUÁRIOS
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  document_type ENUM('cpf', 'cnpj') NOT NULL DEFAULT 'cpf',
  document_number VARCHAR(20) NOT NULL,
  phone VARCHAR(20),
  balance DECIMAL(10, 2) DEFAULT 0.00,
  role ENUM('user', 'admin') DEFAULT 'user',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_document (document_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. TABELA DE TIPOS DE CONSULTA
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
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_slug (slug),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. TABELA DE HISTÓRICO DE CONSULTAS
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
  INDEX idx_status (status),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. TABELA DE TRANSAÇÕES DE CRÉDITO
-- ============================================
CREATE TABLE IF NOT EXISTS credit_transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  type ENUM('credit', 'debit') NOT NULL,
  description VARCHAR(255),
  payment_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user (user_id),
  INDEX idx_payment (payment_id),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. TABELA DE CONFIGURAÇÕES ADMIN
-- ============================================
CREATE TABLE IF NOT EXISTS admin_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_key (setting_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. INSERIR USUÁRIO ADMIN PADRÃO
-- ============================================
-- Senha: admin123 (hash bcrypt)
INSERT INTO users (name, email, password, document_type, document_number, phone, balance, role, is_active) 
VALUES (
  'Administrador',
  'admin@goldenveicular.com',
  '$2b$10$rZ5YhkKX8qN9vL3mJ2wXXeF5K8YhkKX8qN9vL3mJ2wXXeF5K8YhkK',
  'cpf',
  '00000000000',
  '(00) 00000-0000',
  1000.00,
  'admin',
  TRUE
) ON DUPLICATE KEY UPDATE email=email;

-- ============================================
-- 7. INSERIR TIPOS DE CONSULTA
-- ============================================
INSERT INTO consultation_types (name, slug, description, icon, price, is_new, is_active) VALUES
('Base Nacional', 'base-nacional', 'Base oficial do DENATRAN', 'Database', 12.00, FALSE, TRUE),
('Base Estadual', 'base-estadual', 'Consulta base estadual', 'MapPin', 10.00, FALSE, TRUE),
('CRLV-E TURBO', 'crlv-e-turbo', 'CRLV-E para múltiplos estados', 'Zap', 5.00, TRUE, TRUE),
('Código de segurança PDF', 'codigo-seguranca-pdf', 'Através da placa Retorna CRV DIGITAL', 'ShieldCheck', 10.00, FALSE, TRUE),
('CSV - RENAINF - RENAJUD - RECALL - BIN - PROPRIETAR', 'csv-renainf-renajud-recall-bin-proprietar', 'Consulta completa de restrições', 'FileSearch', 15.00, FALSE, TRUE),
('Gravame V2', 'gravame-v2', 'Consulta de gravames e restrições financeiras', 'Lock', 8.00, FALSE, TRUE),
('Ano Licenciamento BIN Nacional', 'ano-licenciamento-bin-nacional', 'Consulta ano de licenciamento', 'Calendar', 7.00, FALSE, TRUE),
('Consulta Cautelar', 'consulta-cautelar', 'Verifica medidas cautelares', 'AlertTriangle', 12.00, FALSE, TRUE),
('Consulta Chassi', 'consulta-chassi', 'Consulta por número do chassi', 'Hash', 10.00, FALSE, TRUE),
('Consulta Leilão', 'consulta-leilao', 'Consulta informações sobre leilão do veículo', 'Search', 15.00, TRUE, TRUE),
('Consulta Comunicado Venda', 'consulta-comunicado-venda', 'Verifica comunicado de venda', 'FileText', 8.00, FALSE, TRUE),
('CRLV-E Agendado', 'crlv-e-agendado', 'CRLV-E com agendamento', 'Clock', 10.00, FALSE, TRUE),
('Nº CRV Digital Agendado', 'crv-digital-agendado', 'Número CRV DIGITAL APENAS', 'FileText', 12.00, TRUE, TRUE),
('Proprietário Atual V2', 'proprietario-atual-v2', 'Dados do proprietário atual - versão 2', 'User', 10.00, FALSE, TRUE),
('Proprietário Atual Restrições', 'proprietario-atual-restricoes', 'Proprietário com restrições detalhadas', 'UserX', 12.00, FALSE, TRUE),
('Reemissão ATPV-E', 'reemissao-atpv-e', 'Reemissão de ATPV-E digital', 'RefreshCw', 15.00, FALSE, TRUE),
('Verifica Autenticidade CRV', 'verifica-autenticidade-crv', 'Valida autenticidade do CRV', 'ShieldCheck', 8.00, FALSE, TRUE)
ON DUPLICATE KEY UPDATE slug=slug;

-- ============================================
-- 8. INSERIR CONFIGURAÇÕES PADRÃO
-- ============================================
INSERT INTO admin_settings (setting_key, setting_value, description) VALUES
('site_name', 'Golden Veicular', 'Nome do site'),
('site_email', 'contato@goldenveicular.com', 'Email de contato'),
('site_phone', '(00) 0000-0000', 'Telefone de contato'),
('min_recharge', '10.00', 'Valor mínimo de recarga'),
('max_recharge', '10000.00', 'Valor máximo de recarga'),
('maintenance_mode', 'false', 'Modo de manutenção')
ON DUPLICATE KEY UPDATE setting_key=setting_key;

-- ============================================
-- 9. CRIAR ÍNDICES ADICIONAIS PARA PERFORMANCE
-- ============================================
ALTER TABLE consultation_history ADD INDEX idx_plate (plate);
ALTER TABLE consultation_history ADD INDEX idx_cost (cost);
ALTER TABLE credit_transactions ADD INDEX idx_amount (amount);
ALTER TABLE credit_transactions ADD INDEX idx_type (type);

-- ============================================
-- 10. VERIFICAR ESTRUTURA
-- ============================================
SHOW TABLES;

SELECT 'Database setup completed successfully!' AS status;
SELECT COUNT(*) AS total_users FROM users;
SELECT COUNT(*) AS total_consultation_types FROM consultation_types;
SELECT COUNT(*) AS total_settings FROM admin_settings;

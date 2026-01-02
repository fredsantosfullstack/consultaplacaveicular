-- ========================================
-- MIGRATIONS CMS - LANDING PAGE CUSTOMIZÁVEL
-- Sistema completo de gerenciamento de conteúdo
-- ========================================

-- 1. Configurações gerais do site
CREATE TABLE IF NOT EXISTS site_config (
  id INT PRIMARY KEY AUTO_INCREMENT,
  logo_url VARCHAR(500) DEFAULT NULL,
  favicon_url VARCHAR(500) DEFAULT NULL,
  primary_color VARCHAR(7) DEFAULT '#076AC2',
  secondary_color VARCHAR(7) DEFAULT '#4A90E2',
  whatsapp_number VARCHAR(20) DEFAULT NULL,
  whatsapp_message TEXT DEFAULT NULL,
  seo_title VARCHAR(255) DEFAULT 'Consulta Placa Veicular',
  seo_description TEXT DEFAULT NULL,
  seo_keywords TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir configuração padrão
INSERT INTO site_config (id, seo_title, seo_description, seo_keywords, whatsapp_message) 
VALUES (
  1,
  'Consulta Placa Veicular - Rápido e Seguro',
  'Plataforma completa de consultas veiculares. Consulte placa, chassi, RENAVAM de forma rápida e segura.',
  'consulta veicular, placa, chassi, renavam, veículo, carro, moto',
  'Olá! Vim pelo site e gostaria de mais informações.'
) ON DUPLICATE KEY UPDATE id=id;

-- 2. Hero Section (primeira dobra)
CREATE TABLE IF NOT EXISTS site_hero (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) DEFAULT 'Plataforma 100% Online',
  subtitle VARCHAR(255) DEFAULT 'Consultas Veiculares',
  description TEXT DEFAULT 'Mais do que dados: entregamos confiança para você tomar a melhor decisão na compra ou venda do seu veículo.',
  cta_primary_text VARCHAR(100) DEFAULT 'Iniciar Consulta',
  cta_primary_link VARCHAR(255) DEFAULT '/login',
  cta_whatsapp_text VARCHAR(100) DEFAULT 'Falar no WhatsApp',
  background_gradient_from VARCHAR(7) DEFAULT '#667eea',
  background_gradient_to VARCHAR(7) DEFAULT '#764ba2',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir hero padrão
INSERT INTO site_hero (id) VALUES (1) ON DUPLICATE KEY UPDATE id=id;

-- 3. Benefícios (cards do hero)
CREATE TABLE IF NOT EXISTS site_benefits (
  id INT PRIMARY KEY AUTO_INCREMENT,
  icon VARCHAR(50) DEFAULT 'shield-check',
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir benefícios padrão
INSERT INTO site_benefits (icon, title, description, display_order) VALUES
('shield-check', '100% Seguro', 'Dados protegidos e criptografados', 1),
('zap', 'Ultra Rápido', 'Resultados em segundos', 2),
('file-text', 'CRLV Digital', 'Acesso imediato ao documento', 3)
ON DUPLICATE KEY UPDATE id=id;

-- 4. Estatísticas
CREATE TABLE IF NOT EXISTS site_statistics (
  id INT PRIMARY KEY AUTO_INCREMENT,
  number VARCHAR(20) NOT NULL,
  label VARCHAR(100) NOT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir estatísticas padrão
INSERT INTO site_statistics (number, label, display_order) VALUES
('50K+', 'Clientes', 1),
('26', 'Cidades', 2),
('99%', 'Satisfação', 3),
('24h', 'Online', 4)
ON DUPLICATE KEY UPDATE id=id;

-- 5. Serviços
CREATE TABLE IF NOT EXISTS site_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  features JSON DEFAULT NULL,
  is_highlighted BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (display_order),
  INDEX idx_active (is_active),
  INDEX idx_highlighted (is_highlighted)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir serviços padrão
INSERT INTO site_services (name, description, price, features, is_highlighted, display_order) VALUES
(
  'Consulta PME Cadastur',
  'Consulta completa de veículo',
  19.90,
  JSON_ARRAY('Dados do veículo', 'Histórico de proprietários', 'Restrições', 'Débitos'),
  TRUE,
  1
),
(
  'CRLV e Bigital',
  'Documento digital do veículo',
  29.90,
  JSON_ARRAY('CRLV Digital', 'Válido nacionalmente', 'Download imediato', 'Sem burocracia'),
  FALSE,
  2
),
(
  'Base Nacional',
  'Consulta em base nacional',
  39.90,
  JSON_ARRAY('Dados completos', 'Histórico detalhado', 'Restrições judiciais', 'Relatório PDF'),
  FALSE,
  3
)
ON DUPLICATE KEY UPDATE id=id;

-- 6. Como Funciona (passos)
CREATE TABLE IF NOT EXISTS site_steps (
  id INT PRIMARY KEY AUTO_INCREMENT,
  icon VARCHAR(50) DEFAULT 'user-plus',
  title VARCHAR(100) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir passos padrão
INSERT INTO site_steps (icon, title, description, display_order) VALUES
('user-plus', 'Cadastre-se', 'Crie sua conta gratuitamente em menos de 1 minuto', 1),
('search', 'Informe a Placa', 'Digite a placa do veículo que deseja consultar', 2),
('download', 'Baixe o PDF', 'Receba o relatório completo instantaneamente', 3)
ON DUPLICATE KEY UPDATE id=id;

-- 7. Links do rodapé
CREATE TABLE IF NOT EXISTS site_footer_links (
  id INT PRIMARY KEY AUTO_INCREMENT,
  label VARCHAR(100) NOT NULL,
  url VARCHAR(500) NOT NULL,
  category VARCHAR(50) DEFAULT 'geral',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_order (display_order),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir links padrão
INSERT INTO site_footer_links (label, url, category, display_order) VALUES
('Serviços', '#servicos', 'menu', 1),
('Como Funciona', '#como-funciona', 'menu', 2),
('Contato', '#contato', 'menu', 3),
('Termos de Uso', '/termos', 'legal', 4),
('Política de Privacidade', '/privacidade', 'legal', 5)
ON DUPLICATE KEY UPDATE id=id;

-- 8. Formulários de contato (leads)
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  message TEXT NOT NULL,
  status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new',
  ip_address VARCHAR(45) DEFAULT NULL,
  user_agent TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_created (created_at),
  INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ========================================
-- VERIFICAÇÕES
-- ========================================

-- Verificar tabelas criadas
SELECT 
  'Tabelas CMS criadas com sucesso!' AS status,
  COUNT(*) AS total_tabelas
FROM information_schema.tables 
WHERE table_schema = DATABASE() 
  AND table_name LIKE 'site_%' OR table_name = 'contact_submissions';

-- Mostrar estrutura
SHOW TABLES LIKE 'site_%';
SHOW TABLES LIKE 'contact_submissions';

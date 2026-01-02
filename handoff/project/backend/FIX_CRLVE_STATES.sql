-- ============================================
-- SCRIPT PARA CORRIGIR ESTADOS E PREÇOS CRLV-E
-- Execute no MySQL Workbench conectado ao Railway
-- ============================================

-- 1. Verificar se as tabelas existem
SELECT 
    TABLE_NAME,
    TABLE_ROWS
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = DATABASE() 
  AND TABLE_NAME IN ('crlve_states', 'crlve_settings', 'crlve_orders');

-- Se as tabelas não existirem, execute os blocos abaixo:

-- ============================================
-- 2. CRIAR TABELAS
-- ============================================

-- Tabela de Estados e Preços
CREATE TABLE IF NOT EXISTS crlve_states (
  id INT AUTO_INCREMENT PRIMARY KEY,
  state_code VARCHAR(2) NOT NULL UNIQUE,
  state_name VARCHAR(50) NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_state_code (state_code),
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Configurações da Página
CREATE TABLE IF NOT EXISTS crlve_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) DEFAULT 'Emissão CRLV-E OUTRAS UF',
  description TEXT DEFAULT 'Emissão de CRLV-E para estados disponíveis',
  warning_text TEXT,
  delivery_text VARCHAR(255) DEFAULT 'Prazo de entrega: Rápida no Horário Comercial 9:00 às 18:00',
  modal_title VARCHAR(255) DEFAULT 'Confirmar Solicitação',
  modal_text TEXT DEFAULT 'Após enviar, o pedido só poderá ser cancelado caso ultrapasse Prazo de Entrega: Rápida no Horário Comercial 9:00 às 18:00..',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Pedidos
CREATE TABLE IF NOT EXISTS crlve_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  placa VARCHAR(10) NOT NULL,
  renavam VARCHAR(20) NOT NULL,
  cpf_cnpj VARCHAR(20) NOT NULL,
  uf VARCHAR(2) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  status ENUM('pendente', 'em_andamento', 'concluido', 'cancelado') DEFAULT 'pendente',
  admin_notes TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at DESC)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. INSERIR ESTADOS E PREÇOS
-- ============================================

INSERT INTO crlve_states (state_code, state_name, price, is_active) VALUES
('AL', 'Alagoas', 30.00, TRUE),
('ES', 'Espírito Santo', 50.00, TRUE),
('MS', 'Mato Grosso do Sul', 50.00, TRUE),
('PB', 'Paraíba', 50.00, TRUE),
('PE', 'Pernambuco', 50.00, TRUE),
('PI', 'Piauí', 60.00, TRUE),
('DF', 'Distrito Federal', 50.00, TRUE),
('RJ', 'Rio de Janeiro', 20.00, TRUE),
('SC', 'Santa Catarina', 60.00, TRUE),
('AC', 'Acre', 45.00, TRUE),
('CE', 'Ceará', 60.00, TRUE),
('BA', 'Bahia', 30.00, TRUE),
('RN', 'Rio Grande do Norte', 60.00, TRUE),
('RO', 'Rondônia', 30.00, TRUE)
ON DUPLICATE KEY UPDATE 
  state_name = VALUES(state_name),
  price = VALUES(price),
  is_active = VALUES(is_active);

-- ============================================
-- 4. INSERIR CONFIGURAÇÃO PADRÃO
-- ============================================

INSERT INTO crlve_settings (id, title, description, warning_text, delivery_text, modal_title, modal_text, is_active) 
VALUES (
  1,
  'Emissão CRLV-E OUTRAS UF',
  'Emissão de CRLV-E para estados disponíveis',
  'Antes de enviar a solicitação, verifique se o veículo não possui algum dos itens abaixo que impeça a emissão do CRLV-e:\n\n• Intenção/Comunicação de Venda\n• Veículo Baixado\n• UF atual do veículo diferente\n• Verificar no Detran se o licenciamento está no ano atual ou anterior\n• Verificar se existem multas ativas\n• Bloqueios diversos\n\nATENÇÃO! SÓ SERÁ EMITIDO O CRLV-e DO ANO VIGENTE QUE ESTIVER DISPONÍVEL, APÓS A EMISSÃO NÃO SERÁ DEVOLVIDO O VALOR, UMA VEZ QUE ESTE INFORME JÁ DEIXA CLARO QUE É ESSENCIAL A PESQUISA PRÉVIA (CRLV-e não emitido não será cobrado).\n\nCRLV Disponível para todos os estados:\nPI, RO, AC, DF, SC, RJ, AL, PB, PE, ES, CE, MS. Estamos adicionando as UFs aos poucos.',
  'Prazo de entrega: Rápida no Horário Comercial 9:00 às 18:00',
  'Confirmar Solicitação',
  'Após enviar, o pedido só poderá ser cancelado caso ultrapasse Prazo de Entrega: Rápida no Horário Comercial 9:00 às 18:00..',
  TRUE
)
ON DUPLICATE KEY UPDATE 
  title = VALUES(title),
  description = VALUES(description),
  warning_text = VALUES(warning_text),
  delivery_text = VALUES(delivery_text),
  modal_title = VALUES(modal_title),
  modal_text = VALUES(modal_text),
  is_active = VALUES(is_active);

-- ============================================
-- 5. VERIFICAR RESULTADO
-- ============================================

-- Contar estados cadastrados
SELECT COUNT(*) as total_estados FROM crlve_states;

-- Listar todos os estados
SELECT 
    id,
    state_code as UF,
    state_name as Estado,
    CONCAT('R$ ', FORMAT(price, 2, 'pt_BR')) as Preço,
    CASE WHEN is_active THEN 'Ativo' ELSE 'Inativo' END as Status
FROM crlve_states 
ORDER BY state_name;

-- Verificar configurações
SELECT * FROM crlve_settings WHERE id = 1;

-- Verificar pedidos existentes
SELECT COUNT(*) as total_pedidos FROM crlve_orders;

SELECT '✅ Tabelas criadas e populadas com sucesso!' AS status;

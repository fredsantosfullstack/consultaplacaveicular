-- ========================================
-- CRIAR TABELA DE PREÇOS
-- Execute este script no MySQL Workbench
-- ========================================

-- Criar tabela price_table_items
CREATE TABLE IF NOT EXISTS price_table_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Copiar dados da tabela consultation_types para price_table_items
INSERT INTO price_table_items (name, price, is_active)
SELECT name, price, is_active FROM consultation_types;

-- Verificar
SELECT * FROM price_table_items;

SELECT '✅ Tabela de preços criada com sucesso!' as status;

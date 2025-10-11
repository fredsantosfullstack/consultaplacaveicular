-- Criar tabela de planos de recarga
CREATE TABLE IF NOT EXISTS `recharge_plans` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `credits` INT NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `bonus_credits` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir planos padrão
INSERT IGNORE INTO `recharge_plans` (`name`, `credits`, `price`, `bonus_credits`, `is_active`) VALUES
('Plano Básico', 100, 50.00, 0, TRUE),
('Plano Intermediário', 250, 100.00, 25, TRUE),
('Plano Avançado', 500, 180.00, 50, TRUE),
('Plano Premium', 1000, 300.00, 150, TRUE);

SELECT 'Tabela recharge_plans criada com sucesso!' as status;

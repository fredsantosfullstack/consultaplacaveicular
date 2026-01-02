-- ========================================
-- SCRIPT 1: ESTRUTURA BASE
-- Execute este script primeiro
-- ========================================

-- Criar tabela users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `document_type` VARCHAR(50),
  `document_number` VARCHAR(50),
  `phone` VARCHAR(50),
  `role` VARCHAR(50) DEFAULT 'user',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_email` (`email`),
  INDEX `idx_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Criar tabela para recuperação de senha
CREATE TABLE IF NOT EXISTS `password_resets` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL UNIQUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir usuário admin de teste (senha: admin123)
INSERT INTO `users` (`name`, `email`, `password`, `role`) 
VALUES ('Admin Golden', 'admin@goldenveicular.com.br', '$2b$10$yoYOGOKAjgVaN/YUOoqBxeAKRtCimXf5.tdC0cTuo/U01MJBh9Izu', 'admin')
ON DUPLICATE KEY UPDATE `name` = `name`;

SELECT '✅ Script 1 executado com sucesso!' as status;

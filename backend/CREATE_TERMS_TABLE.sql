-- ============================================
-- CRIAR TABELA DE TERMOS DE USO
-- Execute no MySQL Workbench
-- ============================================

USE goldenveicular;

-- Criar tabela de termos de uso
CREATE TABLE IF NOT EXISTS terms_of_use (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_active (is_active),
    INDEX idx_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verificar tabela criada
SELECT 'Tabela terms_of_use criada com sucesso!' AS status;
SHOW COLUMNS FROM terms_of_use;

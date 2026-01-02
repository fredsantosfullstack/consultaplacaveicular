-- ========================================
-- ADICIONAR COLUNAS FALTANTES PARA PERFIL DO USUÁRIO
-- Execute este script no MySQL Workbench
-- ========================================

-- Verificar estrutura atual
DESCRIBE users;

-- Adicionar coluna phone (telefone)
ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;

-- Adicionar coluna recovery_email (email de recuperação)
ALTER TABLE users ADD COLUMN recovery_email VARCHAR(255) AFTER email;

-- Adicionar coluna avatar (URL da foto de perfil)
ALTER TABLE users ADD COLUMN avatar VARCHAR(255) AFTER company;

-- Verificar estrutura atualizada
DESCRIBE users;

SELECT '✅ Colunas de perfil adicionadas com sucesso!' as status;

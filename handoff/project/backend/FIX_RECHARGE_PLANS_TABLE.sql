-- ========================================
-- ADICIONAR COLUNAS FALTANTES NA TABELA RECHARGE_PLANS
-- Execute este script no MySQL Workbench
-- ========================================

-- Adicionar coluna description (descrição do plano)
ALTER TABLE recharge_plans ADD COLUMN description TEXT AFTER name;

-- Adicionar coluna is_popular (marcar plano como popular)
ALTER TABLE recharge_plans ADD COLUMN is_popular BOOLEAN DEFAULT FALSE AFTER is_active;

-- Verificar estrutura da tabela
DESCRIBE recharge_plans;

-- Verificar dados
SELECT * FROM recharge_plans;

SELECT '✅ Colunas adicionadas com sucesso!' as status;

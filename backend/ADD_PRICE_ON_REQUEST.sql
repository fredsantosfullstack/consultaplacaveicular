-- ============================================
-- ADICIONAR CAMPO "PREÇO SOB CONSULTA"
-- Execute no MySQL Workbench conectado ao Railway
-- ============================================

-- 1. Adicionar coluna price_on_request na tabela consultation_types
ALTER TABLE consultation_types 
ADD COLUMN price_on_request BOOLEAN DEFAULT FALSE AFTER price;

-- 2. Verificar se foi adicionado
DESCRIBE consultation_types;

-- 3. Testar: Marcar uma consulta como "Sob Consulta"
-- UPDATE consultation_types SET price_on_request = TRUE WHERE slug = 'exemplo-slug';

SELECT '✅ Coluna price_on_request adicionada com sucesso!' AS status;

-- Popular tabela de planos de recarga com planos iniciais
-- Execute este script no banco de dados consultaplacaveicular

-- Limpar planos existentes (opcional - remova se quiser manter)
-- DELETE FROM recharge_plans;

-- Inserir planos de recarga
INSERT INTO recharge_plans (name, description, credits, price, is_popular, is_active) VALUES
('Básico', 'Ideal para consultas esporádicas', 50, 50.00, FALSE, TRUE),
('Popular', 'Melhor custo-benefício - Mais vendido!', 100, 100.00, TRUE, TRUE),
('Premium', 'Para uso intensivo', 200, 200.00, FALSE, TRUE),
('Empresarial', 'Plano corporativo com maior volume', 500, 500.00, FALSE, TRUE),
('Mega', 'Para grandes empresas', 1000, 1000.00, FALSE, TRUE);

-- Verificar planos inseridos
SELECT * FROM recharge_plans ORDER BY price ASC;

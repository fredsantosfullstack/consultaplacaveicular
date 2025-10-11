-- ========================================
-- SCRIPT 5: VALIDAÇÃO FINAL
-- Execute por último para verificar tudo
-- ========================================

-- Listar todas as tabelas criadas
SHOW TABLES;

-- Contar registros em cada tabela
SELECT 'users' as tabela, COUNT(*) as registros FROM users
UNION ALL
SELECT 'recharge_plans', COUNT(*) FROM recharge_plans
UNION ALL
SELECT 'consultation_types', COUNT(*) FROM consultation_types
UNION ALL
SELECT 'payment_transactions', COUNT(*) FROM payment_transactions
UNION ALL
SELECT 'webhook_logs', COUNT(*) FROM webhook_logs
UNION ALL
SELECT 'password_resets', COUNT(*) FROM password_resets;

-- Verificar usuário admin
SELECT id, name, email, role FROM users WHERE role = 'admin';

-- Verificar planos de recarga
SELECT id, name, credits, price, bonus_credits FROM recharge_plans;

-- Verificar consultas ativas
SELECT COUNT(*) as consultas_ativas FROM consultation_types WHERE is_active = TRUE;

SELECT '✅✅✅ BANCO DE DADOS CRIADO COM SUCESSO! ✅✅✅' as status;

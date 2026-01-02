-- Verificar se a coluna balance já existe
SELECT COUNT(*) as balance_exists 
FROM information_schema.COLUMNS 
WHERE TABLE_SCHEMA = 'railway' 
  AND TABLE_NAME = 'users' 
  AND COLUMN_NAME = 'balance';

-- Se retornar 0, execute os comandos abaixo:

-- Adicionar coluna balance
ALTER TABLE users ADD COLUMN balance DECIMAL(10,2) DEFAULT 0.00 AFTER role;

-- Adicionar coluna company
ALTER TABLE users ADD COLUMN company VARCHAR(255) AFTER document_number;

-- Atualizar saldo do admin
UPDATE users SET balance = 1000.00 WHERE email = 'admin@consultaplacaveicular.com.br';

-- Verificar
DESCRIBE users;

SELECT '✅ Colunas adicionadas!' as status;
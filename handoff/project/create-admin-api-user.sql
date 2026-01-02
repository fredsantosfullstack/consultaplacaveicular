-- Criar usuário admin para API
-- Email: kauanbruno139@gmail.com
-- Senha: Consulta$$$$$2025

INSERT INTO users (name, email, password, role, balance, created_at)
VALUES (
  'Admin API',
  'kauanbruno139@gmail.com',
  '$2a$10$uAJg9GzrTUOWFMDf15awaeuKXIRPBigB9oM93bwS4im1sNw4//xdm',
  'admin',
  999999.99,
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = 'Admin API',
  password = '$2a$10$uAJg9GzrTUOWFMDf15awaeuKXIRPBigB9oM93bwS4im1sNw4//xdm',
  role = 'admin',
  balance = 999999.99;

-- Verificar se foi criado
SELECT id, name, email, role, balance FROM users WHERE email = 'kauanbruno139@gmail.com';

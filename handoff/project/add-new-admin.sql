-- Script para adicionar novo usuário admin
-- Email: kauanbruno139@gmail.com
-- Senha: Golden$$$$$2025

-- Primeiro, vamos criar o hash da senha usando bcrypt
-- O hash abaixo é para a senha: Golden$$$$$2025
-- Hash gerado com bcrypt rounds=10: $2b$10$YourHashHere

INSERT INTO users (name, email, password, role, balance, created_at)
VALUES (
  'Admin API',
  'kauanbruno139@gmail.com',
  '$2b$10$8vN5qZ9YxK.Xp7nQwZ5qZeO5qZ9YxK.Xp7nQwZ5qZeO5qZ9YxK.Xp',  -- Placeholder: precisa gerar hash real
  'admin',
  999999.99,
  NOW()
)
ON DUPLICATE KEY UPDATE
  name = 'Admin API',
  role = 'admin',
  balance = 999999.99;

-- Criar tabela de configurações da API se não existir
CREATE TABLE IF NOT EXISTS api_settings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT,
  description VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir configurações padrão da API
INSERT INTO api_settings (setting_key, setting_value, description)
VALUES 
  ('api_email', 'kauanbruno139@gmail.com', 'Email para autenticação na API externa'),
  ('api_password', '', 'Senha para autenticação na API externa (criptografada)')
ON DUPLICATE KEY UPDATE
  setting_value = VALUES(setting_value),
  description = VALUES(description);

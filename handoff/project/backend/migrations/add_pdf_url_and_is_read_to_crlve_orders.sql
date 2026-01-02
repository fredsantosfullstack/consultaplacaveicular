-- Adicionar campos pdf_url e is_read na tabela crlve_orders

ALTER TABLE crlve_orders 
ADD COLUMN pdf_url VARCHAR(500) NULL AFTER admin_notes,
ADD COLUMN is_read BOOLEAN DEFAULT FALSE AFTER pdf_url;

-- Criar índice para otimizar consultas de pedidos não lidos
CREATE INDEX idx_is_read ON crlve_orders(is_read);

-- Verificar estrutura atualizada
DESCRIBE crlve_orders;

SELECT '✅ Campos pdf_url e is_read adicionados com sucesso!' AS status;

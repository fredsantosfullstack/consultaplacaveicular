-- Adicionar campo display_order na tabela consultation_types
ALTER TABLE consultation_types 
ADD COLUMN display_order INT DEFAULT 0 AFTER is_active;

-- Atualizar display_order baseado no ID (ordem atual)
UPDATE consultation_types 
SET display_order = id;

-- Criar índice para melhor performance
CREATE INDEX idx_display_order ON consultation_types(display_order);

-- Verificar
SELECT id, name, display_order, is_active FROM consultation_types ORDER BY display_order;

-- ============================================
-- Script para adicionar CRLV-E TURBO
-- Execute no MySQL Workbench conectado ao Railway
-- ============================================

-- Verificar se a consulta já existe
SELECT 
    id, 
    name, 
    slug, 
    price, 
    is_active 
FROM consultation_types 
WHERE slug = 'crlv-e-turbo';

-- Se não retornar nenhum resultado, execute o INSERT abaixo:

-- Inserir CRLV-E TURBO
INSERT INTO consultation_types (
    name, 
    slug, 
    description, 
    icon, 
    price, 
    is_new, 
    is_active,
    display_order
) VALUES (
    'CRLV-E TURBO',
    'crlv-e-turbo',
    'Disponível para MG, TO, MT, AP, MA, SP, GO, RR, PI, PR, SE, AC',
    'Car',
    15.00,
    TRUE,
    TRUE,
    1  -- Coloca no topo da lista
);

-- Verificar se foi inserido com sucesso
SELECT 
    id, 
    name, 
    slug, 
    description,
    icon,
    price, 
    is_new,
    is_active,
    display_order,
    created_at
FROM consultation_types 
WHERE slug = 'crlv-e-turbo';

-- Listar todas as consultas ativas (para confirmar a ordem)
SELECT 
    id,
    name,
    slug,
    price,
    is_new,
    is_active,
    display_order
FROM consultation_types 
WHERE is_active = TRUE
ORDER BY display_order ASC, id ASC;

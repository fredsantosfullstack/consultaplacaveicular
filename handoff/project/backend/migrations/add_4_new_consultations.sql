-- ============================================
-- ADICIONAR 4 NOVAS CONSULTAS
-- Para executar no banco do Railway
-- ============================================

-- 1. Consulta Cautelar
INSERT INTO consultation_types (name, slug, description, price, icon, is_active, form_fields, display_order) 
VALUES (
    'Consulta Cautelar',
    'consulta-cautelar',
    'Verifica medidas cautelares do veículo',
    12.00,
    'AlertTriangle',
    TRUE,
    '[{"name":"placa","label":"Placa do Veículo","type":"text","placeholder":"ABC1234","required":true,"maxLength":7}]',
    10
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    icon = VALUES(icon),
    is_active = VALUES(is_active),
    form_fields = VALUES(form_fields),
    display_order = VALUES(display_order);

-- 2. Consulta Leilão
INSERT INTO consultation_types (name, slug, description, price, icon, is_active, form_fields, display_order) 
VALUES (
    'Consulta Leilão',
    'consulta-leilao',
    'Consulta informações sobre leilão do veículo',
    15.00,
    'Search',
    TRUE,
    '[{"name":"placa","label":"Placa do Veículo","type":"text","placeholder":"ABC1234","required":true,"maxLength":7}]',
    11
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    icon = VALUES(icon),
    is_active = VALUES(is_active),
    form_fields = VALUES(form_fields),
    display_order = VALUES(display_order);

-- 3. Proprietário Atual V2
INSERT INTO consultation_types (name, slug, description, price, icon, is_active, form_fields, display_order) 
VALUES (
    'Proprietário Atual V2',
    'proprietario-atual-v2',
    'Consulta informações do proprietário atual do veículo',
    10.00,
    'User',
    TRUE,
    '[{"name":"placa","label":"Placa do Veículo","type":"text","placeholder":"ABC1234","required":true,"maxLength":7}]',
    12
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    icon = VALUES(icon),
    is_active = VALUES(is_active),
    form_fields = VALUES(form_fields),
    display_order = VALUES(display_order);

-- 4. Ano Licenciamento + Bin Nacional
INSERT INTO consultation_types (name, slug, description, price, icon, is_active, form_fields, display_order) 
VALUES (
    'Ano Licenciamento BIN Nacional',
    'ano-licenciamento-bin-nacional',
    'Consulta ano de licenciamento e BIN nacional',
    7.00,
    'Calendar',
    TRUE,
    '[{"name":"placa","label":"Placa do Veículo","type":"text","placeholder":"ABC1234","required":true,"maxLength":7}]',
    13
)
ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    description = VALUES(description),
    price = VALUES(price),
    icon = VALUES(icon),
    is_active = VALUES(is_active),
    form_fields = VALUES(form_fields),
    display_order = VALUES(display_order);

-- ============================================
-- VERIFICAR SE FOI INSERIDO
-- ============================================
SELECT 
    id,
    name,
    slug,
    price,
    is_active,
    display_order,
    created_at
FROM consultation_types
WHERE slug IN (
    'consulta-cautelar',
    'consulta-leilao',
    'proprietario-atual-v2',
    'ano-licenciamento-bin-nacional'
)
ORDER BY display_order;

-- Mensagem de sucesso
SELECT '✅ 4 consultas adicionadas/atualizadas com sucesso!' AS status;

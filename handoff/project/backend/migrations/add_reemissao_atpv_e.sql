-- Adicionar consulta Reemissão ATPV-E
INSERT INTO consultation_types (
  name, 
  slug, 
  description, 
  form_fields, 
  icon, 
  price, 
  price_on_request, 
  is_new, 
  is_active,
  display_order
) VALUES (
  'Reemissão ATPV-E',
  'reemissao-atpv-e',
  'Autorização para Transferência de Propriedade de Veículo Eletrônica',
  '[]',
  'FileText',
  65.00,
  0,
  1,
  1,
  100
);

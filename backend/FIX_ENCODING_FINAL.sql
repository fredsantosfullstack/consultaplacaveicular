-- Script final para corrigir encoding
USE goldenveicular;

-- Deletar registros com problema
DELETE FROM consultation_types WHERE slug IN ('crv-digital-agendado', 'codigo-seguranca-pdf', 'consulta-leilao', 'proprietario-atual-restricoes', 'proprietario-atual-v2', 'reemissao-atpv-e');

-- Reinserir com encoding correto
INSERT INTO consultation_types (name, slug, description, icon, price, is_new, is_active) VALUES
('Nº CRV Digital Agendado', 'crv-digital-agendado', 'Número CRV DIGITAL APENAS', 'FileText', 12.00, TRUE, TRUE),
('Código de segurança PDF', 'codigo-seguranca-pdf', 'Através da placa Retorna CRV DIGITAL.', 'ShieldCheck', 10.00, FALSE, TRUE),
('Consulta Leilão', 'consulta-leilao', 'Consulta informações sobre leilão do veículo', 'Search', 15.00, TRUE, TRUE),
('Proprietário Atual + Restrições', 'proprietario-atual-restricoes', 'Informa o proprietário atual do veículo.', 'User', 10.00, FALSE, TRUE),
('Proprietário Atual V2', 'proprietario-atual-v2', 'Informa o proprietário atual do veículo.', 'User', 10.00, TRUE, TRUE),
('Reemissão ATPV-E', 'reemissao-atpv-e', 'Através do chassi, retorna ATPV! Não pode ter comunicado de venda.', 'FileText', 18.00, FALSE, TRUE);

-- Verificar
SELECT id, name, slug FROM consultation_types WHERE slug IN ('crv-digital-agendado', 'codigo-seguranca-pdf', 'consulta-leilao', 'proprietario-atual-restricoes', 'proprietario-atual-v2', 'reemissao-atpv-e');

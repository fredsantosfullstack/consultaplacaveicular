-- Script para corrigir as descrições dos cards
USE goldenveicular;

-- Atualizar descrições com caracteres especiais corrompidos
UPDATE consultation_types SET description = 'Consulta de informações básicas do veículo na base estadual.' WHERE slug = 'base-estadual';

UPDATE consultation_types SET description = '(Base de Índice Nacional) é uma base oficial do DENATRAN que reúne as principais informações do veículo, como dados cadastrais, restrições, emplacamento e identificador de chassi.' WHERE slug = 'base-nacional';

UPDATE consultation_types SET description = 'Através da placa Retorna CRV DIGITAL.' WHERE slug = 'codigo-seguranca-pdf';

UPDATE consultation_types SET description = 'Consulta completa com múltiplas informações' WHERE slug = 'csv-renainf-renajud-recall-bin-proprietar';

UPDATE consultation_types SET description = 'Através da Placa, você pode verificar se há algum gravame registrado no veículo.' WHERE slug = 'gravame-v2';

UPDATE consultation_types SET description = 'Disponível para MG, TO, MT, AP, MA, SP, GO, RR, PI, PR, SE, AC' WHERE slug = 'crlv-e-turbo';

UPDATE consultation_types SET description = 'Número CRV DIGITAL APENAS' WHERE slug = 'crv-digital-agendado';

UPDATE consultation_types SET description = 'BIN ESTADUAL, PROPRIETÁRIO ATUAL, LEILÃO SIMPLIS + LEILÃO COMPLETO COM SCORE' WHERE slug = 'consulta-cautelar';

UPDATE consultation_types SET description = 'Disponível para os estados: PI, RO, AC, DF, SC, RJ, AL, PB, PE, ES, CE, MS' WHERE slug = 'crlv-e-agendado';

UPDATE consultation_types SET description = 'Consulta ano de licenciamento e BIN Nacional' WHERE slug = 'ano-licenciamento-bin-nacional';

UPDATE consultation_types SET description = 'Consulta Informações do Comunicado De Venda.' WHERE slug = 'consulta-comunicado-venda';

UPDATE consultation_types SET description = 'Informa o proprietário atual do veículo.' WHERE slug = 'proprietario-atual-restricoes';

UPDATE consultation_types SET description = 'Informa o proprietário atual do veículo.' WHERE slug = 'proprietario-atual-v2';

UPDATE consultation_types SET description = 'Consulta informações sobre leilão do veículo' WHERE slug = 'consulta-leilao';

UPDATE consultation_types SET description = 'Através do Chassi/Motor, você pode obter informações sobre o veículo.' WHERE slug = 'consulta-chassi';

UPDATE consultation_types SET description = 'Através do chassi, retorna ATPV! Não pode ter comunicado de venda.' WHERE slug = 'reemissao-atpv-e';

UPDATE consultation_types SET description = 'Verifique se o CRV é válido Grátis.' WHERE slug = 'verifica-autenticidade-crv';

-- Verificar as alterações
SELECT id, name, description FROM consultation_types ORDER BY id ASC;

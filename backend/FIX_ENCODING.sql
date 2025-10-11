-- Script para corrigir encoding dos nomes das consultas
USE goldenveicular;

-- Definir charset correto para a sessão
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- Atualizar TODOS os nomes com caracteres especiais
UPDATE consultation_types SET name = 'Nº CRV Digital Agendado' WHERE slug = 'crv-digital-agendado';
UPDATE consultation_types SET name = 'Código de segurança PDF' WHERE slug = 'codigo-seguranca-pdf';
UPDATE consultation_types SET name = 'Consulta Leilão' WHERE slug = 'consulta-leilao';
UPDATE consultation_types SET name = 'Proprietário Atual + Restrições' WHERE slug = 'proprietario-atual-restricoes';
UPDATE consultation_types SET name = 'Proprietário Atual V2' WHERE slug = 'proprietario-atual-v2';
UPDATE consultation_types SET name = 'Reemissão ATPV-E' WHERE slug = 'reemissao-atpv-e';

-- Verificar as alterações
SELECT id, name, slug FROM consultation_types WHERE slug IN ('crv-digital-agendado', 'codigo-seguranca-pdf', 'consulta-leilao', 'proprietario-atual-restricoes', 'proprietario-atual-v2', 'reemissao-atpv-e');

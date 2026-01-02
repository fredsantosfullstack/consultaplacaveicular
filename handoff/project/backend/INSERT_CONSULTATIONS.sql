-- Script para inserir as 17 consultas no banco de dados
-- USE consultaplacaveicular; (banco já selecionado)

-- Criar tabela consultation_types se não existir
CREATE TABLE IF NOT EXISTS `consultation_types` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) NOT NULL UNIQUE,
  `description` TEXT,
  `form_fields` JSON,
  `icon` VARCHAR(50) DEFAULT 'Search',
  `price` DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `is_new` BOOLEAN DEFAULT FALSE,
  `is_active` BOOLEAN DEFAULT TRUE,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX `idx_slug` (`slug`),
  INDEX `idx_is_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Inserir as 17 consultas (usando INSERT IGNORE para evitar duplicatas)
INSERT IGNORE INTO `consultation_types` (`name`, `slug`, `description`, `icon`, `price`, `is_new`, `is_active`) VALUES
('CRLV-E TURBO', 'crlv-e-turbo', 'Disponível para MG, TO, MT, AP, MA, SP, GO, RR, PI, PR, SE, AC', 'Car', 15.00, TRUE, TRUE),
('N° CRV Digital Agendado', 'crv-digital-agendado', 'Número CRV DIGITAL APENAS', 'FileText', 12.00, TRUE, TRUE),
('Codigo de segurança PDF', 'codigo-seguranca-pdf', 'Através da placa Retorna CRV DIGITAL.', 'ShieldCheck', 10.00, FALSE, TRUE),
('Consulta Cautelar', 'consulta-cautelar', 'BIN ESTADUAL, PROPRIETÁRIO ATUAL, LEILÃO SIMPLIS + LEILÃO COMPLETO COM SCORE', 'Search', 20.00, TRUE, TRUE),
('CRLV-E AGENDADO', 'crlv-e-agendado', 'Disponível para os estados: PI, RO, AC, DF, SC, RJ, AL, PB, PE, ES, CE, MS', 'Car', 15.00, TRUE, TRUE),
('Ano Licenciamento + Bin Nacional', 'ano-licenciamento-bin-nacional', 'Consulta ano de licenciamento e BIN Nacional', 'FileText', 8.00, TRUE, TRUE),
('CSV - RENAINF - RENAJUD - RECALL - BIN - PROPRIETAR', 'csv-renainf-renajud-recall-bin-proprietar', 'Consulta completa com múltiplas informações', 'Search', 25.00, TRUE, TRUE),
('Base Estadual', 'base-estadual', 'Exibe os dados do veículo registrados no estado, incluindo débitos de licenciamento, IPVA, restrições (administrativas, financeiras, judiciais, tributárias, roubo/furto), gravame, emplacamento e chassi.', 'Car', 10.00, TRUE, TRUE),
('Base Nacional', 'base-nacional', '(Base de Índice Nacional) é uma base oficial do DENATRAN que reúne as principais informações do veículo, como dados cadastrais, restrições, emplacamento e identificador de chassi.', 'FileText', 12.00, TRUE, TRUE),
('Consulta Comunicado De Venda', 'consulta-comunicado-venda', 'Consulta Informações do Comunicado De Venda.', 'ShieldCheck', 8.00, TRUE, TRUE),
('Proprietário Atual + Restrições', 'proprietario-atual-restricoes', 'Informa o proprietário atual do veículo.', 'User', 10.00, FALSE, TRUE),
('Proprietário Atual V2', 'proprietario-atual-v2', 'Informa o proprietário atual do veículo.', 'User', 10.00, TRUE, TRUE),
('Consulta Leilão', 'consulta-leilao', 'Consulta informações sobre leilão do veículo', 'Search', 15.00, TRUE, TRUE),
('Consulta Chassi', 'consulta-chassi', 'Através do Chassi/Motor, você pode obter informações sobre o veículo.', 'Car', 12.00, FALSE, TRUE),
('Reemissão ATPV-E', 'reemissao-atpv-e', 'Através do chassi, retorna ATPV! Não pode ter comunicado de venda.', 'FileText', 18.00, FALSE, TRUE),
('Gravame V2', 'gravame-v2', 'Através da Placa, você pode verificar se há algum gravame registrado no veículo.', 'ShieldCheck', 10.00, TRUE, TRUE),
('Verifica autenticidade CRV', 'verifica-autenticidade-crv', 'Verifique se o CRV é válido Grátis.', 'ShieldCheck', 0.00, FALSE, TRUE);

-- Verificar quantas consultas foram inseridas
SELECT COUNT(*) as total_consultas FROM consultation_types;

-- Listar todas as consultas
SELECT id, name, slug, price, is_new, is_active FROM consultation_types ORDER BY name ASC;

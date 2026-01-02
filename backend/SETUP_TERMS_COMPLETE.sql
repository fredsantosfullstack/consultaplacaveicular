-- ============================================
-- SETUP COMPLETO: CRIAR TABELA + INSERIR CONTEÚDO
-- Execute este script no MySQL Workbench
-- ============================================

USE consultaplacaveicular;

-- ============================================
-- 1. CRIAR TABELA DE TERMOS DE USO
-- ============================================
CREATE TABLE IF NOT EXISTS terms_of_use (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    version VARCHAR(50) NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_active (is_active),
    INDEX idx_version (version)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT '✅ Tabela terms_of_use criada!' AS status;

-- ============================================
-- 2. INSERIR CONTEÚDO DOS TERMOS
-- ============================================
INSERT INTO terms_of_use (title, content, version, is_active, created_by) VALUES (
'Termos de Uso e Política de Privacidade',
'1. Termos de Uso

Bem-vindo à Consultaplacaveicular! Ao acessar e utilizar nosso sistema, você concorda com os seguintes Termos de Uso. Caso não concorde com qualquer parte dos termos, pedimos que não utilize nossos serviços.

1.1. Acesso ao Sistema
O sistema Consultaplacaveaveicular oferece serviços de consulta de informações veiculares, como CRLV, consultas por placa, entre outros. O acesso a essas funcionalidades está sujeito a um cadastro prévio e ao pagamento de eventuais taxas conforme o tipo de serviço.

1.2. Responsabilidade do Usuário
O usuário é responsável por fornecer informações corretas e atualizadas ao utilizar o sistema. O uso indevido de dados de terceiros para fins fraudulentos é estritamente proibido. A Consultaplacaveicular não se responsabiliza por ações de terceiros que utilizem informações de maneira ilegal.

1.3. Modificações e Cancelamentos
A Consultaplacaveicular se reserva o direito de modificar, suspender ou cancelar serviços a qualquer momento, sem aviso prévio, sendo que o usuário será informado de eventuais alterações que impactem sua experiência no sistema.

1.4. Limitação de Responsabilidade
A Consultaplacaveicular não se responsabiliza por falhas nos sistemas de consulta que estão fora do seu controle, como falhas em APIs externas. Nosso objetivo é fornecer um serviço de qualidade, mas não podemos garantir 100% de precisão ou disponibilidade.

1.5. Propriedade Intelectual
Todos os direitos de propriedade intelectual sobre a Consultaplacaveicular são de titularidade exclusiva da plataforma. O usuário não pode reproduzir, modificar ou distribuir qualquer parte do sistema sem autorização prévia.

1.6. Proibição de Uso Indevido de Dados Pessoais
O usuário não deve utilizar os serviços para o tratamento de dados pessoais de terceiros sem a devida autorização legal e sem respeitar a Lei Geral de Proteção de Dados (LGPD). A Consultaplacaveicular não se responsabiliza por qualquer uso ilícito desses dados.


2. Política de Privacidade

2.1. Coleta de Informações
A Consultaplacaveicular coleta informações fornecidas diretamente pelos usuários no momento do cadastro, como nome, e-mail, dados de pagamento e informações de uso do sistema. Também podemos coletar dados de navegação, como endereços IP e interações com a plataforma.

2.2. Uso das Informações
As informações coletadas são utilizadas para fornecer nossos serviços, processar pagamentos, melhorar a experiência do usuário e enviar notificações sobre atualizações e novos serviços. Não compartilhamos informações pessoais com terceiros sem o consentimento do usuário, exceto quando exigido por lei ou para cumprir com nossas obrigações contratuais.

2.3. Proteção de Dados
A Consultaplacaveicular adota medidas técnicas e administrativas para proteger as informações dos usuários contra acesso não autorizado, perda ou alteração. No entanto, nenhuma plataforma é completamente segura, e não podemos garantir a segurança total dos dados.

2.4. Compartilhamento de Informações
O sistema pode compartilhar dados com terceiros para fins específicos, como processamento de pagamentos ou integração com APIs externas, mas esses parceiros são obrigados a seguir os padrões de segurança e privacidade da Consultaplacaveicular.

2.5. Direitos do Usuário
O usuário pode a qualquer momento acessar, corrigir ou excluir suas informações pessoais na plataforma. Além disso, pode solicitar a exclusão de sua conta, o que será realizado de acordo com as políticas de retenção de dados.

2.6. Alterações na Política de Privacidade
Esta Política de Privacidade pode ser alterada a qualquer momento, e os usuários serão notificados sobre modificações importantes. Recomendamos que você consulte periodicamente nossa política para estar ciente de como protegemos suas informações.

2.7. Dados de Pesquisa
Em caso de pesquisas que envolvam dados pessoais, a Consultaplacaveicular não realiza o tratamento de dados pessoais, não armazenando nem acessando os dados pessoais da pesquisa. O usuário deve garantir que sua pesquisa seja realizada de acordo com as hipóteses legais previstas na LGPD.


📩 Se você tiver dúvidas, entre em contato conosco pelo e-mail: contato@consultaplacaveicular.com.br',
'1.0',
TRUE,
(SELECT id FROM users WHERE role = 'admin' LIMIT 1)
);

SELECT '✅ Conteúdo inserido!' AS status;

-- ============================================
-- 3. VERIFICAR RESULTADO
-- ============================================
SELECT 
    id,
    title,
    version,
    CASE WHEN is_active THEN '✅ ATIVO' ELSE '❌ INATIVO' END AS status,
    created_at,
    updated_at
FROM terms_of_use
ORDER BY created_at DESC;

SELECT '🎉 Setup completo! Termos de uso prontos para uso.' AS resultado;

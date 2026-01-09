const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function addContactEmailFields() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Adicionar colunas de e-mail de contato
    const alterations = [
      { 
        name: 'contact_email', 
        sql: "ALTER TABLE site_config ADD COLUMN contact_email VARCHAR(255) DEFAULT 'contato@consultaplacaveicular.com.br'" 
      },
      { 
        name: 'contact_email_cc', 
        sql: "ALTER TABLE site_config ADD COLUMN contact_email_cc TEXT DEFAULT NULL COMMENT 'E-mails em cópia (CC), separados por vírgula'" 
      }
    ];

    console.log('\n🔄 Adicionando campos de e-mail de contato...');
    for (const { name, sql } of alterations) {
      try {
        await connection.query(sql);
        console.log(`✅ ${name} adicionado`);
      } catch (error) {
        if (error.message.includes('Duplicate column')) {
          console.log(`⚠️ ${name} já existe, pulando...`);
        } else {
          console.error(`❌ Erro ao adicionar ${name}:`, error.message);
        }
      }
    }

    // Atualizar o registro padrão com o e-mail
    console.log('\n🔄 Atualizando configuração padrão...');
    await connection.query(
      "UPDATE site_config SET contact_email = 'contato@consultaplacaveicular.com.br' WHERE id = 1"
    );
    console.log('✅ E-mail de contato padrão configurado!');

    // Verificar estrutura final
    const [columns] = await connection.query("SHOW COLUMNS FROM site_config LIKE '%contact%'");
    console.log('\n📋 Colunas de contato na tabela site_config:');
    columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));

    console.log('\n✅ Campos de e-mail de contato adicionados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

addContactEmailFields();

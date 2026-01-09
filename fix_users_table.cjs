const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function fixUsersTable() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Verificar estrutura atual
    const [columns] = await connection.query("SHOW COLUMNS FROM users");
    console.log('\n📋 Colunas atuais na tabela users:');
    columns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));

    // Adicionar colunas faltantes
    const alterations = [
      { name: 'balance', sql: "ALTER TABLE users ADD COLUMN balance DECIMAL(10,2) DEFAULT 0" },
      { name: 'avatar', sql: "ALTER TABLE users ADD COLUMN avatar VARCHAR(255) DEFAULT NULL" },
      { name: 'company', sql: "ALTER TABLE users ADD COLUMN company VARCHAR(255) DEFAULT NULL" },
      { name: 'recovery_email', sql: "ALTER TABLE users ADD COLUMN recovery_email VARCHAR(255) DEFAULT NULL" },
      { name: 'is_active', sql: "ALTER TABLE users ADD COLUMN is_active BOOLEAN DEFAULT TRUE" }
    ];

    console.log('\n🔄 Adicionando colunas faltantes...');
    for (const { name, sql } of alterations) {
      try {
        await connection.query(sql);
        console.log(`✅ ${name} adicionada`);
      } catch (error) {
        if (error.message.includes('Duplicate column')) {
          console.log(`⚠️ ${name} já existe, pulando...`);
        } else {
          console.error(`❌ Erro ao adicionar ${name}:`, error.message);
        }
      }
    }

    // Verificar estrutura final
    const [finalColumns] = await connection.query("SHOW COLUMNS FROM users");
    console.log('\n📋 Estrutura final da tabela users:');
    finalColumns.forEach(col => console.log(`  - ${col.Field} (${col.Type})`));

    console.log('\n✅ Tabela users atualizada com sucesso!');
    console.log('\n🔄 Agora tente fazer login novamente!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

fixUsersTable();

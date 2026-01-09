const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Credenciais do Railway MySQL
const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625,
  multipleStatements: true
};

async function runMigrations() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL do Railway...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado com sucesso!');

    const sqlPath = path.join(__dirname, 'backend', 'migrations', 'create_cms_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 Executando migrations...');
    await connection.query(sql);
    console.log('✅ Migrations executadas com sucesso!');

    const [tables] = await connection.query("SHOW TABLES LIKE 'site_%'");
    console.log(`✅ ${tables.length} tabelas CMS criadas:`, tables.map(t => Object.values(t)[0]));

    console.log('\n🎉 Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runMigrations();

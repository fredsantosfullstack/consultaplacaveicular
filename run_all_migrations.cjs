const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625,
  multipleStatements: true
};

async function runAllMigrations() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL do Railway...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado com sucesso!\n');

    const scripts = [
      'RAILWAY_SCRIPT_1_BASE.sql',
      'RAILWAY_SCRIPT_2_RECHARGE_PLANS.sql',
      'RAILWAY_SCRIPT_3_PAYMENT_TABLES.sql',
      'RAILWAY_SCRIPT_4_CONSULTATIONS.sql'
    ];

    for (const script of scripts) {
      const sqlPath = path.join(__dirname, 'backend', script);
      
      if (!fs.existsSync(sqlPath)) {
        console.log(`⚠️ Arquivo não encontrado: ${script}`);
        continue;
      }

      console.log(`🔄 Executando ${script}...`);
      const sql = fs.readFileSync(sqlPath, 'utf8');
      
      try {
        await connection.query(sql);
        console.log(`✅ ${script} executado com sucesso!\n`);
      } catch (error) {
        console.error(`❌ Erro ao executar ${script}:`, error.message);
      }
    }

    // Verificar tabelas criadas
    const [tables] = await connection.query("SHOW TABLES");
    console.log(`\n✅ Total de tabelas no banco: ${tables.length}`);
    console.log('Tabelas criadas:');
    tables.forEach(t => console.log(`  - ${Object.values(t)[0]}`));

    console.log('\n🎉 Todas as migrations foram executadas!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  } finally {
    if (connection) await connection.end();
  }
}

runAllMigrations();

const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function checkHeroData() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    const [hero] = await connection.query("SELECT * FROM site_hero WHERE id = 1");
    
    console.log('\n📋 Dados do Hero no banco:');
    console.log(JSON.stringify(hero[0], null, 2));
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkHeroData();

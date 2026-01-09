const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function checkDatabase() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Verificar tabelas
    const [tables] = await connection.query("SHOW TABLES LIKE 'site_%'");
    console.log(`\n📊 Tabelas encontradas: ${tables.length}`);
    tables.forEach(t => console.log(`  - ${Object.values(t)[0]}`));

    // Verificar dados em cada tabela
    const [config_data] = await connection.query('SELECT * FROM site_config');
    console.log(`\n📋 site_config: ${config_data.length} registros`);
    if (config_data.length > 0) console.log('  ', config_data[0]);

    const [hero_data] = await connection.query('SELECT * FROM site_hero');
    console.log(`\n🎯 site_hero: ${hero_data.length} registros`);
    if (hero_data.length > 0) console.log('  ', hero_data[0]);

    const [services_data] = await connection.query('SELECT * FROM site_services');
    console.log(`\n🛍️ site_services: ${services_data.length} registros`);

    const [benefits_data] = await connection.query('SELECT * FROM site_benefits');
    console.log(`\n✨ site_benefits: ${benefits_data.length} registros`);

    const [steps_data] = await connection.query('SELECT * FROM site_steps');
    console.log(`\n📍 site_steps: ${steps_data.length} registros`);

    const [stats_data] = await connection.query('SELECT * FROM site_statistics');
    console.log(`\n📈 site_statistics: ${stats_data.length} registros`);

    const [footer_data] = await connection.query('SELECT * FROM site_footer_links');
    console.log(`\n🔗 site_footer_links: ${footer_data.length} registros`);

    console.log('\n✅ Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkDatabase();

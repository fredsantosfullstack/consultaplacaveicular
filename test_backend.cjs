const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function testQuery() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Testar a mesma query que o backend faz
    console.log('\n🧪 Testando query do getLandingPageData...');
    
    const [config_data] = await connection.query('SELECT * FROM site_config WHERE id = 1');
    console.log('✅ site_config OK:', config_data.length, 'registros');

    const [hero_data] = await connection.query('SELECT * FROM site_hero WHERE id = 1');
    console.log('✅ site_hero OK:', hero_data.length, 'registros');

    const [benefits_data] = await connection.query('SELECT * FROM site_benefits WHERE is_active = TRUE ORDER BY display_order');
    console.log('✅ site_benefits OK:', benefits_data.length, 'registros');

    const [statistics_data] = await connection.query('SELECT * FROM site_statistics WHERE is_active = TRUE ORDER BY display_order');
    console.log('✅ site_statistics OK:', statistics_data.length, 'registros');

    const [services_data] = await connection.query('SELECT * FROM site_services WHERE is_active = TRUE ORDER BY display_order');
    console.log('✅ site_services OK:', services_data.length, 'registros');

    const [steps_data] = await connection.query('SELECT * FROM site_steps WHERE is_active = TRUE ORDER BY display_order');
    console.log('✅ site_steps OK:', steps_data.length, 'registros');

    const [footer_data] = await connection.query('SELECT * FROM site_footer_links WHERE is_active = TRUE ORDER BY category, display_order');
    console.log('✅ site_footer_links OK:', footer_data.length, 'registros');

    console.log('\n✅ Todas as queries funcionam!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    if (connection) await connection.end();
  }
}

testQuery();

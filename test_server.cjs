import('dotenv/config').then(() => {
  const mysql = require('mysql2/promise');

  const config = {
    host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
    database: process.env.DB_DATABASE || 'railway',
    port: process.env.DB_PORT || 12625
  };

  console.log('🔧 Configuração:', {
    host: config.host,
    port: config.port,
    user: config.user,
    database: config.database
  });

  const pool = mysql.createPool(config);
  const db = pool.promise();

  async function test() {
    try {
      console.log('🔄 Testando conexão...');
      const connection = await db.getConnection();
      console.log('✅ Conexão bem-sucedida!');
      
      const [results] = await connection.query('SELECT * FROM site_config WHERE id = 1');
      console.log('✅ Query bem-sucedida!');
      console.log('Resultado:', results[0]);
      
      connection.release();
      process.exit(0);
    } catch (error) {
      console.error('❌ Erro:', error.message);
      process.exit(1);
    }
  }

  test();
});

const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function updateHeroSubtitle() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Atualizar o subtítulo e descrição do hero
    await connection.query(
      "UPDATE site_hero SET subtitle = ?, description = ? WHERE id = 1",
      [
        'Consultas veiculares online',
        'Descubra histórico e alertas importantes antes de fechar negócio. Resultado em poucos segundos.'
      ]
    );

    console.log('✅ Hero atualizado com sucesso!');

    // Verificar atualização
    const [hero] = await connection.query("SELECT title, subtitle, description FROM site_hero WHERE id = 1");
    console.log('\n📋 Hero atual:');
    console.log('  Título:', hero[0].title);
    console.log('  Subtítulo:', hero[0].subtitle);
    console.log('  Descrição:', hero[0].description);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

updateHeroSubtitle();

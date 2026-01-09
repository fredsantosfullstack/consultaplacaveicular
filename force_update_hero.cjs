const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function forceUpdateHero() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Verificar dados atuais
    const [currentHero] = await connection.query("SELECT * FROM site_hero WHERE id = 1");
    console.log('\n📋 Dados ATUAIS no banco:');
    console.log('  Título:', currentHero[0].title);
    console.log('  Subtítulo:', currentHero[0].subtitle);
    console.log('  Descrição:', currentHero[0].description);

    // Forçar atualização com timestamp
    await connection.query(
      `UPDATE site_hero 
       SET title = ?, 
           subtitle = ?, 
           description = ?,
           updated_at = NOW()
       WHERE id = 1`,
      [
        'Consulte a placa e compre com mais segurança',
        'Consultas veiculares online',
        'Descubra histórico e alertas importantes antes de fechar negócio. Resultado em poucos segundos.'
      ]
    );

    console.log('\n✅ Dados atualizados com timestamp forçado!');

    // Verificar atualização
    const [updatedHero] = await connection.query("SELECT * FROM site_hero WHERE id = 1");
    console.log('\n📋 Dados APÓS atualização:');
    console.log('  Título:', updatedHero[0].title);
    console.log('  Subtítulo:', updatedHero[0].subtitle);
    console.log('  Descrição:', updatedHero[0].description);
    console.log('  Updated At:', updatedHero[0].updated_at);

    console.log('\n🔄 Agora o Railway deve pegar os dados atualizados após o próximo deploy.');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

forceUpdateHero();

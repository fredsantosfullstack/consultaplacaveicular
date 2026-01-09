const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function updateHeroTitle() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Atualizar o título do hero
    await connection.query(
      "UPDATE site_hero SET title = ? WHERE id = 1",
      ['Consulte a placa e compre com mais segurança']
    );

    console.log('✅ Título do hero atualizado com sucesso!');
    console.log('Novo título: "Consulte a placa e compre com mais segurança"');

    // Verificar atualização
    const [hero] = await connection.query("SELECT title, subtitle FROM site_hero WHERE id = 1");
    console.log('\n📋 Hero atual:');
    console.log('  Título:', hero[0].title);
    console.log('  Subtítulo:', hero[0].subtitle);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

updateHeroTitle();

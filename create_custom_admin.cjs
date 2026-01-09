const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function createCustomAdmin() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    const email = 'admin@consultaplacaveicular.com.br';
    const password = 'WR?=G9gxXVQ,5$z*89';
    
    // Verificar se já existe
    const [existing] = await connection.query("SELECT * FROM users WHERE email = ?", [email]);
    
    if (existing.length > 0) {
      console.log('⚠️ Usuário já existe. Atualizando senha...');
      const hashedPassword = await bcrypt.hash(password, 10);
      await connection.query(
        "UPDATE users SET password = ?, role = 'admin' WHERE email = ?",
        [hashedPassword, email]
      );
      console.log('✅ Senha atualizada com sucesso!');
    } else {
      console.log('⚠️ Criando novo usuário admin...');
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await connection.query(
        `INSERT INTO users (name, email, password, role) 
         VALUES (?, ?, ?, ?)`,
        ['Administrador', email, hashedPassword, 'admin']
      );
      console.log('✅ Admin criado com sucesso!');
    }

    console.log('\n📧 Email: admin@consultaplacaveicular.com.br');
    console.log('🔑 Senha: WR?=G9gxXVQ,5$z*89');
    console.log('\n✅ Você já pode fazer login no sistema!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

createCustomAdmin();

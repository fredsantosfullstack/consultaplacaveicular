const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function createAdmin() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Verificar se já existe admin
    const [admins] = await connection.query("SELECT * FROM users WHERE role = 'admin'");
    
    if (admins.length > 0) {
      console.log('✅ Já existe um usuário admin:');
      console.log('   Email:', admins[0].email);
      console.log('   Nome:', admins[0].name);
      return;
    }

    console.log('⚠️ Nenhum admin encontrado. Criando admin padrão...');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    await connection.query(
      `INSERT INTO users (name, email, password, role, balance, is_active) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      ['Administrador', 'admin@consultaplacaveicular.com', hashedPassword, 'admin', 0, true]
    );

    console.log('✅ Admin criado com sucesso!');
    console.log('   Email: admin@consultaplacaveicular.com');
    console.log('   Senha: admin123');
    console.log('\n⚠️ IMPORTANTE: Altere a senha após o primeiro login!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

createAdmin();

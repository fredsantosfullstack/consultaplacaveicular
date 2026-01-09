const mysql = require('mysql2/promise');

const config = {
  host: 'metro.proxy.rlwy.net',
  user: 'root',
  password: 'ZxTgjrGKXuuXteDPOBmhYBqicsnlvYjx',
  database: 'railway',
  port: 12625
};

async function checkAdmin() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao MySQL...');
    connection = await mysql.createConnection(config);
    console.log('✅ Conectado!');

    // Verificar se já existe admin
    const [admins] = await connection.query("SELECT id, name, email, role, is_active FROM users WHERE role = 'admin'");
    
    if (admins.length > 0) {
      console.log('\n✅ Usuários admin encontrados:');
      admins.forEach(admin => {
        console.log(`   - ${admin.name} (${admin.email}) - ${admin.is_active ? 'Ativo' : 'Inativo'}`);
      });
    } else {
      console.log('\n⚠️ Nenhum usuário admin encontrado!');
      console.log('\nPara criar um admin, você precisa:');
      console.log('1. Acessar https://consultaplacaveicular.vercel.app/cadastro');
      console.log('2. Criar uma conta normalmente');
      console.log('3. Depois, execute este script SQL no banco:');
      console.log('\n   UPDATE users SET role = "admin" WHERE email = "seu-email@exemplo.com";');
    }

    // Verificar total de usuários
    const [users] = await connection.query("SELECT COUNT(*) as total FROM users");
    console.log(`\n📊 Total de usuários no sistema: ${users[0].total}`);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  } finally {
    if (connection) await connection.end();
  }
}

checkAdmin();

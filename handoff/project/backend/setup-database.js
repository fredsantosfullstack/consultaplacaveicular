import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function setupDatabase() {
  console.log('🚀 Iniciando setup do banco de dados...\n');

  // Configuração da conexão
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true
  });

  console.log('✅ Conectado ao MySQL!\n');

  try {
    // Ler o arquivo SQL
    const sqlPath = path.join(__dirname, '..', 'setup-database-railway.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('📄 Executando SQL...\n');

    // Executar o SQL
    const [results] = await connection.query(sql);

    console.log('✅ SQL executado com sucesso!\n');

    // Verificar tabelas criadas
    const [tables] = await connection.query('SHOW TABLES');
    console.log('📋 Tabelas criadas:');
    tables.forEach(table => {
      console.log(`  - ${Object.values(table)[0]}`);
    });

    // Verificar dados inseridos
    console.log('\n📊 Dados inseridos:');
    
    const [users] = await connection.query('SELECT COUNT(*) as count FROM users');
    console.log(`  - Usuários: ${users[0].count}`);
    
    const [consultations] = await connection.query('SELECT COUNT(*) as count FROM consultation_types');
    console.log(`  - Tipos de consulta: ${consultations[0].count}`);
    
    const [settings] = await connection.query('SELECT COUNT(*) as count FROM admin_settings');
    console.log(`  - Configurações: ${settings[0].count}`);

    console.log('\n🎉 Setup concluído com sucesso!');
    console.log('\n👤 Usuário Admin criado:');
    console.log('   Email: admin@goldenveicular.com');
    console.log('   Senha: admin123');
    console.log('   Saldo: R$ 1.000,00\n');

  } catch (error) {
    console.error('❌ Erro ao executar SQL:', error.message);
    throw error;
  } finally {
    await connection.end();
    console.log('🔌 Conexão fechada.');
  }
}

// Executar
setupDatabase()
  .then(() => {
    console.log('\n✅ Processo finalizado!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Erro fatal:', error);
    process.exit(1);
  });

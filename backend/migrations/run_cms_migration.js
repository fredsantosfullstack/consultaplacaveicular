import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '..', '.env') });

async function runCmsMigration() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || '127.0.0.1',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'consultaplacaveicular',
      multipleStatements: true
    });

    console.log('✅ Conectado ao banco de dados!');
    console.log('');

    // Ler arquivo SQL
    const sqlFile = join(__dirname, 'create_cms_tables.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');

    console.log('📝 Executando migrations CMS...');
    await connection.query(sql);

    console.log('✅ Migrations CMS executadas com sucesso!');
    console.log('');

    // Verificar tabelas criadas
    const [tables] = await connection.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = ? 
        AND (table_name LIKE 'site_%' OR table_name = 'contact_submissions')
      ORDER BY table_name
    `, [process.env.DB_NAME]);

    console.log('📊 Tabelas CMS criadas:');
    tables.forEach(table => {
      console.log(`   ✅ ${table.table_name}`);
    });

    console.log('');
    console.log('🎉 Sistema CMS pronto para uso!');
    console.log('');
    console.log('📌 Próximos passos:');
    console.log('   1. Acesse o painel admin');
    console.log('   2. Vá em Site Builder');
    console.log('   3. Customize sua landing page');
    console.log('   4. Acesse / para ver o resultado');

  } catch (error) {
    console.error('');
    console.error('❌ Erro ao executar migrations CMS:', error.message);
    console.error('');
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('');
      console.log('🔌 Conexão encerrada');
    }
  }
}

runCmsMigration();

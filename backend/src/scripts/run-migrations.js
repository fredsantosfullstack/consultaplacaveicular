import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  let connection;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    connection = await pool.getConnection();
    console.log('✅ Conectado com sucesso!');

    const sqlPath = path.join(__dirname, '../../migrations/create_cms_tables.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔄 Executando migrations...');
    
    // Dividir o SQL em statements individuais
    const statements = sql.split(';').filter(stmt => stmt.trim());
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await connection.query(statement);
        } catch (error) {
          // Ignorar erros de "tabela já existe"
          if (!error.message.includes('already exists')) {
            throw error;
          }
        }
      }
    }
    
    console.log('✅ Migrations executadas com sucesso!');

    const [tables] = await connection.query("SHOW TABLES LIKE 'site_%'");
    console.log(`✅ ${tables.length} tabelas CMS criadas:`, tables.map(t => Object.values(t)[0]));

    console.log('\n🎉 Banco de dados configurado com sucesso!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    if (connection) connection.release();
    await pool.end();
  }
}

runMigrations();

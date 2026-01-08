import mysql from 'mysql2/promise';

console.log('🔧 Configurando pool de conexão com banco de dados...');
console.log('  DB_HOST:', process.env.DB_HOST);
console.log('  DB_PORT:', process.env.DB_PORT);
console.log('  DB_USER:', process.env.DB_USER);
console.log('  DB_DATABASE:', process.env.DB_DATABASE);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'metro.proxy.rlwy.net',
  port: parseInt(process.env.DB_PORT) || 12625,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelayMs: 0
});

export default pool;

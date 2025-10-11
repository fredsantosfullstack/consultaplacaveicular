import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'goldenveicular',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  family: 4  // Força IPv4, evita tentativa de IPv6
});

export default pool.promise();

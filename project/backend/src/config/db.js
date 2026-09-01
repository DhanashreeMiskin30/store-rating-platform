const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'store_rating',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  decimalNumbers: true
});

async function testConnection() {
  try {
    const conn = await pool.getConnection();
    console.log('✅ MySQL connection pool established');
    conn.release();
  } catch (err) {
    console.error('❌ Unable to connect to MySQL:', err.message);
    process.exit(1);
  }
}

module.exports = { pool, testConnection };

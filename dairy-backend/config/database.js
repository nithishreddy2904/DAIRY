const mysql = require('mysql2');
require('dotenv').config();

// Create connection pool with corrected configuration
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dairy_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // REMOVED: acquireTimeout, timeout, reconnect (these are invalid in mysql2)
  // Use these instead:
  acquireTimeout: 60000,  // This is valid for pool
  timeout: 60000,         // This is valid for pool
  // reconnect is not needed in mysql2 - it handles reconnection automatically
});

// Get promise-based connection
const promisePool = pool.promise();

// Test database connection
const testConnection = async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log('✅ Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

module.exports = {
  pool,
  promisePool,
  testConnection
};

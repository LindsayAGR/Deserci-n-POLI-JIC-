const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

const isCloud = process.env.DB_HOST && process.env.DB_HOST !== 'localhost' && process.env.DB_HOST !== '127.0.0.1';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || 'sistema_desercion',
  port: Number(process.env.DB_PORT) || 3306,

  ...(isCloud && {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    }
  }),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
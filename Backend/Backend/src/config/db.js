const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mysql = require('mysql2/promise');

const host = process.env.DB_HOST || process.env.MYSQLHOST || 'localhost';
const isRailwayInternal = typeof host === 'string' && host.includes('.railway.internal');
const isCloud = host && host !== 'localhost' && host !== '127.0.0.1' && !isRailwayInternal && process.env.DB_SSL !== 'false';

const pool = mysql.createPool({
  host: host,
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'sistema_desercion',
  port: Number(process.env.DB_PORT || process.env.MYSQLPORT) || 3306,

  ...(isCloud && {
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: false
    }
  }),

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000
});

module.exports = pool;
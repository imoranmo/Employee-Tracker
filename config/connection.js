const mysql = require('mysql2');

require('dotenv').config();

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3301,
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'employee_db'
});

module.exports = connection;
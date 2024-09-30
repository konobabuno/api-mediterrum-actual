// db/db.js
const mysql = require('mysql2');
require('dotenv').config();

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT
// });

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: process.env.DB_PASSWORD_LOCAL,
  database: 'mediterrum'
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos: ' + err.stack);
    return;
  }
  console.log('Conectado a la base de datos.');
});

module.exports = connection;
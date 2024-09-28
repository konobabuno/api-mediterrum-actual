// db/db.js
const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
  host: '127.0.0.1',
  user: 'root',
  password: '',
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
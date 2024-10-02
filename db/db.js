// db/db.js
const mysql = require('mysql2');
require('dotenv').config();

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
// });

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD_LOCAL,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});


// Exportamos directamente el pool sin promesas
// module.exports = pool;

module.exports = connection;
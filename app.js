// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/users');
require('dotenv').config();

// Middleware para parsing de JSON
app.use(express.json());

app.use(cors());

// Rutas
app.use('/api', userRoutes);

const port = 3000;
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
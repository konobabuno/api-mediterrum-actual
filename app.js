const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const listasRoutes = require('./routes/listas');
require('dotenv').config();

// Middleware for parsing JSON
app.use(express.json());
app.use(cors({
    origin: '*', // Permitir desde cualquier origen
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Routes
app.use('/usuarios', userRoutes);
app.use('/clientes', clientRoutes);
app.use('/productos', productRoutes);
app.use('/carrito', cartRoutes);
app.use('/listas', listasRoutes);

const port = process.env.PORT || 3000; // Use PORT in uppercase
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

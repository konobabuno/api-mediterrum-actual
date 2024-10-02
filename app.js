const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products');
const cartRoutes = require('./routes/cart');
const listsRoutes = require('./routes/lists');
const reportRoutes = require('./routes/report');
const salesRoutes = require('./routes/sales');
require('dotenv').config();

// Middleware for parsing JSON
app.use(express.json());
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

// Routes
app.use('/usuarios', userRoutes);
app.use('/clientes', clientRoutes);
app.use('/productos', productRoutes);
app.use('/carrito', cartRoutes);
app.use('/listas', listsRoutes);
app.use('/reporte', reportRoutes);
app.use('/ventas', salesRoutes)

const port = process.env.PORT || 3000; 
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

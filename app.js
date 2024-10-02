const express = require('express');
const cors = require('cors');
const app = express();
const userRoutes = require('./routes/users');
const clientRoutes = require('./routes/clients');
const productRoutes = require('./routes/products');
require('dotenv').config();

// Middleware for parsing JSON
app.use(express.json());
app.use(cors());

// Routes
app.use('/usuarios', userRoutes);
app.use('/clientes', clientRoutes);
app.use('/productos', productRoutes);

const port = process.env.PORT || 3000; // Use PORT in uppercase
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});

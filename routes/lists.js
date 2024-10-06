// routes/usuarios.js
const express = require('express');
const router = express.Router();
const dvController = require('../controllers/dist-vend.js');
const verificarToken = require('../middleware/auth');

// Verificar Token
router.use(verificarToken);

// Ruta para obtener la lista de distribuidores
router.get('/distribuidores', dvController.obtenerListaDistribuidores);

// Ruta para obtener la lista de vendedores
router.get('/vendedores', dvController.obtenerListaVendedores);

module.exports = router;
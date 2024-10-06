const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.js');
const verificarToken = require('../middleware/auth');

// Verificar Token
router.use(verificarToken);

// Ruta para agregar un producto al carrito
router.post('/agregar', cartController.agregarProductoCarrito);

// Ruta para obtener los productos en el carrito de un usuario
router.get('/:usuario_id', cartController.obtenerProductosEnCarrito);

// Ruta para modificar la cantidad de productos en un carrito
router.put('/modificar-cantidad', cartController.modificarCantidadProductoCarrito);

// Ruta para eliminar un producto de un carrito
router.delete('/eliminar-producto', cartController.eliminarProductoCarrito);

module.exports = router;
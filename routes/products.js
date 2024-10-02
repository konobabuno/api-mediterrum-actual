const express = require('express');
const router = express.Router();
const productsController = require('../controllers/products.js');

// Ruta para obtener todos los productos
router.get('/', productsController.obtenerProductosTodos);

// Ruta para obtener un producto por SKU
router.get('/:sku', productsController.obtenerProductoPorSKU);

// Ruta para insertar un producto
router.post('/', productsController.insertarProducto);

// Ruta para modificar los datos de un producto
router.put('/:sku', productsController.modificarProducto);

// Ruta para modificar el inventario de un producto
router.put('/:sku/inventario', productsController.modificarInventario);

// Ruta para eliminar un producto
router.delete('/:sku', productsController.eliminarProducto);

module.exports = router;
const express = require('express');
const router = express.Router();
const clientsController = require('../controllers/clients');

// CLIENTES

// Ruta para insertar un cliente
router.post('/', clientsController.insertarCliente);

// Ruta para obtener todos los clientes
router.get('/', clientsController.obtenerClientesTodos);

// Ruta para obtener un cliente por ID
router.get('/:id', clientsController.obtenerCliente);

// Ruta para obtener un cliente por parametro
router.get('/param/:param', clientsController.obtenerClienteParametro);

// Ruta para obtener un cliente por el nombre de su usuario
router.get('/usuario/:usuario', clientsController.obtenerClienteUsuario);

// Ruta para eliminar un cliente
router.delete('/:id', clientsController.eliminarCliente);

module.exports = router;

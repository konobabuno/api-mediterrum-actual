// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// USUARIOS
// Ruta para obtener usuarios
router.get('/users', usersController.obtenerUsuariosTodos);

// Ruta para obtener un usuario por ID
router.get('/users/:id', usersController.obtenerUsuario);

// Ruta para obtener la red de un usuario
router.get('/users/:id/network', usersController.obtenerUsuarioRed);


// Ruta para insertar un usuario
router.post('/users', usersController.insertarUsuario);

// Ruta para eliminar un usuario
router.delete('/users/:id', usersController.eliminarUsuario);

// Ruta para modificar un usuario (protegida)
router.put('/users/:id', usersController.modificarUsuarioDatos);

// Ruta para modificar el rol de un usuario por ID (protegida)
router.put('/users/:id/role', usersController.modificarUsuarioRol);

// Ruta para modificar el rol de un usuario por ID (protegida)
router.put('/users/:id/pwd', usersController.modificarUsuarioContrasena);

// Ruta para modificar el vendedor de un usuario
router.put('/users/:id/seller', usersController.modificarUsuarioVendedor);


module.exports = router;
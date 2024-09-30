// routes/users.js
const express = require('express');
const router = express.Router();
const usersController = require('../controllers/users');

// Ruta para obtener usuarios
router.get('/users', usersController.obtenerUsuarios);

// Ruta para insertar un usuario
router.post('/users', usersController.insertarUsuario);

// Ruta para eliminar un usuario
router.delete('/users/:id', usersController.eliminarUsuario);


module.exports = router;
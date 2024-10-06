const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth');
const usersController = require('../controllers/users');
const fs = require('fs'); 

// USUARIOS

// Ruta para login.
router.post('/login', usersController.loginUsuario);

// Verificar Token
router.use(verificarToken);

// Ruta para obtener usuarios
router.get('/', usersController.obtenerUsuariosTodos);

// Ruta para obtener el archivo Excel con los usuarios
router.get('/excel', usersController.getUsuariosExcel);

// Ruta para obtener un usuario por ID
router.get('/:id', usersController.obtenerUsuario);

// Ruta para obtener un usuario por parametro
router.get('/param/:param', usersController.obtenerUsuarioParametro);

// Ruta para obtener la red de un usuario
router.get('/:id/red', usersController.obtenerUsuarioRed);

// Ruta para obtener las relaciones de un usuario
router.get('/:id/relaciones', usersController.obtenerUsuarioRelaciones);

// Ruta para obtener los puntos trimestrales de un usuario
router.get('/:id/puntos_trimestre', usersController.obtenerUsuarioPuntosTrimestre);

// Ruta para obtener el distribuidor de un usuario
router.get('/:id/distribuidor', usersController.obtenerUsuarioDistribuidor);

// Ruta para obtener el vendedor de un usuario
router.get('/:id/vendedor', usersController.obtenerUsuarioVendedor);

// Ruta para obtener el historial de un usuario
router.get('/:id/historial', usersController.obtenerUsuarioHistorial);

// Ruta para insertar un usuario
router.post('/', usersController.insertarUsuario);

// Ruta para eliminar un usuario
router.delete('/:id', usersController.eliminarUsuario);

// Ruta para modificar un usuario
router.put('/:id', usersController.modificarUsuarioDatos);

// Ruta para modificar el rol de un usuario por ID (protegida)
router.put('/:id/rol', usersController.modificarUsuarioRol);

// Ruta para modificar el rol de un usuario por ID (protegida)
router.put('/:id/contrasena', usersController.modificarUsuarioContrasena);

// Ruta para modificar el vendedor de un usuario
router.put('/:id/vendedor', usersController.modificarUsuarioVendedor);

// Ruta para modificar el vendedor de un usuario
router.put('/:id/distribuidor', usersController.modificarUsuarioDistribuidor);

// Ruta para reiniciar los puntos y nivel de los distribuidores
router.post('/reiniciar', usersController.reiniciarPuntosNivel);


module.exports = router;
const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report');

// Ruta para obtener el top N de usuarios de un trimestre
router.get('/top-usuarios', reportController.obtenerTopNTrimestre);

// Ruta para obtener el top N de usuarios de un trimestre
router.get('/top-usuarios/:fecha/:topN', reportController.obtenerTopNTrimestre);

module.exports = router;

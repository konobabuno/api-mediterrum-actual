const express = require('express');
const router = express.Router();
const reportController = require('../controllers/report');

// Ruta para obtener el top N de usuarios de un trimestre
router.get('/top-usuarios/:fecha/:topN', reportController.obtenerTopNTrimestre);

// Ruta para obtener el reporte trimestral por red
router.get('/reporte-trimestral-red/:fecha/:usuario_id', reportController.obtenerRedReporteTrimestral);

module.exports = router;

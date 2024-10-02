const express = require('express');
const router = express.Router();
const salesController = require('../controllers/sales');

// VENTAS


// Ruta para realizar una venta
router.post('/', salesController.realizarVenta);

// Ruta para obtener todas las ventas
router.get('/', salesController.obtenerVentas);

// Ruta para obtener las ventas de una fecha específica
router.get('/fecha/:fecha', salesController.obtenerVentasPorFecha);

// Ruta para obtener las ventas de una semana dada una fecha
router.get('/semana/:fecha', salesController.obtenerVentasPorSemana);

// Ruta para obtener las ventas de un mes dada una fecha
router.get('/mes/:fecha', salesController.obtenerVentasPorMes);

// Ruta para obtener las ventas de un año dada una fecha
router.get('/anio/:fecha', salesController.obtenerVentasPorAnio);

// Ruta para obtener las ventas de un trimestre dada una fecha
router.get('/trimestre/:fecha', salesController.obtenerVentasPorTrimestre);

// Ruta para obtener las ventas de un usuario
router.get('/usuario/:id', salesController.obtenerVentasPorUsuario);

// Ruta para obtener una venta por ID
router.get('/:id', salesController.obtenerVentaPorId);

module.exports = router;
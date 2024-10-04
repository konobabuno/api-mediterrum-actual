const connection = require('../db/db');

// Realizar una venta
const realizarVenta = (req, res) => {
    const { usuario_id, fecha_entrega, lugar_entrega } = req.body;
    const query = 'CALL realizar_venta(?, ?, ?)';
    connection.query(query, [usuario_id, fecha_entrega, lugar_entrega], (error, results) => {
        if (error) {
            res.status(500).json({
                mensaje: error.sqlMessage
            });
        } else {
            res.status(201).json({
                message: 'Venta realizada con éxito',
                results: results
            });
        }
    });
};

// Obtener todas las ventas
const obtenerVentas = (req, res) => {
    const query = 'CALL obtener_ventas_todas()';
    connection.query(query, (error, results) => {
        if (error) {
            res.status(500).json({
                message: 'Error al obtener las ventas',
                error: error
            });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

// Obtener las ventas de una fecha específica
const obtenerVentasPorFecha = (req, res) => {
    const { fecha } = req.params;
    const query = 'CALL obtener_ventas_fecha(?)';
    connection.query(query, [fecha], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else if (results[0].length === 0) {
            res.status(404).json({ message: 'No hay ventas registradas en la fecha dada' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

// Obtener las ventas de una semana dada una fecha
const obtenerVentasPorSemana = (req, res) => {
    const { fecha } = req.params;
    const query = 'CALL obtener_ventas_semana(?)';
    connection.query(query, [fecha], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else if (results[0].length === 0) {
            res.status(404).json({ message: 'No hay ventas registradas en la semana dada' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

// Obtener las ventas de un mes dada una fecha
const obtenerVentasPorMes = (req, res) => {
    const { fecha } = req.params;
    const query = 'CALL obtener_ventas_mes(?)';
    connection.query(query, [fecha], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else if (results[0].length === 0) {
            res.status(404).json({ message: 'No hay ventas registradas en el mes dado' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

// Obtener las ventas de un año dada una fecha
const obtenerVentasPorAnio = (req, res) => {
    const { fecha } = req.params;
    const query = 'CALL obtener_ventas_anio(?)';
    connection.query(query, [fecha], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else if (results[0].length === 0) {
            res.status(404).json({ message: 'No hay ventas registradas en el año dado' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

// Obtener las ventas de un trimestre dada una fecha
const obtenerVentasPorTrimestre = (req, res) => {
    const { fecha } = req.params;
    const query = 'CALL obtener_ventas_trimestre(?)';
    connection.query(query, [fecha], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else if (results[0].length === 0) {
            res.status(404).json({ message: 'No hay ventas registradas en el trimestre dado' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

// Obtener las ventas de un usuario
const obtenerVentasPorUsuario = (req, res) => {
    const { id } = req.params;
    const query = 'CALL obtener_ventas_usuario(?)';
    connection.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else if (results[0].length === 0) {
            res.status(404).json({ message: 'No hay ventas para el usuario dado' });
        } else {
            res.status(200).json(results[0]);
        }
    });
}

// Obtener una venta por ID
const obtenerVentaPorId = (req, res) => {
    const { id } = req.params;
    const query = 'CALL obtener_venta_id(?)';
    connection.query(query, [id], (error, results) => {
        if (error) {
            res.status(500).json(error);
        } else if (results[0].length === 0) {
            res.status(404).json({ message: 'No hay una venta con el ID dado' });
        } else {
            res.status(200).json(results[0]);
        }
    });
};

module.exports = {
    realizarVenta,
    obtenerVentas,
    obtenerVentasPorFecha,
    obtenerVentasPorSemana,
    obtenerVentasPorMes,
    obtenerVentasPorAnio,
    obtenerVentasPorTrimestre,
    obtenerVentasPorUsuario, 
    obtenerVentaPorId
};

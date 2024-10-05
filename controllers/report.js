const connection = require('../db/db');

// controllers/usuariosController.js
const pool = require('../db/db');

function obtenerTopNTrimestre(req, res) {
    const { fecha, topN } = req.params;

    if (!fecha || !topN) {
        return res.status(400).send('La fecha y el top N son requeridos.');
    }

    const query = `CALL obtener_topN_trimestre(?, ?)`;

    pool.query(query, [fecha, topN], (err, results) => {
        if (err) {
            console.error('Error ejecutando el procedimiento: ' + err.message);
            return res.status(500).send('Error en el servidor al ejecutar el procedimiento.');
        }

        if (results.length > 0 && results[0].length > 0) {
            return res.status(200).json(results[0]);
        } else {
            return res.status(404).send('No se encontraron usuarios para el trimestre especificado.');
        }
    });
}


// Obtener reporte trimestral por red
const obtenerRedReporteTrimestral = (req, res) => {
    const { fecha, usuario_id } = req.params;  // Se toman de los params

    if (!fecha || !usuario_id) {
        return res.status(400).json({ message: 'Fecha y usuario_id son requeridos' });
    }

    const query = 'CALL obtener_red_reporte_trimestral(?, ?)';
    connection.query(query, [fecha, usuario_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.status(200).json(results[0]);
    });
};

module.exports = {
    obtenerRedReporteTrimestral,
    obtenerTopNTrimestre
};
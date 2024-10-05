const connection = require('../db/db');

// Obtener la lista de distribuidores
const obtenerListaDistribuidores = (req, res) => {
    const query = 'SELECT id, nombre FROM usuarios WHERE rol = "distribuidor"';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        // Si no hay distribuidores, retorna el mensaje adecuado
        if (results.length === 0) {
            return res.status(404).send({ message: 'No distributors found' });
        }

        // Retorna todos los distribuidores en el arreglo 'results'
        res.status(200).json(results); 
    });
};

// Obtener la lista de vendedores
const obtenerListaVendedores = (req, res) => {
    const query = 'CALL obtener_lista_vendedores()';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).json(results[0]); 
    });
};


module.exports = {
    obtenerListaDistribuidores,
    obtenerListaVendedores
};
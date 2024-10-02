const connection = require('../db/db');

// Obtener la lista de distribuidores
const obtenerListaDistribuidores = (req, res) => {
    const query = 'CALL obtener_lista_distribuidores()';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).json(results[0]); // Devuelve la lista de distribuidores
    });
};

// Obtener la lista de vendedores
const obtenerListaVendedores = (req, res) => {
    const query = 'CALL obtener_lista_vendedores()';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        res.status(200).json(results[0]); // Devuelve la lista de vendedores
    });
};


module.exports = {
    obtenerListaDistribuidores,
    obtenerListaVendedores
};
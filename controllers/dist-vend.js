const connection = require('../db/db');

// Obtener la lista de distribuidores
const obtenerListaDistribuidores = (req, res) => {
    const query = 'CALL obtener_lista_distribuidores()';

    connection.query(query, (err, results) => {
        if (err) {
            return res.status(500).send(err);
        }

        if (results[0].length === 0) {
            return res.status(404).send({ message: 'No distributors found' });
        }

        res.status(200).json(results[0]); 
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